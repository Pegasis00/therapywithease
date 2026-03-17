import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { db } from '../src/db/index.js';
import { profiles, moodCheckins, appointments, assessments, clinicalNotes } from '../src/db/schema.js';
import { eq, desc, and, count, gte } from 'drizzle-orm';
import { jwtVerify, createRemoteJWKSet, JWTPayload } from 'jose';

dotenv.config();

const app = express();

// ─── Extend Express Request Type ──────────────────────────────
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

// ─── Request Logging Middleware ───────────────────────────────
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });
  next();
});

// ─── JWKS Setup ───────────────────────────────────────────────
const kindeDomain = (process.env.VITE_KINDE_DOMAIN || '').replace(/\/$/, '');

if (!kindeDomain) {
  console.warn('⚠️  VITE_KINDE_DOMAIN is not set! JWT validation will fail.');
}

const JWKS = createRemoteJWKSet(
  new URL(`${kindeDomain}/.well-known/jwks.json`)
);

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    db: 'Neon Postgres Connected!',
    kinde: kindeDomain,
  });
});

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────
const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    // Since Kinde React without an Audience gives us an opaque access token, 
    // it is NOT a JWT and cannot be decoded mathematically. 
    // Instead, we use it to securely ask Kinde for the user's details.
    const response = await fetch(`${kindeDomain}/oauth2/v2/user_profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error((await response.text()) || response.statusText);
    }

    const kindeUser = await response.json();
    req.user = { sub: kindeUser.id, ...kindeUser };
    
    next();
  } catch (err: any) {
    console.error('❌ Kinde Token Validation Failed:', err?.message || err);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token', details: err?.message });
  }
};

// ─── SYNC USER ────────────────────────────────────────────────
app.post('/api/users/sync', protectRoute, async (req: Request, res: Response) => {
  try {
    const userRole = (req.body.role as string) || 'patient';
    const userId = req.user?.sub as string;
    const { email, full_name } = req.body as { email: string; full_name: string };

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID in token' });
    }

    const existingUser = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      const validRoles = ['patient', 'psychiatrist', 'therapist'] as const;
      const safeRole = validRoles.includes(userRole as any)
        ? (userRole as typeof validRoles[number])
        : 'patient';

      const [newUser] = await db
        .insert(profiles)
        .values({
          id: userId,
          email: email || `${userId}@unknown.com`,
          fullName: full_name || null,
          role: safeRole,
        })
        .returning();

      return res.status(201).json({ message: 'Profile created', profile: newUser });
    }

    return res.status(200).json({ message: 'Profile exists', profile: existingUser[0] });
  } catch (error) {
    console.error('Failed to sync user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── GET PROFILE ──────────────────────────────────────────────
app.get('/api/profile', protectRoute, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub as string;

    const userProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (userProfile.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json(userProfile[0]);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── PATIENT STATS ────────────────────────────────────────────
app.get('/api/dashboard/patient/stats', protectRoute, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub as string;

    const [moodCountResult, sessionCountResult, latestPhq9] = await Promise.all([
      db.select({ value: count() }).from(moodCheckins).where(eq(moodCheckins.userId, userId)),
      db.select({ value: count() }).from(appointments).where(
        and(eq(appointments.patientId, userId), eq(appointments.status, 'completed'))
      ),
      db.select({ score: assessments.score })
        .from(assessments)
        .where(and(eq(assessments.userId, userId), eq(assessments.type, 'PHQ-9')))
        .orderBy(desc(assessments.createdAt))
        .limit(1),
    ]);

    res.json({
      moodCount: Number(moodCountResult[0].value),
      sessionCount: Number(sessionCountResult[0].value),
      latestPhq9Score: latestPhq9.length > 0 ? latestPhq9[0].score : null,
    });
  } catch (error) {
    console.error('Failed to fetch patient stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── MOOD CHECKIN ─────────────────────────────────────────────
app.post('/api/mood_checkins', protectRoute, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub as string;
    const { mood, moodScore, note } = req.body;

    if (!mood) {
      return res.status(400).json({ error: 'mood field is required' });
    }

    const [newCheckin] = await db
      .insert(moodCheckins)
      .values({
        userId,
        mood,
        moodScore: moodScore ?? null,
        note: note ?? null,
      })
      .returning();

    res.status(201).json(newCheckin);
  } catch (error) {
    console.error('Failed to insert mood checkin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── GET PATIENTS ─────────────────────────────────────────────
app.get('/api/patients', protectRoute, async (_req: Request, res: Response) => {
  try {
    const data = await db
      .select({
        id: profiles.id,
        full_name: profiles.fullName,
        email: profiles.email,
      })
      .from(profiles)
      .where(eq(profiles.role, 'patient'))
      .orderBy(profiles.fullName);

    res.json(data);
  } catch (err) {
    console.error('Failed to fetch patients:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── MOOD HISTORY ─────────────────────────────────────────────
app.get('/api/mood_checkins/history', protectRoute, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub as string;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const checkins = await db
      .select()
      .from(moodCheckins)
      .where(
        and(
          eq(moodCheckins.userId, userId),
          gte(moodCheckins.createdAt, sevenDaysAgo)
        )
      )
      .orderBy(moodCheckins.createdAt);

    res.json(checkins);
  } catch (err) {
    console.error('Failed to fetch mood history:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── POST ASSESSMENT ──────────────────────────────────────────
app.post('/api/assessments', protectRoute, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.sub as string;
    const { type, score, severity, answers } = req.body;

    if (!type || score === undefined) {
      return res.status(400).json({ error: 'type and score are required' });
    }

    const [newAssessment] = await db
      .insert(assessments)
      .values({
        userId,
        type,
        score,
        severity: severity ?? null,
        answers: answers ?? null,
      })
      .returning();

    res.status(201).json(newAssessment);
  } catch (err) {
    console.error('Failed to save assessment:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── GET CLINICAL NOTES ───────────────────────────────────────
app.get('/api/clinical_notes/:patientId', protectRoute, async (req: Request, res: Response) => {
  try {
    const patientId = req.params.patientId as string;
    const authorId = req.user?.sub as string;

    const notes = await db
      .select()
      .from(clinicalNotes)
      .where(
        and(
          eq(clinicalNotes.patientId, patientId),
          eq(clinicalNotes.authorId, authorId)
        )
      )
      .orderBy(desc(clinicalNotes.createdAt));

    res.json(notes);
  } catch (err) {
    console.error('Failed to fetch clinical notes:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── POST CLINICAL NOTE ───────────────────────────────────────
app.post('/api/clinical_notes', protectRoute, async (req: Request, res: Response) => {
  try {
    const authorId = req.user?.sub as string;
    const { patientId, content, isPrivate } = req.body;

    if (!patientId || !content?.trim()) {
      return res.status(400).json({ error: 'patientId and content are required' });
    }

    const [note] = await db
      .insert(clinicalNotes)
      .values({
        authorId,
        patientId,
        content: content.trim(),
        isPrivate: isPrivate ?? true,
      })
      .returning();

    res.status(201).json(note);
  } catch (err) {
    console.error('Failed to save clinical note:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── Server Startup ───────────────────────────────────────────
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`Kinde domain: ${kindeDomain}`);
    console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : '❌ Missing'}`);
  });
}

export default app;
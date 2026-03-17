import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { db } from '../src/db/index';
import { profiles, moodCheckins, appointments, assessments, clinicalNotes } from '../src/db/schema';
import { eq, desc, and, count, gte } from 'drizzle-orm';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'Neon Postgres Connected!' });
});

// Since @kinde-oss/kinde-node-express handles JWT validation securely
// Let's create a manual validation middleware if the SDK isn't perfectly suited for pure headless JWT validation or just read headers.
// The frontend passes the Access Token in Authorization header: Bearer <token>
import { jwtVerify, createRemoteJWKSet } from 'jose';

// Fetch Kinde JWKs for JWT validation (Industry-grade security)
const JWKS = createRemoteJWKSet(new URL(`${process.env.VITE_KINDE_DOMAIN}/.well-known/jwks.json`));

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────
const protectRoute = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${process.env.VITE_KINDE_DOMAIN}/`,
    });
    // Attach decoded user to the request
    (req as any).user = payload;
    next();
  } catch (err) {
    console.error('JWT Verification Failed:', err);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// ─── SYNC USER ENDPOINT ───────────────────────────────────────
app.post('/api/users/sync', protectRoute, async (req, res) => {
  try {
    const userRole = req.body.role || 'patient';
    // user ID from Kinde JWT is located at (req as any).user.sub
    const userId = (req as any).user.sub;
    
    // Fallback if Kinde token doesn't include specific profile fields (like email/name)
    // we take them from the body sent by frontend, but the ID absolutely must come from JWT.
    const { email, full_name } = req.body;

    // Check if user exists
    const existingUser = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);

    if (existingUser.length === 0) {
      // Create user
      const [newUser] = await db.insert(profiles).values({
        id: userId,
        email: email,
        fullName: full_name,
        role: userRole,
      }).returning();
      
      return res.status(201).json({ message: 'Profile created', profile: newUser });
    }

    return res.status(200).json({ message: 'Profile exists', profile: existingUser[0] });

  } catch (error) {
    console.error('Failed to sync user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── GET PROFILE ENDPOINT ─────────────────────────────────────
app.get('/api/profile', protectRoute, async (req, res) => {
  try {
    const userId = (req as any).user.sub;
    const userProfile = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
    
    if (userProfile.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    return res.status(200).json(userProfile[0]);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ─── GET PATIENT STATS ────────────────────────────────────────
app.get('/api/dashboard/patient/stats', protectRoute, async (req, res) => {
  try {
    const userId = (req as any).user.sub;

    const moodCountResult = await db.select({ value: count() }).from(moodCheckins).where(eq(moodCheckins.userId, userId));
    const sessionCountResult = await db.select({ value: count() }).from(appointments).where(and(eq(appointments.patientId, userId), eq(appointments.status, 'completed')));
    const latestPhq9 = await db.select({ score: assessments.score }).from(assessments).where(and(eq(assessments.userId, userId), eq(assessments.type, 'PHQ-9'))).orderBy(desc(assessments.createdAt)).limit(1);

    res.json({
      moodCount: moodCountResult[0].value,
      sessionCount: sessionCountResult[0].value,
      latestPhq9Score: latestPhq9.length > 0 ? latestPhq9[0].score : null
    });
  } catch (error) {
    console.error('Failed to fetch patient stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── POST MOOD CHECKIN ────────────────────────────────────────
app.post('/api/mood_checkins', protectRoute, async (req, res) => {
  try {
    const userId = (req as any).user.sub;
    const { mood, moodScore, note } = req.body;

    const [newCheckin] = await db.insert(moodCheckins).values({
      userId,
      mood,
      moodScore,
      note,
    }).returning();

    res.status(201).json(newCheckin);
  } catch (error) {
    console.error('Failed to insert mood checkin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── GET PATIENTS ─────────────────────────────────────────────
app.get('/api/patients', protectRoute, async (req, res) => {
  try {
    const data = await db.select({
      id: profiles.id,
      full_name: profiles.fullName,
      email: profiles.email
    })
    .from(profiles)
    .where(eq(profiles.role, 'patient'))
    .orderBy(profiles.fullName);
    
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── GET MOOD HISTORY (Last 7 Days) ───────────────────────────
app.get('/api/mood_checkins/history', protectRoute, async (req, res) => {
  try {
    const userId = (req as any).user.sub;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const checkins = await db.select()
      .from(moodCheckins)
      .where(and(eq(moodCheckins.userId, userId), gte(moodCheckins.createdAt, sevenDaysAgo)))
      .orderBy(moodCheckins.createdAt);
      
    res.json(checkins);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── POST ASSESSMENT (PHQ-9) ──────────────────────────────────
app.post('/api/assessments', protectRoute, async (req, res) => {
  try {
    const userId = (req as any).user.sub;
    const { type, score, severity, answers } = req.body;

    const [newAssessment] = await db.insert(assessments).values({
      userId, type, score, severity, answers
    }).returning();

    res.status(201).json(newAssessment);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ─── CLINICAL NOTES ───────────────────────────────────────────
app.get('/api/clinical_notes/:patientId', protectRoute, async (req, res) => {
  try {
    const { patientId } = req.params;
    const authorId = (req as any).user.sub; // The therapist/psychiatrist requesting

    const notes = await db.select()
      .from(clinicalNotes)
      .where(and(eq(clinicalNotes.patientId, patientId as string), eq(clinicalNotes.authorId, authorId)))
      .orderBy(desc(clinicalNotes.createdAt));
      
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/clinical_notes', protectRoute, async (req, res) => {
  try {
    const authorId = (req as any).user.sub;
    const { patientId, content, isPrivate } = req.body;

    const [note] = await db.insert(clinicalNotes).values({
      authorId, patientId, content, isPrivate
    }).returning();

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend secure server running on http://localhost:${PORT}`);
  });
}

export default app;

-- ==============================================================
-- TherapEASE — Full Reset & Rebuild Schema
-- Safe to run multiple times. Drops everything first, then
-- recreates all tables, policies, functions, and triggers.
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ==============================================================


-- ──────────────────────────────────────────────────────────────
-- STEP 1: DROP EVERYTHING (clean slate)
-- ──────────────────────────────────────────────────────────────

-- Drop triggers first
DROP TRIGGER IF EXISTS profiles_updated_at   ON public.profiles;
DROP TRIGGER IF EXISTS notes_updated_at      ON public.clinical_notes;

-- Drop function
DROP FUNCTION IF EXISTS public.set_updated_at();

-- Drop tables (in reverse dependency order)
DROP TABLE IF EXISTS public.referrals        CASCADE;
DROP TABLE IF EXISTS public.messages         CASCADE;
DROP TABLE IF EXISTS public.clinical_notes   CASCADE;
DROP TABLE IF EXISTS public.assessments      CASCADE;
DROP TABLE IF EXISTS public.group_members    CASCADE;
DROP TABLE IF EXISTS public.support_groups   CASCADE;
DROP TABLE IF EXISTS public.appointments     CASCADE;
DROP TABLE IF EXISTS public.mood_checkins    CASCADE;
DROP TABLE IF EXISTS public.profiles         CASCADE;

-- Drop enums
DROP TYPE IF EXISTS public.user_role         CASCADE;
DROP TYPE IF EXISTS public.appointment_status CASCADE;


-- ──────────────────────────────────────────────────────────────
-- STEP 2: CREATE ENUMS
-- ──────────────────────────────────────────────────────────────

CREATE TYPE public.user_role AS ENUM (
    'patient',
    'psychiatrist',
    'therapist'
);

CREATE TYPE public.appointment_status AS ENUM (
    'scheduled',
    'completed',
    'cancelled'
);


-- ──────────────────────────────────────────────────────────────
-- STEP 3: CREATE TABLES
-- ──────────────────────────────────────────────────────────────

-- ── 3.1  PROFILES ─────────────────────────────────────────────
-- id is a TEXT because Kinde IDs are strings (e.g. "kp_abc123")
CREATE TABLE public.profiles (
    id          TEXT                PRIMARY KEY,
    email       TEXT                NOT NULL UNIQUE,
    full_name   TEXT,
    avatar_url  TEXT,
    role        public.user_role    NOT NULL DEFAULT 'patient',
    bio         TEXT,
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

-- ── 3.2  MOOD CHECK-INS ───────────────────────────────────────
CREATE TABLE public.mood_checkins (
    id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     TEXT        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mood        TEXT        NOT NULL,          -- 'Great' | 'Okay' | 'Not Good'
    mood_score  SMALLINT,                      -- 1–10 numeric scale
    note        TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3.3  APPOINTMENTS ─────────────────────────────────────────
CREATE TABLE public.appointments (
    id              UUID                        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id      TEXT                        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    professional_id TEXT                        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scheduled_at    TIMESTAMPTZ                 NOT NULL,
    duration_mins   SMALLINT                    NOT NULL DEFAULT 50,
    type            TEXT                        NOT NULL DEFAULT 'therapy',  -- 'therapy' | 'psychiatry' | 'group'
    status          public.appointment_status   NOT NULL DEFAULT 'scheduled',
    notes           TEXT,
    created_at      TIMESTAMPTZ                 NOT NULL DEFAULT NOW()
);

-- ── 3.4  SUPPORT GROUPS ───────────────────────────────────────
CREATE TABLE public.support_groups (
    id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name         TEXT        NOT NULL,
    description  TEXT,
    leader_id    TEXT        REFERENCES public.profiles(id) ON DELETE SET NULL,
    max_members  SMALLINT    NOT NULL DEFAULT 10,
    next_session TIMESTAMPTZ,
    is_active    BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3.5  GROUP MEMBERSHIPS ────────────────────────────────────
CREATE TABLE public.group_members (
    group_id    UUID        NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
    user_id     TEXT        NOT NULL REFERENCES public.profiles(id)       ON DELETE CASCADE,
    joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

-- ── 3.6  ASSESSMENTS (PHQ-9, GAD-7, …) ───────────────────────
CREATE TABLE public.assessments (
    id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     TEXT        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type        TEXT        NOT NULL,   -- 'PHQ-9' | 'GAD-7'
    score       SMALLINT    NOT NULL,
    severity    TEXT,                   -- 'Minimal' | 'Mild' | 'Moderate' | 'Severe'
    answers     JSONB,                  -- { responses: [0,1,2,...] }
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3.7  CLINICAL NOTES ───────────────────────────────────────
CREATE TABLE public.clinical_notes (
    id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id   TEXT        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_id  TEXT        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content     TEXT        NOT NULL,
    is_private  BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3.8  MESSAGES ─────────────────────────────────────────────
CREATE TABLE public.messages (
    id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id    TEXT        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id  TEXT        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content      TEXT        NOT NULL,
    is_read      BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 3.9  REFERRALS ────────────────────────────────────────────
CREATE TABLE public.referrals (
    id          UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    from_id     TEXT        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    to_id       TEXT        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_id  TEXT        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason      TEXT,
    status      TEXT        NOT NULL DEFAULT 'pending',  -- 'pending' | 'accepted' | 'declined'
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ──────────────────────────────────────────────────────────────
-- STEP 4: ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ──────────────────────────────────────────────────────────────

ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_checkins  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals      ENABLE ROW LEVEL SECURITY;


-- ──────────────────────────────────────────────────────────────
-- STEP 5: ROW LEVEL SECURITY POLICIES
-- (Using permissive policies — the frontend uses the anon key
--  and Kinde handles auth outside Supabase)
-- ──────────────────────────────────────────────────────────────

-- ── PROFILES ──────────────────────────────────────────────────
CREATE POLICY "profiles: anyone can read"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "profiles: anyone can insert"
    ON public.profiles FOR INSERT WITH CHECK (true);

CREATE POLICY "profiles: anyone can update"
    ON public.profiles FOR UPDATE USING (true);

-- ── MOOD CHECK-INS ────────────────────────────────────────────
CREATE POLICY "mood_checkins: anyone can read"
    ON public.mood_checkins FOR SELECT USING (true);

CREATE POLICY "mood_checkins: anyone can insert"
    ON public.mood_checkins FOR INSERT WITH CHECK (true);

-- ── APPOINTMENTS ──────────────────────────────────────────────
CREATE POLICY "appointments: anyone can read"
    ON public.appointments FOR SELECT USING (true);

CREATE POLICY "appointments: anyone can insert"
    ON public.appointments FOR INSERT WITH CHECK (true);

CREATE POLICY "appointments: anyone can update"
    ON public.appointments FOR UPDATE USING (true);

-- ── SUPPORT GROUPS ────────────────────────────────────────────
CREATE POLICY "support_groups: anyone can read"
    ON public.support_groups FOR SELECT USING (true);

CREATE POLICY "support_groups: anyone can insert"
    ON public.support_groups FOR INSERT WITH CHECK (true);

CREATE POLICY "support_groups: anyone can update"
    ON public.support_groups FOR UPDATE USING (true);

-- ── GROUP MEMBERS ─────────────────────────────────────────────
CREATE POLICY "group_members: anyone can read"
    ON public.group_members FOR SELECT USING (true);

CREATE POLICY "group_members: anyone can insert"
    ON public.group_members FOR INSERT WITH CHECK (true);

CREATE POLICY "group_members: anyone can delete"
    ON public.group_members FOR DELETE USING (true);

-- ── ASSESSMENTS ───────────────────────────────────────────────
CREATE POLICY "assessments: anyone can read"
    ON public.assessments FOR SELECT USING (true);

CREATE POLICY "assessments: anyone can insert"
    ON public.assessments FOR INSERT WITH CHECK (true);

-- ── CLINICAL NOTES ────────────────────────────────────────────
CREATE POLICY "clinical_notes: anyone can read"
    ON public.clinical_notes FOR SELECT USING (true);

CREATE POLICY "clinical_notes: anyone can insert"
    ON public.clinical_notes FOR INSERT WITH CHECK (true);

CREATE POLICY "clinical_notes: anyone can update"
    ON public.clinical_notes FOR UPDATE USING (true);

-- ── MESSAGES ──────────────────────────────────────────────────
CREATE POLICY "messages: anyone can read"
    ON public.messages FOR SELECT USING (true);

CREATE POLICY "messages: anyone can insert"
    ON public.messages FOR INSERT WITH CHECK (true);

CREATE POLICY "messages: anyone can update"
    ON public.messages FOR UPDATE USING (true);

-- ── REFERRALS ─────────────────────────────────────────────────
CREATE POLICY "referrals: anyone can read"
    ON public.referrals FOR SELECT USING (true);

CREATE POLICY "referrals: anyone can insert"
    ON public.referrals FOR INSERT WITH CHECK (true);

CREATE POLICY "referrals: anyone can update"
    ON public.referrals FOR UPDATE USING (true);


-- ──────────────────────────────────────────────────────────────
-- STEP 6: HELPER FUNCTION — auto-update updated_at
-- ──────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


-- ──────────────────────────────────────────────────────────────
-- STEP 7: TRIGGERS
-- ──────────────────────────────────────────────────────────────

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE PROCEDURE public.set_updated_at();

CREATE TRIGGER notes_updated_at
    BEFORE UPDATE ON public.clinical_notes
    FOR EACH ROW
    EXECUTE PROCEDURE public.set_updated_at();


-- ──────────────────────────────────────────────────────────────
-- DONE ✅
-- All tables, policies, functions, and triggers are ready.
-- You can now sign in via Kinde and user profiles will be
-- created automatically with the correct role.
-- ──────────────────────────────────────────────────────────────

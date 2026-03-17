import {
  pgTable,
  text,
  timestamp,
  uuid,
  smallint,
  boolean,
  jsonb,
  primaryKey,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['patient', 'psychiatrist', 'therapist']);
export const appointmentStatusEnum = pgEnum('appointment_status', ['scheduled', 'completed', 'cancelled']);

// Tables
export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(), // Kinde ID
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').notNull().default('patient'),
  bio: text('bio'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const moodCheckins = pgTable('mood_checkins', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  mood: text('mood').notNull(),
  moodScore: smallint('mood_score'),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: text('patient_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  professionalId: text('professional_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  durationMins: smallint('duration_mins').notNull().default(50),
  type: text('type').notNull().default('therapy'),
  status: appointmentStatusEnum('status').notNull().default('scheduled'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const supportGroups = pgTable('support_groups', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  leaderId: text('leader_id').references(() => profiles.id, { onDelete: 'set null' }),
  maxMembers: smallint('max_members').notNull().default(10),
  nextSession: timestamp('next_session', { withTimezone: true }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const groupMembers = pgTable('group_members', {
  groupId: uuid('group_id').notNull().references(() => supportGroups.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.groupId, t.userId] }),
}));

export const assessments = pgTable('assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  score: smallint('score').notNull(),
  severity: text('severity'),
  answers: jsonb('answers'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const clinicalNotes = pgTable('clinical_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  authorId: text('author_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  patientId: text('patient_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isPrivate: boolean('is_private').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: text('sender_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  receiverId: text('receiver_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const referrals = pgTable('referrals', {
  id: uuid('id').primaryKey().defaultRandom(),
  fromId: text('from_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  toId: text('to_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  patientId: text('patient_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  reason: text('reason'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  moodCheckins: many(moodCheckins),
  appointmentsAsPatient: many(appointments, { relationName: 'patientAppointments' }),
  appointmentsAsProfessional: many(appointments, { relationName: 'professionalAppointments' }),
  supportedGroups: many(supportGroups),
  groupMemberships: many(groupMembers),
  assessments: many(assessments),
  clinicalNotesAuthored: many(clinicalNotes, { relationName: 'authoredNotes' }),
  clinicalNotesForPatient: many(clinicalNotes, { relationName: 'patientNotes' }),
  messagesSent: many(messages, { relationName: 'sentMessages' }),
  messagesReceived: many(messages, { relationName: 'receivedMessages' }),
  referralsMade: many(referrals, { relationName: 'referralsFrom' }),
  referralsReceived: many(referrals, { relationName: 'referralsTo' }),
  referralsFor: many(referrals, { relationName: 'referralsPatient' }),
}));

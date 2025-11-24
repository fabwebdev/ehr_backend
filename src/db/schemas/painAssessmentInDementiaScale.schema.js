import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const pain_assessment_in_dementia_scale = pgTable('pain_assessment_in_dementia_scale', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  breathing: varchar('breathing', { length: 255 }),
  vocalization: varchar('vocalization', { length: 255 }),
  facial_expression: varchar('facial_expression', { length: 255 }),
  body_language: varchar('body_language', { length: 255 }),
  consolability: varchar('consolability', { length: 255 }),
  total_score: varchar('total_score', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
import { pgTable, bigint, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

export const pain_assessments = pgTable('pain_assessments', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  pain_level_now: integer('pain_level_now'),
  acceptable_level_of_pain: integer('acceptable_level_of_pain'),
  worst_pain_level: integer('worst_pain_level'),
  primary_pain_site: varchar('primary_pain_site', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
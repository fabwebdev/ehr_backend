import { pgTable, bigint, text, timestamp } from 'drizzle-orm/pg-core';

export const pain_observations = pgTable('pain_observations', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  pain_observations_id: text('pain_observations_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
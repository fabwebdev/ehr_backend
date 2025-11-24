import { pgTable, bigint, text, timestamp } from 'drizzle-orm/pg-core';

export const pain_duration = pgTable('pain_duration', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  pain_duration_id: text('pain_duration_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
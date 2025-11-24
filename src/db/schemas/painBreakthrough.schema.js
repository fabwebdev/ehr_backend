import { pgTable, bigint, text, timestamp } from 'drizzle-orm/pg-core';

export const pain_breakthrough = pgTable('pain_breakthrough', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  pain_breakthrough_id: text('pain_breakthrough_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
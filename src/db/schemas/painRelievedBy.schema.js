import { pgTable, bigint, text, timestamp } from 'drizzle-orm/pg-core';

export const pain_relieved_by = pgTable('pain_relieved_by', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  pain_relieved_by_id: text('pain_relieved_by_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
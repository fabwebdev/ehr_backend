import { pgTable, bigint, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const pain_active_problem = pgTable('pain_active_problem', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  pain_active_problem_patient: varchar('pain_active_problem_patient', { length: 255 }),
  comments: text('comments'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
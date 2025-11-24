import { pgTable, bigint, text, timestamp } from 'drizzle-orm/pg-core';

export const pain_effects_on_function = pgTable('pain_effects_on_function', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  pain_effects_on_function_id: text('pain_effects_on_function_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
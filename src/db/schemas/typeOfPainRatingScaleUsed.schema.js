import { pgTable, bigint, text, timestamp } from 'drizzle-orm/pg-core';

export const type_of_pain_rating_scale_used = pgTable('type_of_pain_rating_scale_used', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  type_of_pain_rating_scale_used_id: text('type_of_pain_rating_scale_used_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
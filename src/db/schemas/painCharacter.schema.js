import { pgTable, bigint, text, timestamp } from 'drizzle-orm/pg-core';

export const pain_character = pgTable('pain_character', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  pain_character_id: text('pain_character_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
import { pgTable, bigint, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { patients } from './patient.schema.js';

export const spiritual_preference = pgTable('spiritual_preference', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull().references(() => patients.id),
  patient_spiritual: varchar('patient_spiritual', { length: 255 }),
  not_religious: boolean('not_religious'),
  comments: varchar('comments', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
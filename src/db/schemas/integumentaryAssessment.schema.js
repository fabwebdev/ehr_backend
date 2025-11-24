import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';
import { patients } from './patient.schema.js';

export const integumentary_assessment = pgTable('integumentary_assessment', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull().references(() => patients.id),
  integumentary_ids: varchar('integumentary_ids', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
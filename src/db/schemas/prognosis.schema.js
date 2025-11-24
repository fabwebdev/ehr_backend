import { pgTable, bigint, boolean, varchar, timestamp } from 'drizzle-orm/pg-core';
import { patients } from './patient.schema.js';

export const prognosis = pgTable('prognosis', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull().references(() => patients.id),
  prognosis_patient_is_imminent: boolean('prognosis_patient_is_imminent'),
  prognosis_patient_id: varchar('prognosis_patient_id', { length: 255 }),
  prognosis_caregiver_id: varchar('prognosis_caregiver_id', { length: 255 }),
  prognosis_imminence_id: varchar('prognosis_imminence_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
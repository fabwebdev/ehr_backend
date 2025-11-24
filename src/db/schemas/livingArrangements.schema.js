import { pgTable, bigint, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { patients } from './patient.schema.js';

export const living_arrangements = pgTable('living_arrangements', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull().references(() => patients.id),
  primary_caregiver: varchar('primary_caregiver', { length: 255 }),
  primary_location_of_patient: varchar('primary_location_of_patient', { length: 255 }),
  caregiver_availability: varchar('caregiver_availability', { length: 255 }),
  patient_able: boolean('patient_able'),
  need_hospice_service: varchar('need_hospice_service', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
import { pgTable, bigint, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const nursing_clinical_notes = pgTable('nursing_clinical_notes', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  benefit_period_id: bigint('benefit_period_id', { mode: 'number' }),
  note_date: varchar('note_date', { length: 255 }),
  time_in: varchar('time_in', { length: 255 }),
  time_out: varchar('time_out', { length: 255 }),
  patient_name: varchar('patient_name', { length: 255 }),
  patient_number: varchar('patient_number', { length: 255 }),
  location_name: varchar('location_name', { length: 255 }),
  benefit_period: text('benefit_period'),
  dob: varchar('dob', { length: 255 }),
  location_number: varchar('location_number', { length: 255 }),
  prn_visit: boolean('prn_visit').default(false),
  patient_identifiers: text('patient_identifiers'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
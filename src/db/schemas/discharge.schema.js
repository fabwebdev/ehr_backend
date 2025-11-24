import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';
import { patients } from './patient.schema.js';

export const discharge = pgTable('discharge', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).references(() => patients.id),
  type_of_record: varchar('type_of_record', { length: 255 }),
  national_provider_identifier: varchar('national_provider_identifier', { length: 255 }),
  certification_number: varchar('certification_number', { length: 255 }),
  admission_date: varchar('admission_date', { length: 255 }),
  reason_for_record: varchar('reason_for_record', { length: 255 }),
  discharge_date: varchar('discharge_date', { length: 255 }),
  social_security_number: varchar('social_security_number', { length: 255 }),
  medicare_number: varchar('medicare_number', { length: 255 }),
  medicaid_recipient: varchar('medicaid_recipient', { length: 255 }),
  reason_for_discharge: varchar('reason_for_discharge', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
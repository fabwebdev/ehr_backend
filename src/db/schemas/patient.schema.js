import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const patients = pgTable('patients', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  first_name: varchar('first_name', { length: 255 }),
  last_name: varchar('last_name', { length: 255 }),
  middle_name: varchar('middle_name', { length: 255 }),
  mi: varchar('mi', { length: 255 }), // Middle Initial
  preferred_name: varchar('preferred_name', { length: 255 }),
  suffix: varchar('suffix', { length: 255 }), // Name suffix (Jr., Sr., III, etc.)
  date_of_birth: varchar('date_of_birth', { length: 255 }),
  gender: varchar('gender', { length: 255 }),
  ssn: varchar('ssn', { length: 255 }),
  oxygen_dependent: bigint('oxygen_dependent', { mode: 'number' }), // Boolean as number (0/1) - Patient requires oxygen therapy
  patient_consents: bigint('patient_consents', { mode: 'number' }), // Boolean as number (0/1) - Patient has given consent
  hipaa_received: bigint('hipaa_received', { mode: 'number' }), // Boolean as number (0/1) - HIPAA documents received
  patient_pharmacy_id: bigint('patient_pharmacy_id', { mode: 'number' }),
  primary_diagnosis_id: bigint('primary_diagnosis_id', { mode: 'number' }),
  race_ethnicity_id: bigint('race_ethnicity_id', { mode: 'number' }),
  dme_provider_id: bigint('dme_provider_id', { mode: 'number' }),
  liaison_primary_id: bigint('liaison_primary_id', { mode: 'number' }),
  liaison_secondary_id: bigint('liaison_secondary_id', { mode: 'number' }),
  dnr_id: bigint('dnr_id', { mode: 'number' }),
  emergency_preparedness_level_id: bigint('emergency_preparedness_level_id', { mode: 'number' }),
  patient_identifier_id: bigint('patient_identifier_id', { mode: 'number' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
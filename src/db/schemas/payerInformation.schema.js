import { pgTable, bigint, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

export const payer_information = pgTable('payer_information', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  social_security: varchar('social_security', { length: 255 }),
  medicare_beneficiary: varchar('medicare_beneficiary', { length: 255 }),
  medicaid_number: varchar('medicaid_number', { length: 255 }),
  payer_info: varchar('payer_info', { length: 255 }),
  medicaid_recipient: boolean('medicaid_recipient'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
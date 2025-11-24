import { pgTable, bigint, timestamp, customType } from 'drizzle-orm/pg-core';
import { patients } from './patient.schema.js';

export const signature = pgTable('signature', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull().references(() => patients.id),
  signature_name: customType({ dataType: () => 'bytea' })('signature_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
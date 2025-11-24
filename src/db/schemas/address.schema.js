import { pgTable, bigint, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const address = pgTable('address', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  patient_id: bigint('patient_id', { mode: 'number' }).notNull(),
  address_line_1: varchar('address_line_1', { length: 255 }),
  address_line_2: varchar('address_line_2', { length: 255 }),
  state: varchar('state', { length: 255 }),
  city: varchar('city', { length: 255 }),
  zip_code: varchar('zip_code', { length: 255 }),
  phone_number: integer('phone_number'),
  alternate_phone: integer('alternate_phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
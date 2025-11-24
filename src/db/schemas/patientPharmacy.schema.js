import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const patient_pharmacies = pgTable('patient_pharmacies', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 255 }),
  address: varchar('address', { length: 255 }),
  city: varchar('city', { length: 255 }),
  state: varchar('state', { length: 255 }),
  zip_code: varchar('zip_code', { length: 255 }),
  phone: varchar('phone', { length: 255 }),
  fax: varchar('fax', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
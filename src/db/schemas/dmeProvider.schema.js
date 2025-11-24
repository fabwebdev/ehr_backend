import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const dme_providers = pgTable('dme_providers', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  provider_name: varchar('provider_name', { length: 255 }),
  contact_person: varchar('contact_person', { length: 255 }),
  phone: varchar('phone', { length: 255 }),
  email: varchar('email', { length: 255 }),
  address: varchar('address', { length: 255 }),
  city: varchar('city', { length: 255 }),
  state: varchar('state', { length: 255 }),
  zip_code: varchar('zip_code', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const prognosis_imminence_of_death = pgTable('prognosis_imminence_of_death', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
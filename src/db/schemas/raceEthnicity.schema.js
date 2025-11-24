import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const race_ethnicity = pgTable('race_ethnicity', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  race: varchar('race', { length: 255 }),
  ethnicity: varchar('ethnicity', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
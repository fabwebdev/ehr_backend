import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const nutrition_problems_type = pgTable('nutrition_problems_type', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
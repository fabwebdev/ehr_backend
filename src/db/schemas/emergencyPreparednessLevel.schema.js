import { pgTable, bigint, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const emergency_preparedness_level = pgTable('emergency_preparedness_level', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
  level: varchar('level', { length: 255 }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
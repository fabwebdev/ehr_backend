import {
  pgTable,
  text,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: varchar("name", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  image: varchar("image", { length: 255 }),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  // email_verified_at: timestamp('email_verified_at'),
  password: varchar("password", { length: 255 }),
  remember_token: varchar("remember_token", { length: 255 }),
  role: varchar("role", { length: 255 }).default("patient"),
  contact: varchar("contact", { length: 255 }),
  // Removed department and location columns as they don't exist in the actual database
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});
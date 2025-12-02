import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schemas/*',
  out: './database/migrations/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  tablesFilter: ["!_prisma_migrations"],
});
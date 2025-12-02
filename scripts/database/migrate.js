import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../../src/config/db.drizzle.js";

export default async function runMigrations() {
  console.log("📦 Running database migrations (drizzle)...");
  try {
    await migrate(db, { migrationsFolder: "./database/migrations/drizzle" });
    console.log("✅ Database migrations completed!");
  } catch (error) {
    console.error("❌ Error running database migrations:", error);
    throw error;
  }
}


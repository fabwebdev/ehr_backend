#!/usr/bin/env node

// This script runs Drizzle migrations automatically
// It should be executed during Render deployment

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./src/config/db.drizzle.js";
import dotenv from "dotenv";
import fixUserHasRolesTable from "./fix_user_has_roles.js";

dotenv.config();

async function runMigrations() {
  try {
    console.log("🚀 Starting database migrations...");

    // First, fix the user_has_roles table if needed
    await fixUserHasRolesTable();

    // Then run Drizzle migrations (ignore errors for existing tables)
    try {
      await migrate(db, { migrationsFolder: "./drizzle" });
      console.log("✅ Database migrations completed successfully!");
      return true;
    } catch (migrationError) {
      // Check if it's a "relation already exists" error
      if (migrationError?.cause?.code === "42P07" || migrationError?.code === "42P07") {
        console.log("⚠️  Some tables already exist, continuing...");
        console.log(
          "✅ Database migration process completed (existing tables detected)"
        );
        return true;
      } else {
        // Log error but don't throw - let the caller decide
        console.error("⚠️  Migration error:", migrationError.message);
        console.error("Migration error details:", {
          code: migrationError?.code,
          cause: migrationError?.cause,
          message: migrationError?.message
        });
        // Re-throw if it's a different error
        throw migrationError;
      }
    }
  } catch (error) {
    console.error("❌ Error running migrations:", error);
    throw error; // Re-throw instead of exiting
  }
}

// Only run migrations if this script is called directly
if (import.meta.url === `file://${process.argv[1]}` || import.meta.url === `file://${process.argv[1]}.js`) {
  runMigrations()
    .then(() => {
      console.log("✅ Migrations finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Migration failed:", error);
      process.exit(1);
    });
}

export default runMigrations;

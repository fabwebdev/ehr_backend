import dotenv from "dotenv";
import { db } from "./src/config/db.drizzle.js";
import { sql } from "drizzle-orm";

dotenv.config();

/**
 * Migration script to add firstName and lastName columns to users table
 * Run this script once to add the columns to your database
 */

async function addUserNameFields() {
  try {
    console.log("🔄 Adding firstName and lastName columns to users table...\n");

    // Check if columns already exist
    const checkColumns = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('first_name', 'last_name')
    `);

    const existingColumns = checkColumns.rows.map((row) => row.column_name);
    const needsFirstName = !existingColumns.includes("first_name");
    const needsLastName = !existingColumns.includes("last_name");

    if (!needsFirstName && !needsLastName) {
      console.log("✅ Columns first_name and last_name already exist!");
      return;
    }

    // Add first_name column if it doesn't exist
    if (needsFirstName) {
      console.log("📝 Adding first_name column...");
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS first_name VARCHAR(255)
      `);
      console.log("✅ first_name column added successfully!");
    } else {
      console.log("✅ first_name column already exists");
    }

    // Add last_name column if it doesn't exist
    if (needsLastName) {
      console.log("📝 Adding last_name column...");
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS last_name VARCHAR(255)
      `);
      console.log("✅ last_name column added successfully!");
    } else {
      console.log("✅ last_name column already exists");
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ Migration completed successfully!");
    console.log("=".repeat(50));
    console.log("\n💡 The users table now supports firstName and lastName fields.");
    console.log("   You can now use these fields in sign-up and user management.\n");
  } catch (error) {
    console.error("❌ Error running migration:", error);
    console.error("Stack:", error.stack);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

addUserNameFields();


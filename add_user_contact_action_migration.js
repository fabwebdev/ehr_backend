import dotenv from "dotenv";
import { db } from "./src/config/db.drizzle.js";
import { sql } from "drizzle-orm";

dotenv.config();

/**
 * Migration script to add contact and action columns to users table
 * Run this script once to add the columns to your database
 */

async function addUserContactActionFields() {
  try {
    console.log("🔄 Adding contact and action columns to users table...\n");

    // Check if columns already exist
    const checkColumns = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('contact', 'action')
    `);

    const existingColumns = checkColumns.rows.map((row) => row.column_name);
    const needsContact = !existingColumns.includes("contact");
    const needsAction = !existingColumns.includes("action");

    if (!needsContact && !needsAction) {
      console.log("✅ Columns contact and action already exist!");
      return;
    }

    // Add contact column if it doesn't exist
    if (needsContact) {
      console.log("📝 Adding contact column...");
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS contact VARCHAR(255)
      `);
      console.log("✅ contact column added successfully!");
    } else {
      console.log("✅ contact column already exists");
    }

    // Add action column if it doesn't exist
    if (needsAction) {
      console.log("📝 Adding action column...");
      await db.execute(sql`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS action VARCHAR(255)
      `);
      console.log("✅ action column added successfully!");
    } else {
      console.log("✅ action column already exists");
    }

    console.log("\n" + "=".repeat(50));
    console.log("✅ Migration completed successfully!");
    console.log("=".repeat(50));
    console.log("\n💡 The users table now supports contact and action fields.");
    console.log("   You can now use these fields in user management.\n");
  } catch (error) {
    console.error("❌ Error running migration:", error);
    console.error("Stack:", error.stack);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

addUserContactActionFields();


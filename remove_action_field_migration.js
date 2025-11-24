import dotenv from "dotenv";
import { db } from "./src/config/db.drizzle.js";
import { sql } from "drizzle-orm";

dotenv.config();

/**
 * Migration script to remove action column from users table
 * Run this script once to remove the action column
 */

async function removeActionField() {
  try {
    console.log("🔄 Removing action column from users table...\n");

    // Check if column exists
    const checkColumn = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'action'
    `);

    if (checkColumn.rows.length === 0) {
      console.log("✅ action column does not exist (already removed)!");
      return;
    }

    // Remove action column
    console.log("📝 Removing action column...");
    await db.execute(sql`
      ALTER TABLE users 
      DROP COLUMN IF EXISTS action
    `);
    console.log("✅ action column removed successfully!");

    console.log("\n" + "=".repeat(50));
    console.log("✅ Migration completed successfully!");
    console.log("=".repeat(50));
    console.log("\n💡 The action field has been removed from users table.");
    console.log("   Only contact field remains.\n");
  } catch (error) {
    console.error("❌ Error running migration:", error);
    console.error("Stack:", error.stack);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

removeActionField();


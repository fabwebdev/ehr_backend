import dotenv from "dotenv";
import { pool } from "../src/config/db.drizzle.js";

dotenv.config();

/**
 * Ensures the user_has_roles.user_id column is stored as TEXT.
 * Better Auth uses nanoid strings for user IDs, so this column
 * must be text instead of integer to avoid cast errors.
 */
async function fixUserHasRolesTable() {
  if (!process.env.DATABASE_URL) {
    console.warn(
      "⚠️  DATABASE_URL is not defined. Skipping user_has_roles fix."
    );
    return false;
  }

  console.log(
    "🔍 Checking user_has_roles table for user_id column type..."
  );

  const client = await pool.connect();
  try {
    const columnInfo = await client.query(
      `
        SELECT data_type
        FROM information_schema.columns
        WHERE table_name = 'user_has_roles'
          AND column_name = 'user_id'
      `
    );

    if (columnInfo.rowCount === 0) {
      console.warn(
        "⚠️  user_has_roles.user_id column not found. Skipping fix."
      );
      return false;
    }

    const currentType = columnInfo.rows[0].data_type;
    console.log(`📊 Current user_id column type: ${currentType}`);

    if (currentType === "text") {
      console.log("✅ user_id column is already Text, no fix needed");
      return false;
    }

    console.log("🔧 Updating user_id column to TEXT...");
    await client.query(
      `
        ALTER TABLE user_has_roles
        ALTER COLUMN user_id TYPE TEXT
        USING user_id::text
      `
    );
    console.log("✅ user_id column converted to TEXT successfully");
    return true;
  } catch (error) {
    console.error("❌ Error fixing user_has_roles table:", error);
    return false;
  } finally {
    client.release();
  }
}

export default fixUserHasRolesTable;


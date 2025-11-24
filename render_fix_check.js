// Script to check and fix user_has_roles table on Render
// This script can be run on the Render environment to diagnose and fix the issue

import { db } from "./src/config/db.drizzle.js";
import { sql } from "drizzle-orm";
import { roles, user_has_roles } from "./src/db/schemas/index.js";

async function checkAndFixUserHasRoles() {
  try {
    console.log("=== Checking and fixing user_has_roles table ===\n");

    // Check current column types
    const columnInfo = await db.execute(
      sql`SELECT 
        column_name, 
        data_type, 
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'user_has_roles' 
      ORDER BY ordinal_position;`
    );

    console.log("Current column information:");
    columnInfo.rows.forEach((row) => {
      console.log(
        `  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`
      );
    });

    // Check if user_id is bigint (the problematic state)
    const userIdColumn = columnInfo.rows.find(
      (row) => row.column_name === "user_id"
    );
    if (userIdColumn && userIdColumn.data_type === "bigint") {
      console.log(
        "\n❌ ISSUE DETECTED: user_id column is bigint, should be text"
      );
      console.log(
        "This is likely the cause of the error you are seeing on Render."
      );
      console.log(
        "\nTo fix this issue, you need to run the following SQL migration on your Render database:"
      );
      console.log(`
DO $$ 
DECLARE 
    constraint_name text;
BEGIN
    -- Drop the primary key constraint
    ALTER TABLE user_has_roles DROP CONSTRAINT IF EXISTS user_has_roles_pkey;
    
    -- Add new text column for user_id
    ALTER TABLE user_has_roles ADD COLUMN IF NOT EXISTS new_user_id TEXT;
    
    -- Populate new_user_id with string versions of existing user_ids
    UPDATE user_has_roles SET new_user_id = CAST(user_id AS TEXT) WHERE new_user_id IS NULL;
    
    -- Drop old user_id column
    ALTER TABLE user_has_roles DROP COLUMN IF EXISTS user_id;
    
    -- Rename new_user_id to user_id
    ALTER TABLE user_has_roles RENAME COLUMN new_user_id TO user_id;
    
    -- Add primary key constraint back
    ALTER TABLE user_has_roles ADD PRIMARY KEY (user_id, role_id);
    
    RAISE NOTICE 'Successfully converted user_id column from bigint to text';
END $$;
      `);
    } else if (userIdColumn && userIdColumn.data_type === "text") {
      console.log("\n✅ user_id column is correctly set to text");
      console.log("The database schema appears to be correct.");

      // Test insert with a sample user ID
      try {
        const testUserId = "test_fix_check_" + Date.now();
        const roleResult = await db.select().from(roles).limit(1);

        if (roleResult.length > 0) {
          console.log(`\nTesting insert with user_id: ${testUserId}`);
          await db.insert(user_has_roles).values({
            user_id: testUserId,
            role_id: roleResult[0].id,
          });
          console.log("✅ Test insert successful - no type mismatch issues");

          // Clean up
          await db.delete(user_has_roles).where(sql`user_id = ${testUserId}`);
        }
      } catch (testError) {
        console.log("\n❌ Test insert failed:", testError.message);
        console.log(
          "There might still be an issue with the database schema or Drizzle configuration."
        );
      }
    } else {
      console.log("\n⚠️  Unexpected column configuration");
    }
  } catch (error) {
    console.error("Error checking user_has_roles table:", error);
  }
}

checkAndFixUserHasRoles();

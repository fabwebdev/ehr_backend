#!/usr/bin/env node

// This script specifically fixes the user_has_roles table user_id column type issue on Render
// It checks if the user_id column is still BigInt and converts it to Text if needed

import { db } from "./src/config/db.drizzle.js";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

async function fixUserHasRolesTable() {
  try {
    console.log("🔍 Checking user_has_roles table for user_id column type...");

    // Check current column type for user_id in user_has_roles table
    const columnInfo = await db.execute(
      sql`SELECT 
        column_name, 
        data_type, 
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'user_has_roles' 
      AND column_name = 'user_id';`
    );

    if (columnInfo.rows.length === 0) {
      console.log("❌ user_has_roles table or user_id column not found");
      return false; // Return false instead of exiting
    }

    const userIdColumn = columnInfo.rows[0];
    console.log(`📊 Current user_id column type: ${userIdColumn.data_type}`);

    // If user_id is still BigInt, we need to fix it
    if (userIdColumn.data_type === "bigint") {
      console.log("🔧 user_id column is BigInt, converting to Text...");

      try {
        // Execute the conversion SQL
        await db.execute(sql`
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

        console.log(
          "✅ Successfully converted user_id column from BigInt to Text"
        );
        return true; // Return true to indicate a fix was applied
      } catch (fixError) {
        console.error("❌ Error fixing user_id column type:", fixError);
        return false; // Return false instead of exiting
      }
    } else if (userIdColumn.data_type === "text") {
      console.log("✅ user_id column is already Text, no fix needed");
      return false; // No fix needed
    } else {
      console.log(
        `⚠️  Unexpected user_id column type: ${userIdColumn.data_type}`
      );
      return false; // No fix needed
    }
  } catch (error) {
    console.error("❌ Error checking/fixing user_has_roles table:", error);
    return false; // Return false instead of exiting
  }
}

// Only run if this script is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixUserHasRolesTable()
    .then(() => {
      console.log("✅ user_has_roles table fix completed");
      // Don't exit, let the next command in the chain run
    })
    .catch((error) => {
      console.error("❌ Error in fixUserHasRolesTable:", error);
      // Don't exit, let the next command in the chain run
    });
}

export default fixUserHasRolesTable;

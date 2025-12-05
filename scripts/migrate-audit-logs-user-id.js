import dotenv from "dotenv";
import { pool } from "../src/config/db.drizzle.js";
import connectDB from "../src/database/connection.js";
import { closeDB } from "../src/database/connection.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runMigration = async () => {
  let client;
  try {
    console.log("🔌 Connecting to database...");
    await connectDB();
    console.log("✅ Database connected successfully.\n");

    // Read the SQL file
    const sqlPath = join(__dirname, "migrate-audit-logs-user-id.sql");
    const sql = readFileSync(sqlPath, "utf-8");

    // Get a client from the pool
    client = await pool.connect();

    console.log("📝 Starting migration: audit_logs.user_id (bigint → text)\n");

    // Execute migration steps directly
    console.log("⏳ Step 1: Dropping foreign key constraint...");
    try {
      await client.query(`
        ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_users_id_fk;
      `);
      console.log("✅ Foreign key constraint dropped (or didn't exist)\n");
    } catch (error) {
      if (error.code === "42704" || error.message.includes("does not exist")) {
        console.log("⚠️  Constraint doesn't exist (that's okay)\n");
      } else {
        throw error;
      }
    }

    console.log("⏳ Step 2: Cleaning up invalid user_id references...");
    try {
      // Set user_id to NULL for records where the numeric user_id doesn't exist in users table
      // Since users.id is text (nanoid), numeric user_ids won't match
      const cleanupResult = await client.query(`
        UPDATE audit_logs 
        SET user_id = NULL 
        WHERE user_id IS NOT NULL 
        AND user_id::text NOT IN (SELECT id::text FROM users);
      `);
      console.log(`✅ Cleaned up ${cleanupResult.rowCount} invalid user_id references\n`);
    } catch (error) {
      // If the column is still bigint, we need to handle it differently
      console.log("⚠️  Cleanup query failed (column might still be bigint), continuing...\n");
    }

    console.log("⏳ Step 3: Changing column type from bigint to text...");
    try {
      // First, set all numeric user_ids to NULL since they won't match text IDs
      await client.query(`
        UPDATE audit_logs SET user_id = NULL WHERE user_id IS NOT NULL;
      `);
      
      // Now change the column type
      await client.query(`
        ALTER TABLE audit_logs ALTER COLUMN user_id TYPE text USING 
        CASE 
          WHEN user_id IS NULL THEN NULL
          ELSE user_id::text
        END;
      `);
      console.log("✅ Column type changed to text\n");
    } catch (error) {
      // If column is already text, that's fine
      if (error.message.includes("already") || error.code === "42804") {
        console.log("⚠️  Column might already be text type, continuing...\n");
      } else {
        throw error;
      }
    }

    console.log("⏳ Step 4: Re-adding foreign key constraint...");
    try {
      await client.query(`
        ALTER TABLE audit_logs 
        ADD CONSTRAINT audit_logs_user_id_users_id_fk 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE;
      `);
      console.log("✅ Foreign key constraint re-added\n");
    } catch (error) {
      if (error.code === "23505" || error.message.includes("already exists")) {
        console.log("⚠️  Constraint already exists (that's okay)\n");
      } else {
        throw error;
      }
    }

    // Run the verification SELECT
    console.log("🔍 Verifying migration...");
    const verifyResult = await client.query(`
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'audit_logs' 
        AND column_name = 'user_id';
    `);

    if (verifyResult.rows.length > 0) {
      const column = verifyResult.rows[0];
      console.log("\n📊 Migration Verification:");
      console.log(`   Column: ${column.column_name}`);
      console.log(`   Data Type: ${column.data_type}`);
      console.log(`   Max Length: ${column.character_maximum_length || "N/A"}`);
      
      if (column.data_type === "text" || column.data_type === "character varying") {
        console.log("\n✅ Migration successful! user_id is now text type.");
      } else {
        console.log(`\n⚠️  Warning: user_id is still ${column.data_type}, not text.`);
      }
    } else {
      console.log("\n⚠️  Could not verify migration - column not found.");
    }

  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
    }
    if (error.detail) {
      console.error(`   Detail: ${error.detail}`);
    }
    if (error.hint) {
      console.error(`   Hint: ${error.hint}`);
    }
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await closeDB();
    console.log("\n🔌 Database connection closed.");
  }
};

// Run the migration
runMigration()
  .then(() => {
    console.log("\n✅ Migration completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  });


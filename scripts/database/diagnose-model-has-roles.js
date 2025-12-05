import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";

// Create a direct database connection for this diagnosis
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "api_user",
  password: process.env.DB_PASSWORD || "api_pass_123",
  database: process.env.DB_NAME || "travel_db",
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

const db = drizzle(pool);

async function diagnoseModelHasRoles() {
  try {
    console.log("🔍 Diagnosing model_has_roles table...");

    // Check table structure
    console.log("\n📋 Table columns:");
    const columns = await db.execute(sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'model_has_roles'
      ORDER BY ordinal_position
    `);
    columns.rows.forEach((row) => {
      console.log(
        `  - ${row.column_name} (${row.data_type}, ${row.is_nullable})`
      );
    });

    // Check primary key information
    console.log("\n🔑 Primary key information:");
    const primaryKey = await db.execute(sql`
      SELECT a.attname AS column_name
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = 'model_has_roles'::regclass AND i.indisprimary
      ORDER BY a.attnum
    `);

    if (primaryKey.rows.length > 0) {
      console.log("  Primary key columns:");
      primaryKey.rows.forEach((row) => {
        console.log(`    - ${row.column_name}`);
      });
    } else {
      console.log("  No primary key found");
    }

    // Check all constraints
    console.log("\n🔒 All constraints:");
    const constraints = await db.execute(sql`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints 
      WHERE table_name = 'model_has_roles'
      ORDER BY constraint_type, constraint_name
    `);

    if (constraints.rows.length > 0) {
      constraints.rows.forEach((row) => {
        console.log(`  - ${row.constraint_name} (${row.constraint_type})`);
      });
    } else {
      console.log("  No constraints found");
    }

    // Check specifically for the constraint we're interested in
    console.log("\n🔍 Checking for specific constraint:");
    const specificConstraint = await db.execute(sql`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'model_has_roles' 
      AND constraint_name = 'model_has_roles_role_id_model_type_model_id_pk'
    `);

    if (specificConstraint.rows.length > 0) {
      console.log("  ✅ Constraint exists");
    } else {
      console.log("  ❌ Constraint does not exist");
    }
  } catch (error) {
    console.error("❌ Error during diagnosis:", error.message);
    console.error("Error details:", error);
  } finally {
    await pool.end();
  }
}

diagnoseModelHasRoles();

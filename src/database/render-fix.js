import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";

// Create a direct database connection for Render fix
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

async function renderFix() {
  try {
    console.log("🔍 Starting Render-specific database fix...");

    // Test basic connection
    console.log("🔌 Testing database connection...");
    const connectionTest = await db.execute(sql`SELECT 1 as test`);
    console.log("✅ Database connection successful");

    // Check what primary key constraint exists
    console.log("🔍 Checking existing primary key constraint...");
    const primaryKey = await db.execute(sql`
      SELECT constraint_name
      FROM information_schema.table_constraints 
      WHERE table_name = 'model_has_roles' 
      AND constraint_type = 'PRIMARY KEY'
    `);

    if (primaryKey.rows.length > 0) {
      const existingConstraint = primaryKey.rows[0].constraint_name;
      console.log(
        `⚠️  Found existing primary key constraint: ${existingConstraint}`
      );

      // Check if it's the correct constraint
      if (
        existingConstraint === "model_has_roles_role_id_model_type_model_id_pk"
      ) {
        console.log("✅ Correct constraint already exists");
        return;
      }

      // Drop the existing constraint
      console.log(`🗑️  Dropping existing constraint: ${existingConstraint}`);
      await db.execute(
        sql`ALTER TABLE model_has_roles DROP CONSTRAINT ${sql.identifier(
          existingConstraint
        )}`
      );
      console.log("✅ Dropped existing constraint");
    } else {
      console.log("✅ No existing primary key constraint found");
    }

    // Add the correct primary key constraint
    console.log("➕ Adding correct primary key constraint...");
    await db.execute(sql`
      ALTER TABLE model_has_roles 
      ADD CONSTRAINT model_has_roles_role_id_model_type_model_id_pk 
      PRIMARY KEY (role_id, model_type, model_id)
    `);

    console.log(
      "✅ Successfully fixed model_has_roles primary key constraint!"
    );

    // Test that the table works correctly
    console.log("🧪 Testing model_has_roles table...");
    const tableTest = await db.execute(
      sql`SELECT * FROM model_has_roles LIMIT 1`
    );
    console.log("✅ model_has_roles table is accessible");

    console.log("\n🎉 Render fix applied successfully!");
  } catch (error) {
    console.error("❌ Error during Render fix:", error.message);
    console.error(
      "This is expected during initial setup when tables may not exist yet"
    );
    // Don't fail the process - let the application continue
  } finally {
    await pool.end();
  }
}

renderFix();

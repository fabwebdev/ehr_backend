import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { sql } from "drizzle-orm";

// Create a direct database connection for this fix
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

async function fixModelHasRolesConstraint() {
  try {
    console.log("🔍 Checking model_has_roles table constraints...");

    // Check if the constraint exists
    const constraintCheck = await db.execute(sql`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'model_has_roles' 
      AND constraint_name = 'model_has_roles_role_id_model_type_model_id_pk'
    `);

    if (constraintCheck.rows.length > 0) {
      console.log(
        "⚠️  Primary key constraint already exists, dropping it first..."
      );
      try {
        await db.execute(sql`
          ALTER TABLE model_has_roles 
          DROP CONSTRAINT IF EXISTS model_has_roles_role_id_model_type_model_id_pk
        `);
        console.log("✅ Successfully dropped existing constraint");
      } catch (dropError) {
        console.log(
          "ℹ️  Could not drop constraint (may not exist), continuing..."
        );
      }
    } else {
      console.log("✅ No existing primary key constraint found");
    }

    // Add the primary key constraint
    console.log("🔧 Adding primary key constraint to model_has_roles table...");
    await db.execute(sql`
      ALTER TABLE model_has_roles 
      ADD CONSTRAINT model_has_roles_role_id_model_type_model_id_pk 
      PRIMARY KEY (role_id, model_type, model_id)
    `);

    console.log(
      "✅ Successfully fixed model_has_roles primary key constraint!"
    );
  } catch (error) {
    console.error("❌ Error fixing model_has_roles constraint:", error.message);
    console.error("Error details:", error);
  } finally {
    await pool.end();
  }
}

fixModelHasRolesConstraint();

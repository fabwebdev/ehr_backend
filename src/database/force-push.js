import { sql } from "drizzle-orm";
import { db, pool } from "../config/db.drizzle.js";

async function forcePush() {
  try {
    console.log("🔄 Handling model_has_roles constraint issues...");

    // Instead of dropping the table, just fix the constraint
    try {
      // Try to drop the constraint if it exists
      await db.execute(
        sql`ALTER TABLE model_has_roles DROP CONSTRAINT IF EXISTS model_has_roles_role_id_model_type_model_id_pk`
      );
      console.log("✅ Dropped existing constraint if it existed");

      // Recreate the constraint
      await db.execute(
        sql`ALTER TABLE model_has_roles ADD CONSTRAINT model_has_roles_role_id_model_type_model_id_pk PRIMARY KEY (role_id, model_type, model_id)`
      );
      console.log("✅ Recreated primary key constraint");
    } catch (constraintError) {
      console.log(
        "ℹ️  Constraint fix not needed or failed (continuing):",
        constraintError.message
      );
    }

    console.log("✅ Model_has_roles constraint handling completed");
  } catch (error) {
    console.error(
      "❌ Error handling model_has_roles constraints:",
      error.message
    );
  } finally {
    await pool.end();
    process.exit(0);
  }
}

forcePush();

import dotenv from "dotenv";
import { pool } from "../src/config/db.drizzle.js";

dotenv.config();

const columnDefinitions = [
  { name: "middle_name", definition: "VARCHAR(255)" },
  { name: "mi", definition: "VARCHAR(255)" },
  { name: "preferred_name", definition: "VARCHAR(255)" },
  { name: "suffix", definition: "VARCHAR(255)" },
  { name: "date_of_birth", definition: "VARCHAR(255)" },
  { name: "gender", definition: "VARCHAR(255)" },
  { name: "ssn", definition: "VARCHAR(255)" },
  { name: "oxygen_dependent", definition: "BIGINT" },
  { name: "patient_consents", definition: "BIGINT" },
  { name: "hipaa_received", definition: "BIGINT" },
  { name: "patient_pharmacy_id", definition: "BIGINT" },
  { name: "primary_diagnosis_id", definition: "BIGINT" },
  { name: "race_ethnicity_id", definition: "BIGINT" },
  { name: "dme_provider_id", definition: "BIGINT" },
  { name: "liaison_primary_id", definition: "BIGINT" },
  { name: "liaison_secondary_id", definition: "BIGINT" },
  { name: "dnr_id", definition: "BIGINT" },
  {
    name: "emergency_preparedness_level_id",
    definition: "BIGINT",
  },
  { name: "patient_identifier_id", definition: "BIGINT" },
  { name: "created_at", definition: "TIMESTAMP DEFAULT NOW()" },
  { name: "updated_at", definition: "TIMESTAMP DEFAULT NOW()" },
];

async function columnExists(client, columnName) {
  const result = await client.query(
    `
      SELECT 1
      FROM information_schema.columns
      WHERE table_name = 'patients'
        AND column_name = $1
    `,
    [columnName]
  );
  return result.rowCount > 0;
}

async function fixPatientsColumns() {
  if (!process.env.DATABASE_URL) {
    console.warn(
      "⚠️  DATABASE_URL is not defined. Skipping patients column fix."
    );
    return false;
  }

  console.log("🔍 Checking patients table for required columns...");

  const client = await pool.connect();
  let updated = false;

  try {
    for (const column of columnDefinitions) {
      const exists = await columnExists(client, column.name);
      if (!exists) {
        console.log(`🔧 Adding patients.${column.name} column...`);
        await client.query(
          `ALTER TABLE patients ADD COLUMN "${column.name}" ${column.definition}`
        );
        updated = true;
        console.log(`✅ patients.${column.name} column added successfully`);
      }
    }

    if (!updated) {
      console.log("✅ All required patients columns already exist");
    }

    return updated;
  } catch (error) {
    console.error("❌ Error fixing patients columns:", error);
    return false;
  } finally {
    client.release();
  }
}

export default fixPatientsColumns;

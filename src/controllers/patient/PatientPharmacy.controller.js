// Note: express-validator replaced with Fastify schema validation
import { db } from "../../config/db.drizzle.js";
import { patient_pharmacies } from "../../db/schemas/patientPharmacy.schema.js";
import { eq } from "drizzle-orm";

// Get all patient pharmacies
export const index = async (request, reply) => {
  try {
    console.log("🔍 PatientPharmacy index called - User:", request.user?.id);
    console.log("🔍 PatientPharmacy index - Request path:", request.path);

    const pharmacies = await db.select().from(patient_pharmacies);
    console.log(
      "✅ PatientPharmacy index - Found",
      pharmacies.length,
      "pharmacies"
    );

    reply.code(200);
    return pharmacies;
  } catch (error) {
    console.error("❌ Error in PatientPharmacy index:", error);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
    });

    reply.code(500);
    return {
      message: "Server error",
      error: error.message,
      code: error.code,
      detail: error.detail,
    };
  }
};

// Create a new patient pharmacy
export const store = async (request, reply) => {
  try {
    console.log("🔍 PatientPharmacy store called - User:", request.user?.id);
    console.log(
      "🔍 PatientPharmacy store - Request body:",
      JSON.stringify(request.body, null, 2)
    );

    // Try to get validation errors (if validation middleware was used)
    try {
      // Note: Validation should be done in route schema
      // Validation handled in route schema
    } catch (validationError) {
      // Validation middleware might not be set up, that's okay
      console.log(
        "⚠️  Validation middleware not detected, skipping validation"
      );
    }

    // Check if request body is empty
    if (!request.body || Object.keys(request.body).length === 0) {
      reply.code(400);
      return {
        message: "Request body is empty",
        error: "No data provided to create patient pharmacy",
      };
    }

    // Prepare data for insertion - exclude id (auto-generated) and only include valid fields
    const pharmacyData = {
      name: request.body.name || null,
      address: request.body.address || null,
      city: request.body.city || null,
      state: request.body.state || null,
      zip_code: request.body.zip_code || request.body.zipCode || null,
      phone: request.body.phone || null,
      fax: request.body.fax || null,
    };

    // Remove undefined and null values to avoid default insertion
    Object.keys(pharmacyData).forEach((key) => {
      if (pharmacyData[key] === undefined || pharmacyData[key] === null) {
        delete pharmacyData[key];
      }
    });

    // If no data fields remain, return error
    if (Object.keys(pharmacyData).length === 0) {
      reply.code(400);
      return {
        message: "No valid data provided",
        error: "At least one field must be provided to create a pharmacy",
      };
    }

    // Explicitly set timestamps - Drizzle might not apply defaults correctly
    const now = new Date();
    pharmacyData.createdAt = now;
    pharmacyData.updatedAt = now;

    console.log(
      "🔍 PatientPharmacy store - Prepared data for insert:",
      JSON.stringify(pharmacyData, null, 2)
    );

    const pharmacy = await db
      .insert(patient_pharmacies)
      .values(pharmacyData)
      .returning();
    const result = pharmacy[0];

    console.log("✅ PatientPharmacy store - Created pharmacy:", result?.id);

    reply.code(201);
    return {
      message: "Patient pharmacy created successfully.",
      data: result,
    };
  } catch (error) {
    console.error("❌ Error in PatientPharmacy store:", error);
    console.error("❌ Error stack:", error.stack);

    // Extract database error details from error.cause if available
    const dbError = error.cause || error;
    console.error("❌ Error details:", {
      message: error.message,
      code: dbError.code,
      detail: dbError.detail,
      hint: dbError.hint,
      severity: dbError.severity,
      table: dbError.table,
      column: dbError.column,
    });

    reply.code(500);
    return {
      message: "Server error",
      error: error.message,
      code: dbError.code,
      detail: dbError.detail,
      hint: dbError.hint,
    };
  }
};

// Get patient pharmacy by ID
export const show = async (request, reply) => {
  try {
    const { id } = request.params;
    const pharmacies = await db
      .select()
      .from(patient_pharmacies)
      .where(eq(patient_pharmacies.id, id))
      .limit(1);
    const pharmacy = pharmacies[0];

    if (!pharmacy) {
      reply.code(404);
      return { error: "Patient pharmacy not found" };
    }

    reply.code(200);
    return pharmacy;
  } catch (error) {
    console.error("Error in show:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Update patient pharmacy by ID
export const update = async (request, reply) => {
  try {
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { id } = request.params;
    const pharmacyData = request.body;

    const pharmacies = await db
      .select()
      .from(patient_pharmacies)
      .where(eq(patient_pharmacies.id, id))
      .limit(1);
    const pharmacy = pharmacies[0];

    if (!pharmacy) {
      reply.code(404);
      return { error: "Patient pharmacy not found" };
    }

    const updatedPharmacy = await db
      .update(patient_pharmacies)
      .set(pharmacyData)
      .where(eq(patient_pharmacies.id, id))
      .returning();
    const result = updatedPharmacy[0];

    reply.code(200);
    return {
      message: "Patient pharmacy updated successfully.",
      data: result,
    };
  } catch (error) {
    console.error("Error in update:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Delete patient pharmacy by ID
export const destroy = async (request, reply) => {
  try {
    const { id } = request.params;

    const pharmacies = await db
      .select()
      .from(patient_pharmacies)
      .where(eq(patient_pharmacies.id, id))
      .limit(1);
    const pharmacy = pharmacies[0];

    if (!pharmacy) {
      reply.code(404);
      return { error: "Patient pharmacy not found" };
    }

    await db.delete(patient_pharmacies).where(eq(patient_pharmacies.id, id));

    reply.code(200);
    return {
      message: "Patient pharmacy deleted successfully.",
    };
  } catch (error) {
    console.error("Error in destroy:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Note: express-validator replaced with Fastify schema validation
import { db } from "../../config/db.drizzle.js";
import { primary_diagnosis } from "../../db/schemas/primaryDiagnosis.schema.js";
import { eq } from "drizzle-orm";

// Get all primary diagnoses
export const index = async (request, reply) => {
  try {
    console.log("🔍 PrimaryDiagnosis index called - User:", request.user?.id);
    console.log("🔍 PrimaryDiagnosis index - Request path:", request.path);

    const diagnoses = await db.select().from(primary_diagnosis);
    console.log(
      "✅ PrimaryDiagnosis index - Found",
      diagnoses.length,
      "diagnoses"
    );

    reply.code(200);
    return diagnoses;
  } catch (error) {
    console.error("❌ Error in PrimaryDiagnosis index:", error);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
    });

    // Always return error details to help debug
    reply.code(500);
    return {
      message: "Server error",
      error: error.message,
      code: error.code,
      detail: error.detail,
    };
  }
};

// Create a new primary diagnosis
export const store = async (request, reply) => {
  try {
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const diagnosisData = request.body;

    // Explicitly set timestamps - Drizzle might not apply defaults correctly
    const now = new Date();
    diagnosisData.createdAt = now;
    diagnosisData.updatedAt = now;

    const diagnosis = await db
      .insert(primary_diagnosis)
      .values(diagnosisData)
      .returning();
    const result = diagnosis[0];

    reply.code(201);
    return {
      message: "Primary diagnosis created successfully.",
      data: result,
    };
  } catch (error) {
    console.error("❌ Error in PrimaryDiagnosis store:", error);
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

// Get primary diagnosis by ID
export const show = async (request, reply) => {
  try {
    const { id } = request.params;
    const diagnoses = await db
      .select()
      .from(primary_diagnosis)
      .where(eq(primary_diagnosis.id, id))
      .limit(1);
    const diagnosis = diagnoses[0];

    if (!diagnosis) {
      reply.code(404);
      return { error: "Primary diagnosis not found" };
    }

    reply.code(200);
    return diagnosis;
  } catch (error) {
    console.error("Error in show:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Update primary diagnosis by ID
export const update = async (request, reply) => {
  try {
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { id } = request.params;
    const diagnosisData = request.body;

    const diagnoses = await db
      .select()
      .from(primary_diagnosis)
      .where(eq(primary_diagnosis.id, id))
      .limit(1);
    const diagnosis = diagnoses[0];

    if (!diagnosis) {
      reply.code(404);
      return { error: "Primary diagnosis not found" };
    }

    const updatedDiagnosis = await db
      .update(primary_diagnosis)
      .set(diagnosisData)
      .where(eq(primary_diagnosis.id, id))
      .returning();
    const result = updatedDiagnosis[0];

    reply.code(200);
    return {
      message: "Primary diagnosis updated successfully.",
      data: result,
    };
  } catch (error) {
    console.error("Error in update:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Delete primary diagnosis by ID
export const destroy = async (request, reply) => {
  try {
    const { id } = request.params;

    const diagnoses = await db
      .select()
      .from(primary_diagnosis)
      .where(eq(primary_diagnosis.id, id))
      .limit(1);
    const diagnosis = diagnoses[0];

    if (!diagnosis) {
      reply.code(404);
      return { error: "Primary diagnosis not found" };
    }

    await db.delete(primary_diagnosis).where(eq(primary_diagnosis.id, id));

    reply.code(200);
    return {
      message: "Primary diagnosis deleted successfully.",
    };
  } catch (error) {
    console.error("Error in destroy:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Note: express-validator replaced with Fastify schema validation
import { db } from "../../config/db.drizzle.js";
import { race_ethnicity } from "../../db/schemas/raceEthnicity.schema.js";
import { eq } from "drizzle-orm";

// Get all race ethnicities
export const index = async (request, reply) => {
  try {
    console.log("🔍 RaceEthnicity index called - User:", request.user?.id);
    console.log("🔍 RaceEthnicity index - Request path:", request.path);

    const raceEthnicities = await db.select().from(race_ethnicity);
    console.log(
      "✅ RaceEthnicity index - Found",
      raceEthnicities.length,
      "entries"
    );

    reply.code(200);
    return raceEthnicities;
  } catch (error) {
    console.error("❌ Error in RaceEthnicity index:", error);
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

// Create a new race ethnicity
export const store = async (request, reply) => {
  try {
    console.log("🔍 RaceEthnicity store called - User:", request.user?.id);
    console.log(
      "🔍 RaceEthnicity store - Request body:",
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
        error: "No data provided to create race ethnicity",
      };
    }

    // Prepare data for insertion - exclude id (auto-generated) and only include valid fields
    // The schema has 'race' and 'ethnicity' fields
    // Accept various field name formats from frontend
    const raceEthnicityData = {};

    // Handle race field - accept multiple possible field names
    // Check for non-empty values (not undefined, null, empty string, or whitespace-only)
    const raceValue =
      request.body.race ||
      request.body.name ||
      request.body.raceEthnicity ||
      request.body.value;
    if (
      raceValue !== undefined &&
      raceValue !== null &&
      String(raceValue).trim() !== ""
    ) {
      raceEthnicityData.race = String(raceValue).trim();
    }

    // Handle ethnicity field - check for non-empty values
    const ethnicityValue = request.body.ethnicity;
    if (
      ethnicityValue !== undefined &&
      ethnicityValue !== null &&
      String(ethnicityValue).trim() !== ""
    ) {
      raceEthnicityData.ethnicity = String(ethnicityValue).trim();
    }

    // If no data fields remain, return error with more helpful message
    if (Object.keys(raceEthnicityData).length === 0) {
      console.log(
        "❌ No valid data found in request body. Received:",
        JSON.stringify(request.body, null, 2)
      );
      reply.code(400);
      return {
        message: "No valid data provided",
        error:
          "At least one field (race or ethnicity) must be provided with a non-empty value",
        receivedData: request.body,
        expectedFields: ["race", "ethnicity"],
      };
    }

    // Explicitly set timestamps - Drizzle might not apply defaults correctly when only partial data is provided
    const now = new Date();
    raceEthnicityData.createdAt = now;
    raceEthnicityData.updatedAt = now;

    console.log(
      "🔍 RaceEthnicity store - Prepared data for insert:",
      JSON.stringify(raceEthnicityData, null, 2)
    );

    const raceEthnicity = await db
      .insert(race_ethnicity)
      .values(raceEthnicityData)
      .returning();
    const result = raceEthnicity[0];

    console.log("✅ RaceEthnicity store - Created entry:", result?.id);

    reply.code(201);
    return {
      message: "Race ethnicity created successfully.",
      data: result,
    };
  } catch (error) {
    console.error("❌ Error in RaceEthnicity store:", error);
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

// Get race ethnicity by ID
export const show = async (request, reply) => {
  try {
    const { id } = request.params;
    const raceEthnicities = await db
      .select()
      .from(race_ethnicity)
      .where(eq(race_ethnicity.id, id))
      .limit(1);
    const raceEthnicity = raceEthnicities[0];

    if (!raceEthnicity) {
      reply.code(404);
      return { error: "Race ethnicity not found" };
    }

    reply.code(200);
    return raceEthnicity;
  } catch (error) {
    console.error("Error in show:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Update race ethnicity by ID
export const update = async (request, reply) => {
  try {
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { id } = request.params;
    const raceEthnicityData = request.body;

    const raceEthnicities = await db
      .select()
      .from(race_ethnicity)
      .where(eq(race_ethnicity.id, id))
      .limit(1);
    const raceEthnicity = raceEthnicities[0];

    if (!raceEthnicity) {
      reply.code(404);
      return { error: "Race ethnicity not found" };
    }

    const updatedRaceEthnicity = await db
      .update(race_ethnicity)
      .set(raceEthnicityData)
      .where(eq(race_ethnicity.id, id))
      .returning();
    const result = updatedRaceEthnicity[0];

    reply.code(200);
    return {
      message: "Race ethnicity updated successfully.",
      data: result,
    };
  } catch (error) {
    console.error("Error in update:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Delete race ethnicity by ID
export const destroy = async (request, reply) => {
  try {
    const { id } = request.params;

    const raceEthnicities = await db
      .select()
      .from(race_ethnicity)
      .where(eq(race_ethnicity.id, id))
      .limit(1);
    const raceEthnicity = raceEthnicities[0];

    if (!raceEthnicity) {
      reply.code(404);
      return { error: "Race ethnicity not found" };
    }

    await db.delete(race_ethnicity).where(eq(race_ethnicity.id, id));

    reply.code(200);
    return {
      message: "Race ethnicity deleted successfully.",
    };
  } catch (error) {
    console.error("Error in destroy:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

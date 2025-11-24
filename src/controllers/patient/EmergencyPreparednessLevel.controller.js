// Note: express-validator replaced with Fastify schema validation
import { db } from "../../config/db.drizzle.js";
import { emergency_preparedness_level } from "../../db/schemas/emergencyPreparednessLevel.schema.js";
import { eq } from "drizzle-orm";

// Get all emergency preparedness levels
export const index = async (request, reply) => {
  try {
    const levels = await db.select().from(emergency_preparedness_level);
    reply.code(200);
    return levels;
  } catch (error) {
    console.error("Error in index:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Create a new emergency preparedness level
export const store = async (request, reply) => {
  try {
    console.log(
      "🔍 EmergencyPreparednessLevel store called - User:",
      request.user?.id
    );
    console.log(
      "🔍 EmergencyPreparednessLevel store - Request body:",
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
        error: "No data provided to create emergency preparedness level",
      };
    }

    // Prepare data for insertion - exclude id (auto-generated) and only include valid fields
    const levelData = {
      level: request.body.level || null,
      description: request.body.description || null,
    };

    // Remove undefined and null values to avoid default insertion
    Object.keys(levelData).forEach((key) => {
      if (levelData[key] === undefined || levelData[key] === null) {
        delete levelData[key];
      }
    });

    // If no data fields remain, return error
    if (Object.keys(levelData).length === 0) {
      reply.code(400);
      return {
        message: "No valid data provided",
        error: "At least one field (level or description) must be provided",
      };
    }

    // Explicitly set timestamps - Drizzle might not apply defaults correctly
    const now = new Date();
    levelData.createdAt = now;
    levelData.updatedAt = now;

    console.log(
      "🔍 EmergencyPreparednessLevel store - Prepared data for insert:",
      JSON.stringify(levelData, null, 2)
    );

    const level = await db
      .insert(emergency_preparedness_level)
      .values(levelData)
      .returning();
    const result = level[0];

    console.log(
      "✅ EmergencyPreparednessLevel store - Created level:",
      result?.id
    );

    reply.code(201);
    return {
      message: "Emergency preparedness level created successfully.",
      data: result,
    };
  } catch (error) {
    console.error("❌ Error in EmergencyPreparednessLevel store:", error);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
    });

    // Extract database error details from error.cause if available
    const dbError = error.cause || error;

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

// Get emergency preparedness level by ID
export const show = async (request, reply) => {
  try {
    const { id } = request.params;
    const levels = await db
      .select()
      .from(emergency_preparedness_level)
      .where(eq(emergency_preparedness_level.id, id))
      .limit(1);
    const level = levels[0];

    if (!level) {
      reply.code(404);
      return { error: "Emergency preparedness level not found" };
    }

    reply.code(200);
    return level;
  } catch (error) {
    console.error("Error in show:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Update emergency preparedness level by ID
export const update = async (request, reply) => {
  try {
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { id } = request.params;
    const levelData = request.body;

    const levels = await db
      .select()
      .from(emergency_preparedness_level)
      .where(eq(emergency_preparedness_level.id, id))
      .limit(1);
    const level = levels[0];

    if (!level) {
      reply.code(404);
      return { error: "Emergency preparedness level not found" };
    }

    const updatedLevel = await db
      .update(emergency_preparedness_level)
      .set(levelData)
      .where(eq(emergency_preparedness_level.id, id))
      .returning();
    const result = updatedLevel[0];

    reply.code(200);
    return {
      message: "Emergency preparedness level updated successfully.",
      data: result,
    };
  } catch (error) {
    console.error("Error in update:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Delete emergency preparedness level by ID
export const destroy = async (request, reply) => {
  try {
    const { id } = request.params;

    const levels = await db
      .select()
      .from(emergency_preparedness_level)
      .where(eq(emergency_preparedness_level.id, id))
      .limit(1);
    const level = levels[0];

    if (!level) {
      reply.code(404);
      return { error: "Emergency preparedness level not found" };
    }

    await db
      .delete(emergency_preparedness_level)
      .where(eq(emergency_preparedness_level.id, id));

    reply.code(200);
    return {
      message: "Emergency preparedness level deleted successfully.",
    };
  } catch (error) {
    console.error("Error in destroy:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

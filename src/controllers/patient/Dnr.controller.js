// Note: express-validator replaced with Fastify schema validation
import { db } from "../../config/db.drizzle.js";
import { dnr } from "../../db/schemas/dnr.schema.js";
import { eq } from "drizzle-orm";

// Get all DNR records
export const index = async (request, reply) => {
  try {
    const dnrRecords = await db.select().from(dnr);
    reply.code(200);
    return dnrRecords;
  } catch (error) {
    console.error("Error in index:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Create a new DNR record
export const store = async (request, reply) => {
  try {
    console.log("🔍 Dnr store called - User:", request.user?.id);
    console.log(
      "🔍 Dnr store - Request body:",
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
        error: "No data provided to create DNR record",
      };
    }

    // Prepare data for insertion - exclude id (auto-generated) and only include valid fields
    const dnrData = {
      dnr_status: request.body.dnr_status || request.body.dnrStatus || null,
      dnr_date: request.body.dnr_date || request.body.dnrDate || null,
      dnr_notes: request.body.dnr_notes || request.body.dnrNotes || null,
    };

    // Remove undefined and null values to avoid default insertion
    Object.keys(dnrData).forEach((key) => {
      if (dnrData[key] === undefined || dnrData[key] === null) {
        delete dnrData[key];
      }
    });

    // If no data fields remain, return error
    if (Object.keys(dnrData).length === 0) {
      reply.code(400);
      return {
        message: "No valid data provided",
        error:
          "At least one field (dnr_status, dnr_date, or dnr_notes) must be provided",
      };
    }

    // Explicitly set timestamps - Drizzle might not apply defaults correctly
    const now = new Date();
    dnrData.createdAt = now;
    dnrData.updatedAt = now;

    console.log(
      "🔍 Dnr store - Prepared data for insert:",
      JSON.stringify(dnrData, null, 2)
    );

    const newDnr = await db.insert(dnr).values(dnrData).returning();
    const result = newDnr[0];

    console.log("✅ Dnr store - Created record:", result?.id);

    reply.code(201);
    return {
      message: "DNR record created successfully.",
      data: result,
    };
  } catch (error) {
    console.error("❌ Error in Dnr store:", error);
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

// Get DNR record by ID
export const show = async (request, reply) => {
  try {
    const { id } = request.params;
    const dnrRecords = await db
      .select()
      .from(dnr)
      .where(eq(dnr.id, id))
      .limit(1);
    const dnrRecord = dnrRecords[0];

    if (!dnrRecord) {
      reply.code(404);
      return { error: "DNR record not found" };
    }

    reply.code(200);
    return dnrRecord;
  } catch (error) {
    console.error("Error in show:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Update DNR record by ID
export const update = async (request, reply) => {
  try {
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { id } = request.params;
    const dnrData = request.body;

    const dnrRecords = await db
      .select()
      .from(dnr)
      .where(eq(dnr.id, id))
      .limit(1);
    const dnrRecord = dnrRecords[0];

    if (!dnrRecord) {
      reply.code(404);
      return { error: "DNR record not found" };
    }

    const updatedDnr = await db
      .update(dnr)
      .set(dnrData)
      .where(eq(dnr.id, id))
      .returning();
    const result = updatedDnr[0];

    reply.code(200);
    return {
      message: "DNR record updated successfully.",
      data: result,
    };
  } catch (error) {
    console.error("Error in update:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Delete DNR record by ID
export const destroy = async (request, reply) => {
  try {
    const { id } = request.params;

    const dnrRecords = await db
      .select()
      .from(dnr)
      .where(eq(dnr.id, id))
      .limit(1);
    const dnrRecord = dnrRecords[0];

    if (!dnrRecord) {
      reply.code(404);
      return { error: "DNR record not found" };
    }

    await db.delete(dnr).where(eq(dnr.id, id));

    reply.code(200);
    return {
      message: "DNR record deleted successfully.",
    };
  } catch (error) {
    console.error("Error in destroy:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

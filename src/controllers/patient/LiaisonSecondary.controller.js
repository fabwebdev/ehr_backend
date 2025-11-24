// Note: express-validator replaced with Fastify schema validation
import { db } from "../../config/db.drizzle.js";
import { liaison_secondary } from "../../db/schemas/liaisonSecondary.schema.js";
import { eq } from "drizzle-orm";

// Get all secondary liaisons
export const index = async (request, reply) => {
  try {
    const liaisons = await db.select().from(liaison_secondary);
    reply.code(200);
    return liaisons;
  } catch (error) {
    console.error("Error in index:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Create a new secondary liaison
export const store = async (request, reply) => {
  try {
    console.log("🔍 LiaisonSecondary store called - User:", request.user?.id);
    console.log(
      "🔍 LiaisonSecondary store - Request body:",
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
        error: "No data provided to create secondary liaison",
      };
    }

    // Prepare data for insertion - exclude id (auto-generated) and only include valid fields
    let liaisonData = {
      first_name: request.body.first_name || request.body.firstName || null,
      last_name: request.body.last_name || request.body.lastName || null,
      phone: request.body.phone || null,
      email: request.body.email || null,
      relationship: request.body.relationship || null,
    };

    // Handle 'name' field if provided - split into first_name and last_name
    if (
      request.body.name &&
      (!liaisonData.first_name || !liaisonData.last_name)
    ) {
      const nameParts = String(request.body.name).trim().split(/\s+/);
      if (nameParts.length > 0) {
        liaisonData.first_name = liaisonData.first_name || nameParts[0] || null;
        if (nameParts.length > 1) {
          // Join remaining parts as last name
          liaisonData.last_name =
            liaisonData.last_name || nameParts.slice(1).join(" ") || null;
        }
      }
    }

    // Remove undefined and null values to avoid default insertion
    Object.keys(liaisonData).forEach((key) => {
      if (
        liaisonData[key] === undefined ||
        liaisonData[key] === null ||
        liaisonData[key] === ""
      ) {
        delete liaisonData[key];
      }
    });

    // If no data fields remain, return error
    if (Object.keys(liaisonData).length === 0) {
      reply.code(400);
      return {
        message: "No valid data provided",
        error: "At least one field must be provided to create a liaison",
      };
    }

    // Explicitly set timestamps - Drizzle might not apply defaults correctly
    const now = new Date();
    liaisonData.createdAt = now;
    liaisonData.updatedAt = now;

    console.log(
      "🔍 LiaisonSecondary store - Prepared data for insert:",
      JSON.stringify(liaisonData, null, 2)
    );

    const liaison = await db
      .insert(liaison_secondary)
      .values(liaisonData)
      .returning();
    const result = liaison[0];

    console.log("✅ LiaisonSecondary store - Created liaison:", result?.id);

    reply.code(201);
    return {
      message: "Secondary liaison created successfully.",
      data: result,
    };
  } catch (error) {
    console.error("❌ Error in LiaisonSecondary store:", error);
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

// Get secondary liaison by ID
export const show = async (request, reply) => {
  try {
    const { id } = request.params;
    const liaisons = await db
      .select()
      .from(liaison_secondary)
      .where(eq(liaison_secondary.id, id))
      .limit(1);
    const liaison = liaisons[0];

    if (!liaison) {
      reply.code(404);
      return { error: "Secondary liaison not found" };
    }

    reply.code(200);
    return liaison;
  } catch (error) {
    console.error("Error in show:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Update secondary liaison by ID
export const update = async (request, reply) => {
  try {
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { id } = request.params;
    const liaisonData = request.body;

    const liaisons = await db
      .select()
      .from(liaison_secondary)
      .where(eq(liaison_secondary.id, id))
      .limit(1);
    const liaison = liaisons[0];

    if (!liaison) {
      reply.code(404);
      return { error: "Secondary liaison not found" };
    }

    const updatedLiaison = await db
      .update(liaison_secondary)
      .set(liaisonData)
      .where(eq(liaison_secondary.id, id))
      .returning();
    const result = updatedLiaison[0];

    reply.code(200);
    return {
      message: "Secondary liaison updated successfully.",
      data: result,
    };
  } catch (error) {
    console.error("Error in update:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Delete secondary liaison by ID
export const destroy = async (request, reply) => {
  try {
    const { id } = request.params;

    const liaisons = await db
      .select()
      .from(liaison_secondary)
      .where(eq(liaison_secondary.id, id))
      .limit(1);
    const liaison = liaisons[0];

    if (!liaison) {
      reply.code(404);
      return { error: "Secondary liaison not found" };
    }

    await db.delete(liaison_secondary).where(eq(liaison_secondary.id, id));

    reply.code(200);
    return {
      message: "Secondary liaison deleted successfully.",
    };
  } catch (error) {
    console.error("Error in destroy:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

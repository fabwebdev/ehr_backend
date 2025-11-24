// Note: express-validator replaced with Fastify schema validation
import { db } from "../../config/db.drizzle.js";
import { dme_providers } from "../../db/schemas/dmeProvider.schema.js";
import { eq } from "drizzle-orm";

// Get all DME providers
export const index = async (request, reply) => {
  try {
    const providers = await db.select().from(dme_providers);
    reply.code(200);
    return providers;
  } catch (error) {
    console.error("Error in index:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Create a new DME provider
export const store = async (request, reply) => {
  try {
    console.log("🔍 DmeProvider store called - User:", request.user?.id);
    console.log(
      "🔍 DmeProvider store - Request body:",
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
        error: "No data provided to create DME provider",
      };
    }

    // Prepare data for insertion - exclude id (auto-generated) and only include valid fields
    const providerData = {
      provider_name:
        request.body.provider_name || request.body.providerName || null,
      contact_person:
        request.body.contact_person || request.body.contactPerson || null,
      phone: request.body.phone || null,
      email: request.body.email || null,
      address: request.body.address || null,
      city: request.body.city || null,
      state: request.body.state || null,
      zip_code: request.body.zip_code || request.body.zipCode || null,
    };

    // Remove undefined and null values to avoid default insertion
    Object.keys(providerData).forEach((key) => {
      if (providerData[key] === undefined || providerData[key] === null) {
        delete providerData[key];
      }
    });

    // If no data fields remain, return error
    if (Object.keys(providerData).length === 0) {
      reply.code(400);
      return {
        message: "No valid data provided",
        error: "At least one field must be provided to create a DME provider",
      };
    }

    // Explicitly set timestamps - Drizzle might not apply defaults correctly
    const now = new Date();
    providerData.createdAt = now;
    providerData.updatedAt = now;

    console.log(
      "🔍 DmeProvider store - Prepared data for insert:",
      JSON.stringify(providerData, null, 2)
    );

    const provider = await db
      .insert(dme_providers)
      .values(providerData)
      .returning();
    const result = provider[0];

    console.log("✅ DmeProvider store - Created provider:", result?.id);

    reply.code(201);
    return {
      message: "DME provider created successfully.",
      data: result,
    };
  } catch (error) {
    console.error("❌ Error in DmeProvider store:", error);
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

// Get DME provider by ID
export const show = async (request, reply) => {
  try {
    const { id } = request.params;
    const providers = await db
      .select()
      .from(dme_providers)
      .where(eq(dme_providers.id, id))
      .limit(1);
    const provider = providers[0];

    if (!provider) {
      reply.code(404);
      return { error: "DME provider not found" };
    }

    reply.code(200);
    return provider;
  } catch (error) {
    console.error("Error in show:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Update DME provider by ID
export const update = async (request, reply) => {
  try {
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { id } = request.params;
    const providerData = request.body;

    const providers = await db
      .select()
      .from(dme_providers)
      .where(eq(dme_providers.id, id))
      .limit(1);
    const provider = providers[0];

    if (!provider) {
      reply.code(404);
      return { error: "DME provider not found" };
    }

    const updatedProvider = await db
      .update(dme_providers)
      .set(providerData)
      .where(eq(dme_providers.id, id))
      .returning();
    const result = updatedProvider[0];

    reply.code(200);
    return {
      message: "DME provider updated successfully.",
      data: result,
    };
  } catch (error) {
    console.error("Error in update:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Delete DME provider by ID
export const destroy = async (request, reply) => {
  try {
    const { id } = request.params;

    const providers = await db
      .select()
      .from(dme_providers)
      .where(eq(dme_providers.id, id))
      .limit(1);
    const provider = providers[0];

    if (!provider) {
      reply.code(404);
      return { error: "DME provider not found" };
    }

    await db.delete(dme_providers).where(eq(dme_providers.id, id));

    reply.code(200);
    return {
      message: "DME provider deleted successfully.",
    };
  } catch (error) {
    console.error("Error in destroy:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

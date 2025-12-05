import { db } from "../../config/db.drizzle.js";
import { integumentary_assessment } from "../../db/schemas/integumentaryAssessment.schema.js";
import { integumentary } from "../../db/schemas/integumentary.schema.js";
import { eq } from "drizzle-orm";

class IntegumentaryAssessmentController {
    // Get all integumentary assessments
    async index(request, reply) {
        try {
            const integumentaryAssessments = await db.select().from(integumentary_assessment);
            reply.code(200);
            return integumentaryAssessments;
        } catch (error) {
            console.error("Error fetching integumentary assessments:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get all integumentary options
    async integumentaryList(request, reply) {
        try {
            const integumentaryList = await db.select().from(integumentary);
            reply.code(200);
            return integumentaryList;
        } catch (error) {
            console.error("Error fetching integumentary list:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Store or update integumentary assessment
    async store(request, reply) {
        try {
            const { patient_id, integumentary_ids } = request.body;

            // Validate required fields
            if (!patient_id) {
                reply.code(400);
            return {
                    message: "Patient ID is required",
                };
            }

            if (!integumentary_ids) {
                reply.code(400);
            return {
                    message: "Integumentary IDs are required",
                };
            }

            // Check if integumentary assessment already exists for this patient
            const existingAssessments = await db.select().from(integumentary_assessment)
                .where(eq(integumentary_assessment.patient_id, patient_id))
                .limit(1);
            const existingAssessment = existingAssessments[0];

            // Convert integumentary_ids array to comma-separated string
            const integumentaryIdsString = Array.isArray(integumentary_ids)
                ? integumentary_ids.join(",")
                : integumentary_ids;

            let result;
            const now = new Date();
            if (existingAssessment) {
                // Update existing integumentary assessment
                result = await db.update(integumentary_assessment)
                    .set({ 
                        integumentary_ids: integumentaryIdsString,
                        updatedAt: now
                    })
                    .where(eq(integumentary_assessment.patient_id, patient_id))
                    .returning();
                result = result[0];
            } else {
                // Create new integumentary assessment
                result = await db.insert(integumentary_assessment)
                    .values({
                        patient_id: patient_id,
                        integumentary_ids: integumentaryIdsString,
                        createdAt: now,
                        updatedAt: now,
                    })
                    .returning();
                result = result[0];
            }

            reply.code(201);
            return {
                message: "Integumentary assessment created or updated successfully",
                data: result,
            };
        } catch (error) {
            console.error("Error storing integumentary assessment:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Show integumentary assessment for a specific patient
    async show(request, reply) {
        try {
            const { id } = request.params;

            const integumentaryAssessments = await db.select().from(integumentary_assessment)
                .where(eq(integumentary_assessment.patient_id, id))
                .limit(1);
            const integumentaryAssessment = integumentaryAssessments[0];

            if (!integumentaryAssessment) {
                reply.code(404);
            return {
                    error: "No integumentary assessment found for this patient",
                };
            }

            reply.code(200);
            return integumentaryAssessment;
        } catch (error) {
            console.error("Error fetching integumentary assessment:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new IntegumentaryAssessmentController();
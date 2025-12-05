import { db } from "../../config/db.drizzle.js";
import { cardiac_assessment } from "../../db/schemas/cardiacAssessment.schema.js";
import { cardiac } from "../../db/schemas/cardiac.schema.js";
import { eq } from "drizzle-orm";
import { logAudit } from "../../middleware/audit.middleware.js";

class CardiacAssessmentController {
    // Get all cardiac assessments
    async index(request, reply) {
        try {
            const cardiacAssessments = await db.select().from(cardiac_assessment);
            reply.code(200);
            return cardiacAssessments;
        } catch (error) {
            console.error("Error fetching cardiac assessments:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get all cardiac options
    async cardiacList(request, reply) {
        try {
            const cardiacList = await db.select().from(cardiac);
            reply.code(200);
            return cardiacList;
        } catch (error) {
            console.error("Error fetching cardiac list:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Store or update cardiac assessment
    async store(request, reply) {
        try {
            const { patient_id, cardiac_ids } = request.body;

            // Validate required fields
            if (!patient_id) {
                reply.code(400);
                return {
                    message: "Patient ID is required",
                };
            }

            if (!cardiac_ids) {
                reply.code(400);
                return {
                    message: "Cardiac IDs are required",
                };
            }

            // Check if cardiac assessment already exists for this patient
            const existingAssessments = await db.select().from(cardiac_assessment).where(eq(cardiac_assessment.patient_id, patient_id)).limit(1);
            const existingAssessment = existingAssessments[0];

            // Convert cardiac_ids array to comma-separated string
            const cardiacIdsString = Array.isArray(cardiac_ids)
                ? cardiac_ids.join(",")
                : cardiac_ids;

            let result;
            let action;
            const now = new Date();
            if (existingAssessment) {
                // Update existing cardiac assessment
                result = await db.update(cardiac_assessment)
                    .set({ cardiac_ids: cardiacIdsString, updatedAt: now })
                    .where(eq(cardiac_assessment.patient_id, patient_id))
                    .returning();
                result = result[0];
                action = "UPDATE";
            } else {
                // Create new cardiac assessment
                result = await db.insert(cardiac_assessment).values({
                    patient_id: patient_id,
                    cardiac_ids: cardiacIdsString,
                    createdAt: now,
                    updatedAt: now,
                }).returning();
                result = result[0];
                action = "CREATE";
            }

            await logAudit(request, action, "cardiac_assessment", result.id);

            reply.code(201);
            return {
                message: "Cardiac assessment created or updated successfully",
                data: result,
            };
        } catch (error) {
            console.error("Error storing cardiac assessment:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Show cardiac assessment for a specific patient
    // Returns empty data if no assessment exists (to allow frontend to render form)
    async show(request, reply) {
        try {
            const { id } = request.params;

            const cardiacAssessments = await db.select().from(cardiac_assessment).where(eq(cardiac_assessment.patient_id, id)).limit(1);
            const cardiacAssessment = cardiacAssessments[0];

            if (!cardiacAssessment) {
                // Return 200 with empty data instead of 404, so frontend can render form
                reply.code(200);
                return {
                    id: null,
                    patient_id: parseInt(id),
                    cardiac_ids: "",
                    createdAt: null,
                    updatedAt: null,
                };
            }

            await logAudit(request, "READ", "cardiac_assessment", cardiacAssessment.id);

            reply.code(200);
            return cardiacAssessment;
        } catch (error) {
            console.error("Error fetching cardiac assessment:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new CardiacAssessmentController();
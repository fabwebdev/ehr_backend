import { db } from "../../config/db.drizzle.js";
import { endocrine_assessment } from "../../db/schemas/endocrineAssessment.schema.js";
import { endocrine } from "../../db/schemas/endocrine.schema.js";
import { eq } from "drizzle-orm";

class EndocrineAssessmentController {
    // Get all endocrine assessments
    async index(request, reply) {
        try {
            const endocrineAssessments = await db.select().from(endocrine_assessment);
            reply.code(200);
            return endocrineAssessments;
        } catch (error) {
            console.error("Error fetching endocrine assessments:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get all endocrine options
    async endocrineList(request, reply) {
        try {
            const endocrineList = await db.select().from(endocrine);
            reply.code(200);
            return endocrineList;
        } catch (error) {
            console.error("Error fetching endocrine list:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Store or update endocrine assessment
    async store(request, reply) {
        try {
            const { patient_id, endocrine_ids } = request.body;

            // Validate required fields
            if (!patient_id) {
                reply.code(400);
            return {
                    message: "Patient ID is required",
                };
            }

            if (!endocrine_ids) {
                reply.code(400);
            return {
                    message: "Endocrine IDs are required",
                };
            }

            // Check if endocrine assessment already exists for this patient
            const existingAssessments = await db.select().from(endocrine_assessment).where(eq(endocrine_assessment.patient_id, patient_id)).limit(1);
            const existingAssessment = existingAssessments[0];

            // Convert endocrine_ids array to comma-separated string
            const endocrineIdsString = Array.isArray(endocrine_ids)
                ? endocrine_ids.join(",")
                : endocrine_ids;

            let result;
            const now = new Date();
            
            if (existingAssessment) {
                // Update existing endocrine assessment
                result = await db.update(endocrine_assessment)
                    .set({ 
                        endocrine_ids: endocrineIdsString,
                        updatedAt: now
                    })
                    .where(eq(endocrine_assessment.patient_id, patient_id))
                    .returning();
                result = result[0];
            } else {
                // Create new endocrine assessment
                result = await db.insert(endocrine_assessment).values({
                    patient_id: patient_id,
                    endocrine_ids: endocrineIdsString,
                    createdAt: now,
                    updatedAt: now,
                }).returning();
                result = result[0];
            }

            reply.code(201);
            return {
                message: "Endocrine assessment created or updated successfully",
                data: result,
            };
        } catch (error) {
            console.error("Error storing endocrine assessment:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Show endocrine assessment for a specific patient
    // Returns empty data if no assessment exists (to allow frontend to render form)
    async show(request, reply) {
        try {
            const { id } = request.params;

            const endocrineAssessments = await db.select().from(endocrine_assessment).where(eq(endocrine_assessment.patient_id, id)).limit(1);
            const endocrineAssessment = endocrineAssessments[0];

            if (!endocrineAssessment) {
                // Return 200 with empty data instead of 404, so frontend can render form
                reply.code(200);
                return {
                    id: null,
                    patient_id: parseInt(id),
                    endocrine_ids: "",
                    createdAt: null,
                    updatedAt: null,
                };
            }

            reply.code(200);
            return endocrineAssessment;
        } catch (error) {
            console.error("Error fetching endocrine assessment:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new EndocrineAssessmentController();
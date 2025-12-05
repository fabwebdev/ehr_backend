import { db } from "../../config/db.drizzle.js";
import { hematological_assessment } from "../../db/schemas/hematologicalAssessment.schema.js";
import { hematological } from "../../db/schemas/hematological.schema.js";
import { eq } from "drizzle-orm";

class HematologicalAssessmentController {
    // Get all hematological assessments
    async index(request, reply) {
        try {
            const hematologicalAssessments = await db.select().from(hematological_assessment);
            reply.code(200);
            return hematologicalAssessments;
        } catch (error) {
            console.error("Error fetching hematological assessments:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get all hematological options
    async hematologicalList(request, reply) {
        try {
            const hematologicalList = await db.select().from(hematological);
            reply.code(200);
            return hematologicalList;
        } catch (error) {
            console.error("Error fetching hematological list:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Store or update hematological assessment
    async store(request, reply) {
        try {
            const { patient_id, hematological_ids } = request.body;

            // Validate required fields
            if (!patient_id) {
                reply.code(400);
            return {
                    message: "Patient ID is required",
                };
            }

            if (!hematological_ids) {
                reply.code(400);
            return {
                    message: "Hematological IDs are required",
                };
            }

            // Check if hematological assessment already exists for this patient
            const existingAssessments = await db.select().from(hematological_assessment).where(eq(hematological_assessment.patient_id, patient_id)).limit(1);
            const existingAssessment = existingAssessments[0];

            // Convert hematological_ids array to comma-separated string
            const hematologicalIdsString = Array.isArray(hematological_ids)
                ? hematological_ids.join(",")
                : hematological_ids;

            let result;
            const now = new Date();
            if (existingAssessment) {
                // Update existing hematological assessment
                result = await db.update(hematological_assessment)
                    .set({ 
                        hematological_ids: hematologicalIdsString,
                        updatedAt: now
                    })
                    .where(eq(hematological_assessment.patient_id, patient_id))
                    .returning();
                result = result[0];
            } else {
                // Create new hematological assessment
                result = await db.insert(hematological_assessment).values({
                    patient_id: patient_id,
                    hematological_ids: hematologicalIdsString,
                    createdAt: now,
                    updatedAt: now,
                }).returning();
                result = result[0];
            }

            reply.code(201);
            return {
                message: "Hematological assessment created or updated successfully",
                data: result,
            };
        } catch (error) {
            console.error("Error storing hematological assessment:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Show hematological assessment for a specific patient
    async show(request, reply) {
        try {
            const { id } = request.params;

            const hematologicalAssessments = await db.select().from(hematological_assessment).where(eq(hematological_assessment.patient_id, id)).limit(1);
            const hematologicalAssessment = hematologicalAssessments[0];

            if (!hematologicalAssessment) {
                reply.code(404);
            return {
                    error: "No hematological assessment found for this patient",
                };
            }

            reply.code(200);
            return hematologicalAssessment;
        } catch (error) {
            console.error("Error fetching hematological assessment:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new HematologicalAssessmentController();
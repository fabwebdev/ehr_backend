import { db } from "../../config/db.drizzle.js";
import { nutrition_assessment } from "../../db/schemas/nutritionAssessment.schema.js";
import { nutrition_problems_type } from "../../db/schemas/nutritionProblemsType.schema.js";
import { nutrition_template } from "../../db/schemas/nutritionTemplate.schema.js";
import { eq } from "drizzle-orm";

class NutritionController {
    // Get all nutrition problems types
    async nutritionProblemsTypes(request, reply) {
        try {
            const nutritionProblemsTypes = await db.select().from(nutrition_problems_type);
            reply.code(200);
            return nutritionProblemsTypes;
        } catch (error) {
            console.error("Error fetching nutrition problems types:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Show nutrition assessment for a specific patient
    async nutritionAssessmentShow(request, reply) {
        try {
            const { id } = request.params;

            const nutritionAssessments = await db.select().from(nutrition_assessment).where(eq(nutrition_assessment.patient_id, id)).limit(1);
            const nutritionAssessment = nutritionAssessments[0];

            if (!nutritionAssessment) {
                reply.code(404);
            return {
                    error: "No nutrition assessment found for this patient",
                };
            }

            reply.code(200);
            return {
                nutrition_assessment: nutritionAssessment,
            };
        } catch (error) {
            console.error("Error fetching nutrition assessment:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Auto save nutrition assessment for a patient
    async nutritionAssessmentAutoSave(request, reply) {
        try {
            const { id } = request.params;
            const {
                patient_id,
                nutrition_problems_type_ids,
                nutrition_template_ids,
            } = request.body;

            // Validate required fields
            if (!patient_id) {
                reply.code(400);
            return {
                    message: "Patient ID is required",
                };
            }

            if (!nutrition_problems_type_ids) {
                reply.code(400);
            return {
                    message: "Nutrition problems type IDs are required",
                };
            }

            if (!nutrition_template_ids) {
                reply.code(400);
            return {
                    message: "Nutrition template IDs are required",
                };
            }

            // Check if nutrition assessment already exists for this patient
            const existingAssessments = await db.select().from(nutrition_assessment).where(eq(nutrition_assessment.patient_id, id)).limit(1);
            const existingAssessment = existingAssessments[0];

            // Convert arrays to comma-separated strings if they are arrays
            const nutritionProblemsTypeIdsString = Array.isArray(
                nutrition_problems_type_ids
            )
                ? nutrition_problems_type_ids.join(",")
                : nutrition_problems_type_ids;

            const nutritionTemplateIdsString = Array.isArray(
                nutrition_template_ids
            )
                ? nutrition_template_ids.join(",")
                : nutrition_template_ids;

            let result;
            const now = new Date();
            
            if (existingAssessment) {
                // Update existing nutrition assessment
                result = await db.update(nutrition_assessment)
                    .set({
                        patient_id: patient_id,
                        nutrition_problems_type_ids: nutritionProblemsTypeIdsString,
                        nutrition_template_ids: nutritionTemplateIdsString,
                        updatedAt: now,
                    })
                    .where(eq(nutrition_assessment.patient_id, id))
                    .returning();
                result = result[0];
            } else {
                // Create new nutrition assessment
                result = await db.insert(nutrition_assessment)
                    .values({
                        patient_id: patient_id,
                        nutrition_problems_type_ids: nutritionProblemsTypeIdsString,
                        nutrition_template_ids: nutritionTemplateIdsString,
                        createdAt: now,
                        updatedAt: now,
                    })
                    .returning();
                result = result[0];
            }

            reply.code(200);
            return {
                message: "Données sauvegardées avec succès",
                data: result,
            };
        } catch (error) {
            console.error("Error saving nutrition assessment:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new NutritionController();
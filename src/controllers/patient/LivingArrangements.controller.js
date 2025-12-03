import { db } from "../../config/db.drizzle.js";
import { living_arrangements } from "../../db/schemas/livingArrangements.schema.js";
import { eq } from "drizzle-orm";

class LivingArrangementsController {
    // Get all living arrangements
    async index(request, reply) {
        try {
            const livingArrangements = await db.select().from(living_arrangements);
            reply.code(200);
            return livingArrangements;
        } catch (error) {
            console.error("Error fetching living arrangements:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get all living arrangements (alias for index)
    async livingArrangementsList(request, reply) {
        try {
            const livingArrangements = await db.select().from(living_arrangements);
            reply.code(200);
            return livingArrangements;
        } catch (error) {
            console.error("Error fetching living arrangements list:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Store or update living arrangements
    async store(request, reply) {
        try {
            const {
                patient_id,
                primary_caregiver,
                primary_location_of_patient,
                caregiver_availability,
                patient_able,
                need_hospice_service,
            } = request.body;

            // Validate required fields
            if (!patient_id) {
                reply.code(400);
            return {
                    message: "Patient ID is required",
                };
            }

            // Check if living arrangements already exists for this patient
            const existingArrangements = await db.select().from(living_arrangements).where(eq(living_arrangements.patient_id, patient_id)).limit(1);
            const existingArrangement = existingArrangements[0];

            // Convert need_hospice_service array to comma-separated string if it's an array
            const needHospiceServiceString = Array.isArray(need_hospice_service)
                ? need_hospice_service.join(",")
                : need_hospice_service;

            // Prepare data for update or create
            const now = new Date();
            const livingArrangementsData = {
                patient_id: patient_id,
                primary_caregiver: primary_caregiver || null,
                primary_location_of_patient: primary_location_of_patient || null,
                caregiver_availability: caregiver_availability || null,
                patient_able: patient_able !== undefined ? patient_able : null,
                need_hospice_service: needHospiceServiceString || null,
            };

            let result;
            if (existingArrangement) {
                // Update existing living arrangements
                livingArrangementsData.updatedAt = now;
                result = await db.update(living_arrangements).set(livingArrangementsData).where(eq(living_arrangements.patient_id, patient_id)).returning();
                result = result[0];
            } else {
                // Create new living arrangements
                livingArrangementsData.createdAt = now;
                livingArrangementsData.updatedAt = now;
                result = await db.insert(living_arrangements).values(livingArrangementsData).returning();
                result = result[0];
            }

            reply.code(201);
            return {
                message: "Living arrangements created or updated successfully",
                data: result,
            };
        } catch (error) {
            console.error("Error storing living arrangements:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Show living arrangements for a specific patient
    async show(request, reply) {
        try {
            const { id } = request.params;

            const livingArrangementsRecords = await db.select().from(living_arrangements).where(eq(living_arrangements.patient_id, id)).limit(1);
            const livingArrangements = livingArrangementsRecords[0];

            if (!livingArrangements) {
                reply.code(404);
            return {
                    error: "No living arrangements found for this patient",
                };
            }

            reply.code(200);
            return livingArrangements;
        } catch (error) {
            console.error("Error fetching living arrangements:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new LivingArrangementsController();
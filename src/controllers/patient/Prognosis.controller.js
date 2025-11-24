import { db } from "../../config/db.drizzle.js";
import { prognosis } from "../../db/schemas/prognosis.schema.js";
import { prognosis_patient } from "../../db/schemas/prognosisPatient.schema.js";
import { prognosis_caregiver } from "../../db/schemas/prognosisCaregiver.schema.js";
import { prognosis_imminence_of_death } from "../../db/schemas/prognosisImminence.schema.js";
import { eq } from "drizzle-orm";

class PrognosisController {
    // Get all prognoses
    async index(request, reply) {
        try {
            const prognoses = await db.select().from(prognosis);
            reply.code(200);
            return prognoses;
        } catch (error) {
            console.error("Error fetching prognoses:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Store or update prognosis
    async store(request, reply) {
        try {
            const {
                patient_id,
                prognosis_patient_is_imminent,
                prognosis_patient_id,
                prognosis_caregiver_id,
                prognosis_imminence_id,
            } = request.body;

            // Validate required fields
            if (!patient_id) {
                reply.code(400);
            return {
                    message: "Patient ID is required",
                };
            }

            // Check if prognosis already exists for this patient
            const existingPrognoses = await db.select().from(prognosis).where(eq(prognosis.patient_id, patient_id)).limit(1);
            const existingPrognosis = existingPrognoses[0];

            // Convert arrays to comma-separated strings if they are arrays
            const prognosisPatientIdString = Array.isArray(prognosis_patient_id)
                ? prognosis_patient_id.join(",")
                : prognosis_patient_id;

            const prognosisCaregiverIdString = Array.isArray(
                prognosis_caregiver_id
            )
                ? prognosis_caregiver_id.join(",")
                : prognosis_caregiver_id;

            const prognosisImminenceIdString = Array.isArray(
                prognosis_imminence_id
            )
                ? prognosis_imminence_id.join(",")
                : prognosis_imminence_id;

            // Prepare data for update or create
            const prognosisData = {
                patient_id: patient_id,
                prognosis_patient_is_imminent:
                    prognosis_patient_is_imminent || null,
                prognosis_patient_id: prognosisPatientIdString || null,
                prognosis_caregiver_id: prognosisCaregiverIdString || null,
                prognosis_imminence_id: prognosisImminenceIdString || null,
            };

            let result;
            if (existingPrognosis) {
                // Update existing prognosis
                result = await db.update(prognosis).set(prognosisData).where(eq(prognosis.patient_id, patient_id)).returning();
                result = result[0];
            } else {
                // Create new prognosis
                result = await db.insert(prognosis).values(prognosisData).returning();
                result = result[0];
            }

            reply.code(201);
            return {
                message: "Prognosis créé ou mis à jour avec succès.",
                data: result,
            };
        } catch (error) {
            console.error("Error saving prognosis:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Show prognosis for a specific patient
    async show(request, reply) {
        try {
            const { id } = request.params;

            const prognosisRecords = await db.select().from(prognosis).where(eq(prognosis.patient_id, id)).limit(1);
            const prognosisRecord = prognosisRecords[0];

            if (!prognosisRecord) {
                reply.code(404);
            return {
                    error: "No prognosis found for this Prognosis",
                };
            }

            reply.code(200);
            return prognosisRecord;
        } catch (error) {
            console.error("Error fetching prognosis:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new PrognosisController();
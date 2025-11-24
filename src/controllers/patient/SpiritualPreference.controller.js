import { db } from "../../config/db.drizzle.js";
import { spiritual_preference } from "../../db/schemas/spiritualPreference.schema.js";
import { eq } from "drizzle-orm";

class SpiritualPreferenceController {
    // Get all spiritual preferences
    async index(request, reply) {
        try {
            const spiritualPreferences = await db.select().from(spiritual_preference);
            reply.code(200);
            return spiritualPreferences;
        } catch (error) {
            console.error("Error fetching spiritual preferences:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Store or update spiritual preference
    async store(request, reply) {
        try {
            const { patient_id, patient_spiritual, not_religious, comments } =
                request.body;

            // Validate required fields
            if (!patient_id) {
                reply.code(400);
            return {
                    message: "Patient ID is required",
                };
            }

            // Check if spiritual preference already exists for this patient
            const existingPreferences = await db.select().from(spiritual_preference).where(eq(spiritual_preference.patient_id, patient_id)).limit(1);
            const existingPreference = existingPreferences[0];

            // Prepare data for update or create
            const spiritualPreferenceData = {
                patient_id: patient_id,
                patient_spiritual: patient_spiritual || null,
                not_religious:
                    not_religious !== undefined ? not_religious : null,
                comments: comments || null,
            };

            let result;
            if (existingPreference) {
                // Update existing spiritual preference
                result = await db.update(spiritual_preference).set(spiritualPreferenceData).where(eq(spiritual_preference.patient_id, patient_id)).returning();
                result = result[0];
            } else {
                // Create new spiritual preference
                result = await db.insert(spiritual_preference).values(spiritualPreferenceData).returning();
                result = result[0];
            }

            reply.code(201);
            return {
                message: "Spiritual Preference créé ou mis à jour avec succès.",
                data: result,
            };
        } catch (error) {
            console.error("Error saving spiritual preference:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Show spiritual preference for a specific patient
    async show(request, reply) {
        try {
            const { id } = request.params;

            const spiritualPreferences = await db.select().from(spiritual_preference).where(eq(spiritual_preference.patient_id, id)).limit(1);
            const spiritualPreference = spiritualPreferences[0];

            if (!spiritualPreference) {
                reply.code(404);
            return {
                    error: "No Spiritual Preference found for this SpiritualPreference",
                };
            }

            reply.code(200);
            return spiritualPreference;
        } catch (error) {
            console.error("Error fetching spiritual preference:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new SpiritualPreferenceController();
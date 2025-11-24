import { db } from "../../config/db.drizzle.js";
import { address } from "../../db/schemas/address.schema.js";
import { eq } from "drizzle-orm";

class AddressController {
    // Store or update address
    async store(request, reply) {
        try {
            const {
                patient_id,
                address_line_1,
                address_line_2,
                state,
                city,
                zip_code,
                phone_number,
                alternate_phone,
            } = request.body;

            // Validate required fields
            if (!patient_id) {
                reply.code(400);
            return {
                    message: "Patient ID is required",
                };
            }

            // Check if address already exists for this patient
            const existingAddress = await db.select().from(address).where(eq(address.patient_id, patient_id)).limit(1);

            // Prepare data for update or create
            const addressData = {
                patient_id: patient_id,
                address_line_1: address_line_1 || null,
                address_line_2: address_line_2 || null,
                state: state || null,
                city: city || null,
                zip_code: zip_code || null,
                phone_number: phone_number || null,
                alternate_phone: alternate_phone || null,
            };

            let result;
            if (existingAddress.length > 0) {
                // Update existing address
                result = await db.update(address).set(addressData).where(eq(address.patient_id, patient_id)).returning();
                result = result[0];
            } else {
                // Create new address
                result = await db.insert(address).values(addressData).returning();
                result = result[0];
            }

            return {
                message: "Données sauvegardées avec succès",
                data: result,
            };
        } catch (error) {
            console.error("Error saving address:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Show address for a specific patient
    async show(request, reply) {
        try {
            const { id } = request.params;

            const addressRecords = await db.select().from(address).where(eq(address.patient_id, id)).limit(1);
            const addressRecord = addressRecords[0];

            if (!addressRecord) {
                reply.code(404);
            return {
                    error: "No visit information found for this patient",
                };
            }

            return addressRecord;
        } catch (error) {
            console.error("Error fetching address:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new AddressController();

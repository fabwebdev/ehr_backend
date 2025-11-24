import { db } from "../../config/db.drizzle.js";
import { payer_information } from "../../db/schemas/payerInformation.schema.js";
import { eq } from "drizzle-orm";

class PayerInformationController {
    // Store or update payer information
    async store(request, reply) {
        try {
            const {
                patient_id,
                social_security,
                medicare_beneficiary,
                medicaid_number,
                medicaid_recipient,
                payer_info,
            } = request.body;

            // Validate required fields
            if (!patient_id) {
                reply.code(400);
            return {
                    message: "Patient ID is required",
                };
            }

            // Check if payer information already exists for this patient
            const existingPayerInfo = await db.select().from(payer_information).where(eq(payer_information.patient_id, patient_id)).limit(1);
            const payerInfo = existingPayerInfo[0];

            // Prepare data for update or create
            const payerInformationData = {
                patient_id: patient_id,
                social_security: social_security || null,
                medicare_beneficiary: medicare_beneficiary || null,
                medicaid_number: medicaid_number || null,
                medicaid_recipient:
                    medicaid_recipient !== undefined
                        ? medicaid_recipient
                        : null,
                payer_info: payer_info || null,
            };

            let result;
            if (payerInfo) {
                // Update existing payer information
                result = await db.update(payer_information).set(payerInformationData).where(eq(payer_information.patient_id, patient_id)).returning();
                result = result[0];
            } else {
                // Create new payer information
                result = await db.insert(payer_information).values(payerInformationData).returning();
                result = result[0];
            }

            reply.code(200);
            return {
                message: "Données sauvegardées avec succès",
                data: result,
            };
        } catch (error) {
            console.error("Error saving payer information:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Show payer information for a specific patient
    async show(request, reply) {
        try {
            const { id } = request.params;

            const payerInformationRecords = await db.select().from(payer_information).where(eq(payer_information.patient_id, id)).limit(1);
            const payerInformation = payerInformationRecords[0];

            if (!payerInformation) {
                reply.code(404);
            return {
                    error: "No payer information found for this patient",
                };
            }

            reply.code(200);
            return payerInformation;
        } catch (error) {
            console.error("Error fetching payer information:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new PayerInformationController();
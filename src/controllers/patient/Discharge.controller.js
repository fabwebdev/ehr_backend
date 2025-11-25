import { db } from "../../config/db.drizzle.js";
import { discharge } from "../../db/schemas/discharge.schema.js";
import { discharge_sections } from "../../db/schemas/dischargeSection.schema.js";
import { eq } from "drizzle-orm";
import { logAudit } from "../../middleware/audit.middleware.js";

class DischargeController {
    // Get all discharges
    async index(request, reply) {
        try {
            const discharges = await db.select().from(discharge);
            
            // Log audit - READ operation on discharge table
            await logAudit(request, 'READ', 'discharge', null);
            
            reply.code(200);
            return discharges;
        } catch (error) {
            console.error("Error fetching discharges:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get all discharges (alias for index)
    async dischargeList(request, reply) {
        try {
            const discharges = await db.select().from(discharge);
            reply.code(200);
            return discharges;
        } catch (error) {
            console.error("Error fetching discharge list:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Store or update discharge
    async store(request, reply) {
        try {
            const {
                patient_id,
                type_of_record,
                national_provider_identifier,
                certification_number,
                admission_date,
                reason_for_record,
                discharge_date,
                social_security_number,
                medicare_number,
                medicaid_recipient,
                reason_for_discharge,
            } = request.body;

            // Find existing discharge for this patient
            const existingDischarges = await db.select().from(discharge)
                .where(eq(discharge.patient_id, patient_id))
                .limit(1);
            const existingDischarge = existingDischarges[0];

            // Prepare data for update or create
            const now = new Date();
            const dischargeData = {
                patient_id: patient_id,
                type_of_record: type_of_record || null,
                national_provider_identifier:
                    national_provider_identifier || null,
                certification_number: certification_number || null,
                admission_date: admission_date || null,
                reason_for_record: reason_for_record || null,
                discharge_date: discharge_date || null,
                social_security_number: social_security_number || null,
                medicare_number: medicare_number || null,
                medicaid_recipient: medicaid_recipient || null,
                reason_for_discharge: Array.isArray(reason_for_discharge)
                    ? reason_for_discharge.join(",")
                    : reason_for_discharge || null,
                updatedAt: now,
            };

            let result;
            let action;
            if (existingDischarge) {
                // Update existing discharge
                result = await db.update(discharge)
                    .set(dischargeData)
                    .where(eq(discharge.patient_id, patient_id))
                    .returning();
                result = result[0];
                action = 'UPDATE';
            } else {
                // Create new discharge
                result = await db.insert(discharge)
                    .values({
                        ...dischargeData,
                        createdAt: now,
                    })
                    .returning();
                result = result[0];
                action = 'CREATE';
            }

            // Log audit - CREATE or UPDATE operation on discharge table
            await logAudit(request, action, 'discharge', result.id);

            reply.code(201);
            return {
                message: "Discharge created or updated successfully",
                data: result,
            };
        } catch (error) {
            console.error("Error storing discharge:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Show discharge for a specific patient
    async show(request, reply) {
        try {
            const { id } = request.params;

            const discharges = await db.select().from(discharge)
                .where(eq(discharge.patient_id, id))
                .limit(1);
            const dischargeRecord = discharges[0];

            if (!dischargeRecord) {
                reply.code(404);
            return {
                    error: "No discharge found for this patient",
                };
            }

            // Log audit - READ operation on discharge table
            await logAudit(request, 'READ', 'discharge', dischargeRecord.id);

            reply.code(200);
            return dischargeRecord;
        } catch (error) {
            console.error("Error fetching discharge:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get all discharge sections
    async dischargeSections(request, reply) {
        try {
            const dischargeSections = await db.select().from(discharge_sections);
            reply.code(200);
            return dischargeSections;
        } catch (error) {
            console.error("Error fetching discharge sections:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new DischargeController();
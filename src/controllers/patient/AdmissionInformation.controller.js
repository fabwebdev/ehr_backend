// Note: express-validator replaced with Fastify schema validation
import { db } from "../../config/db.drizzle.js";
import { admission_information } from "../../db/schemas/admissionInformation.schema.js";
import { eq } from "drizzle-orm";
import { logAudit } from "../../middleware/audit.middleware.js";

// Get all admission information
export const index = async (request, reply) => {
    try {
        const admissionInfo = await db.select().from(admission_information);
        
        // Log audit - READ operation on admission_information table
        await logAudit(request, 'READ', 'admission_information', null);
        
        return admissionInfo;
    } catch (error) {
        console.error("Error in index:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Auto save admission information
export const autoSave = async (request, reply) => {
    try {
        // Note: Validation should be done in route definition using Fastify schema
        const admissionData = request.body;

        // Check if admission information already exists for this patient
        const existingAdmissionInfo = await db.select().from(admission_information)
            .where(eq(admission_information.patient_id, admissionData.patient_id))
            .limit(1);
        const admissionInfo = existingAdmissionInfo[0];

        let result;
        let action;
        const now = new Date();
        if (admissionInfo) {
            // Update existing record
            const updateData = {
                ...admissionData,
                createdAt: undefined, // prevent overwriting
                created_at: undefined,
                updatedAt: now,
                updated_at: now,
            };

            result = await db.update(admission_information)
                .set(updateData)
                .where(eq(admission_information.patient_id, admissionData.patient_id))
                .returning();
            result = result[0];
            action = 'UPDATE';
        } else {
            // Create new record
            const newData = {
                ...admissionData,
                createdAt: now,
                updatedAt: now,
            };

            result = await db.insert(admission_information)
                .values(newData)
                .returning();
            result = result[0];
            action = 'CREATE';
        }

        // Log audit - CREATE or UPDATE operation on admission_information table
        await logAudit(request, action, 'admission_information', result.id);

        reply.code(201);
            return {
            message: "Admission information saved successfully.",
            data: result,
        };
    } catch (error) {
        console.error("Error in autoSave:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Get admission information by ID
export const show = async (request, reply) => {
    try {
        const { id } = request.params;
        const admissionInfo = await db.select().from(admission_information)
            .where(eq(admission_information.id, id))
            .limit(1);
        const info = admissionInfo[0];

        if (!info) {
            reply.code(404);
            return { error: "Admission information not found" };
        }

        // Log audit - READ operation on admission_information table
        await logAudit(request, 'READ', 'admission_information', parseInt(id));

        return info;
    } catch (error) {
        console.error("Error in show:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

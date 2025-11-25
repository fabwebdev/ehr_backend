// Note: express-validator replaced with Fastify schema validation
import { db } from "../../config/db.drizzle.js";
import { patients } from "../../db/schemas/index.js";
import { eq } from "drizzle-orm";
import { logAudit } from "../../middleware/audit.middleware.js";

// Get all patients
export const index = async (request, reply) => {
    try {
        const patientsList = await db.select().from(patients);
        
        // Log audit - READ operation on patients table
        await logAudit(request, 'READ', 'patients', null);
        
        reply.code(200);
            return patientsList;
    } catch (error) {
        console.error("Error in index:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Create a new patient
export const store = async (request, reply) => {
    try {
        // Note: Validation should be done in route schema
        // Validation handled in route schema

        const patientData = request.body;
        
        // Convert boolean flags to numbers (0/1) for bigint columns
        if (patientData.oxygen_dependent !== undefined) {
            patientData.oxygen_dependent = patientData.oxygen_dependent === true || patientData.oxygen_dependent === 1 || patientData.oxygen_dependent === '1' ? 1 : 0;
        }
        if (patientData.patient_consents !== undefined) {
            patientData.patient_consents = patientData.patient_consents === true || patientData.patient_consents === 1 || patientData.patient_consents === '1' ? 1 : 0;
        }
        if (patientData.hipaa_received !== undefined) {
            patientData.hipaa_received = patientData.hipaa_received === true || patientData.hipaa_received === 1 || patientData.hipaa_received === '1' ? 1 : 0;
        }
        
        // Explicitly set timestamps - Drizzle might not apply defaults correctly
        const now = new Date();
        patientData.createdAt = now;
        patientData.updatedAt = now;
        
        const newPatient = await db.insert(patients).values(patientData).returning();
        const patient = newPatient[0];

        // Log audit - CREATE operation on patients table
        await logAudit(request, 'CREATE', 'patients', patient.id);

        reply.code(201);
            return {
            message: "Patient created successfully.",
            data: patient,
        };
    } catch (error) {
        console.error("❌ Error in Patient store:", error);
        console.error("❌ Error stack:", error.stack);
        
        // Extract database error details from error.cause if available
        const dbError = error.cause || error;
        console.error("❌ Error details:", {
            message: error.message,
            code: dbError.code,
            detail: dbError.detail,
            hint: dbError.hint,
            severity: dbError.severity,
            table: dbError.table,
            column: dbError.column,
        });
        
        reply.code(500);
            return { 
            message: "Server error",
            error: error.message,
            code: dbError.code,
            detail: dbError.detail,
            hint: dbError.hint,
        };
    }
};

// Get patient by ID
export const show = async (request, reply) => {
    try {
        const { id } = request.params;
        const patientResult = await db.select().from(patients)
            .where(eq(patients.id, parseInt(id)))
            .limit(1);
        const patient = patientResult[0];

        if (!patient) {
            reply.code(404);
            return { error: "Patient not found" };
        }

        // Log audit - READ operation on patients table
        await logAudit(request, 'READ', 'patients', parseInt(id));

        reply.code(200);
            return patient;
    } catch (error) {
        console.error("Error in show:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Update patient by ID
export const update = async (request, reply) => {
    try {
        // Note: Validation should be done in route schema
        // Validation handled in route schema

        const { id } = request.params;
        const patientData = request.body;

        // Convert boolean flags to numbers (0/1) for bigint columns
        if (patientData.oxygen_dependent !== undefined) {
            patientData.oxygen_dependent = patientData.oxygen_dependent === true || patientData.oxygen_dependent === 1 || patientData.oxygen_dependent === '1' ? 1 : 0;
        }
        if (patientData.patient_consents !== undefined) {
            patientData.patient_consents = patientData.patient_consents === true || patientData.patient_consents === 1 || patientData.patient_consents === '1' ? 1 : 0;
        }
        if (patientData.hipaa_received !== undefined) {
            patientData.hipaa_received = patientData.hipaa_received === true || patientData.hipaa_received === 1 || patientData.hipaa_received === '1' ? 1 : 0;
        }

        // Remove timestamps from update data - they should not be updated manually
        delete patientData.createdAt;
        delete patientData.created_at;
        delete patientData.updatedAt;
        delete patientData.updated_at;
        
        // Update the updated_at timestamp explicitly
        patientData.updatedAt = new Date();

        const existingPatient = await db.select().from(patients)
            .where(eq(patients.id, parseInt(id)))
            .limit(1);
        const patient = existingPatient[0];

        if (!patient) {
            reply.code(404);
            return { error: "Patient not found" };
        }

        const updatedPatient = await db.update(patients)
            .set(patientData)
            .where(eq(patients.id, parseInt(id)))
            .returning();
        const result = updatedPatient[0];

        // Log audit - UPDATE operation on patients table
        await logAudit(request, 'UPDATE', 'patients', parseInt(id));

        reply.code(200);
            return {
            message: "Patient updated successfully.",
            data: result,
        };
    } catch (error) {
        console.error("Error in update:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};

// Delete patient by ID
export const destroy = async (request, reply) => {
    try {
        const { id } = request.params;

        const existingPatient = await db.select().from(patients)
            .where(eq(patients.id, parseInt(id)))
            .limit(1);
        const patient = existingPatient[0];

        if (!patient) {
            reply.code(404);
            return { error: "Patient not found" };
        }

        await db.delete(patients).where(eq(patients.id, parseInt(id)));

        // Log audit - DELETE operation on patients table
        await logAudit(request, 'DELETE', 'patients', parseInt(id));

        reply.code(200);
            return {
            message: "Patient deleted successfully.",
        };
    } catch (error) {
        console.error("Error in destroy:", error);
        reply.code(500);
            return { message: "Server error" };
    }
};
import { db } from "../../config/db.drizzle.js";
import { patient_identifiers } from "../../db/schemas/patientIdentifier.schema.js";
import { eq } from "drizzle-orm";

class PatientIdentifiersController {
    // Get all patient identifiers
    async index(request, reply) {
        try {
            const patientIdentifiers = await db.select().from(patient_identifiers);
            reply.code(200);
            return patientIdentifiers;
        } catch (error) {
            console.error("Error fetching patient identifiers:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Create a new patient identifier
    async store(request, reply) {
        try {
            const patientIdentifier = await db.insert(patient_identifiers).values(request.body).returning();
            const result = patientIdentifier[0];
            reply.code(201);
            return result;
        } catch (error) {
            console.error("Error creating patient identifier:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get a specific patient identifier
    async show(request, reply) {
        try {
            const { id } = request.params;
            const patientIdentifiers = await db.select().from(patient_identifiers)
                .where(eq(patient_identifiers.id, id))
                .limit(1);
            const patientIdentifier = patientIdentifiers[0];

            if (!patientIdentifier) {
                reply.code(404);
            return {
                    message: "Patient identifier not found",
                };
            }

            reply.code(200);
            return patientIdentifier;
        } catch (error) {
            console.error("Error fetching patient identifier:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Update a specific patient identifier
    async update(request, reply) {
        try {
            const { id } = request.params;
            const patientIdentifiers = await db.select().from(patient_identifiers)
                .where(eq(patient_identifiers.id, id))
                .limit(1);
            const patientIdentifier = patientIdentifiers[0];

            if (!patientIdentifier) {
                reply.code(404);
            return {
                    message: "Patient identifier not found",
                };
            }

            const updatedPatientIdentifier = await db.update(patient_identifiers)
                .set(request.body)
                .where(eq(patient_identifiers.id, id))
                .returning();
            const result = updatedPatientIdentifier[0];

            reply.code(200);
            return result;
        } catch (error) {
            console.error("Error updating patient identifier:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Delete a specific patient identifier
    async destroy(request, reply) {
        try {
            const { id } = request.params;
            const patientIdentifiers = await db.select().from(patient_identifiers)
                .where(eq(patient_identifiers.id, id))
                .limit(1);
            const patientIdentifier = patientIdentifiers[0];

            if (!patientIdentifier) {
                reply.code(404);
            return {
                    message: "Patient identifier not found",
                };
            }

            await db.delete(patient_identifiers).where(eq(patient_identifiers.id, id));
            reply.code(204);
            return null;
        } catch (error) {
            console.error("Error deleting patient identifier:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new PatientIdentifiersController();
import { db } from "../../config/db.drizzle.js";
import { signature } from "../../db/schemas/signature.schema.js";
import { eq } from "drizzle-orm";

class SignatureController {
    // Store or update signature
    async store(request, reply) {
        try {
            const { patient_id, signature_name } = request.body;

            // Validate required fields
            if (!patient_id) {
                reply.code(400);
            return {
                    message: "Patient ID is required",
                };
            }

            if (!signature_name) {
                reply.code(400);
            return {
                    message: "Signature name is required",
                };
            }

            // Check if signature already exists for this patient
            const existingSignatures = await db.select().from(signature).where(eq(signature.patient_id, patient_id)).limit(1);
            const existingSignature = existingSignatures[0];

            let result;
            if (existingSignature) {
                // Update existing signature
                result = await db.update(signature).set({
                    signature_name: signature_name,
                }).where(eq(signature.patient_id, patient_id)).returning();
                result = result[0];
            } else {
                // Create new signature
                result = await db.insert(signature).values({
                    patient_id: patient_id,
                    signature_name: signature_name,
                }).returning();
                result = result[0];
            }

            reply.code(201);
            return {
                message: "Signature créée ou mise à jour avec succès.",
                data: result,
            };
        } catch (error) {
            console.error("Error saving signature:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Show signature for a specific patient
    async show(request, reply) {
        try {
            const { id } = request.params;

            const signatures = await db.select().from(signature).where(eq(signature.patient_id, id)).limit(1);
            const signatureRecord = signatures[0];

            if (!signatureRecord) {
                reply.code(404);
            return {
                    error: "No visit nutrition assessment found for this patient",
                };
            }

            reply.code(200);
            return signatureRecord;
        } catch (error) {
            console.error("Error fetching signature:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Delete a specific signature
    async delete(request, reply) {
        try {
            const { id } = request.params;
            
            // First find the signature
            const signatures = await db.select().from(signature).where(eq(signature.id, id)).limit(1);
            const signatureRecord = signatures[0];

            if (!signatureRecord) {
                reply.code(404);
            return {
                    message: "La signature n'existe pas",
                    status: 404,
                };
            }

            // Delete the signature
            await db.delete(signature).where(eq(signature.id, id));

            reply.code(200);
            return {
                message: "Signature supprimée avec succès.",
                status: 200,
            };
        } catch (error) {
            console.error("Error deleting signature:", error);
            reply.code(500);
            return {
                message: "Erreur lors de la suppression de la signature.",
                status: 500,
                error: error.message,
            };
        }
    }
}

export default new SignatureController();
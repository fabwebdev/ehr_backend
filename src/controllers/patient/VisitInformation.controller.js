import { db } from "../../config/db.drizzle.js";
import { visit_information } from "../../db/schemas/visitInformation.schema.js";
import { eq } from "drizzle-orm";

class VisitInformationController {
    // Store or update visit information
    async store(request, reply) {
        try {
            const {
                patient_id,
                visit_date,
                visit_time_in,
                travel_time_in,
                travel_time_out,
                visit_time_out,
                documenttation_time,
                associated_mileage,
                surcharge,
            } = request.body;

            // Validate required fields
            if (!patient_id) {
                reply.code(400);
            return {
                    message: "Patient ID is required",
                };
            }

            // Check if visit information already exists for this patient
            const existingVisitInfo = await db.select().from(visit_information).where(eq(visit_information.patient_id, patient_id)).limit(1);
            const visitInfo = existingVisitInfo[0];

            // Prepare data for update or create
            const visitInformationData = {
                patient_id: patient_id,
                visit_date: visit_date || null,
                visit_time_in: visit_time_in || null,
                travel_time_in: travel_time_in || null,
                travel_time_out: travel_time_out || null,
                visit_time_out: visit_time_out || null,
                documenttation_time: documenttation_time || null,
                associated_mileage: associated_mileage || null,
                surcharge: surcharge || null,
            };

            let result;
            if (visitInfo) {
                // Update existing visit information
                result = await db.update(visit_information).set(visitInformationData).where(eq(visit_information.patient_id, patient_id)).returning();
                result = result[0];
            } else {
                // Create new visit information
                result = await db.insert(visit_information).values(visitInformationData).returning();
                result = result[0];
            }

            reply.code(200);
            return {
                message: "Données sauvegardées avec succès",
                data: result,
            };
        } catch (error) {
            console.error("Error saving visit information:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Show visit information for a specific patient
    async show(request, reply) {
        try {
            const { id } = request.params;

            const visitInformationRecords = await db.select().from(visit_information).where(eq(visit_information.patient_id, id)).limit(1);
            const visitInformation = visitInformationRecords[0];

            if (!visitInformation) {
                reply.code(404);
            return {
                    error: "No visit information found for this patient",
                };
            }

            reply.code(200);
            return visitInformation;
        } catch (error) {
            console.error("Error fetching visit information:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new VisitInformationController();
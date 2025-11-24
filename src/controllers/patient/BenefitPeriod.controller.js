import { db } from "../../config/db.drizzle.js";
import { patients } from "../../db/schemas/patient.schema.js";
import { benefit_periods } from "../../db/schemas/benefitPeriod.schema.js";
import { nursing_clinical_notes } from "../../db/schemas/nursingClinicalNote.schema.js";
import { eq, desc } from "drizzle-orm";

class BenefitPeriodController {
    // Create next benefit period for a patient
    async createNextPeriod(request, reply) {
        try {
            const { patientId } = request.params;

            // Find the patient
            const patientRecords = await db.select().from(patients).where(eq(patients.id, patientId)).limit(1);
            const patient = patientRecords[0];
            
            if (!patient) {
                reply.code(404);
            return {
                    message: "Patient not found",
                };
            }

            // Find the last benefit period for this patient
            const benefitPeriodRecords = await db.select().from(benefit_periods)
                .where(eq(benefit_periods.patient_id, patientId))
                .orderBy(desc(benefit_periods.end_date))
                .limit(1);
            const lastBenefitPeriod = benefitPeriodRecords[0];

            let startDate, periodNumber;

            if (lastBenefitPeriod) {
                // Calculate start date as one day after the last period's end date
                const lastEndDate = new Date(lastBenefitPeriod.end_date);
                startDate = new Date(lastEndDate);
                startDate.setDate(startDate.getDate() + 1);
                periodNumber = lastBenefitPeriod.period_number + 1;
            } else {
                // No previous benefit periods, starting the first one
                startDate = new Date();
                periodNumber = 1;
            }

            // Determine duration based on period number
            const duration = periodNumber === 1 || periodNumber === 2 ? 90 : 60;

            // Calculate end date
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + duration - 1);

            // Create the new benefit period
            const newBenefitPeriod = await db.insert(benefit_periods).values({
                patient_id: patientId,
                start_date: startDate,
                end_date: endDate,
                period_number: periodNumber,
            }).returning();

            reply.code(201);
            return {
                message: "New benefit period created successfully",
                benefit_period: newBenefitPeriod[0],
            };
        } catch (error) {
            console.error("Error creating benefit period:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Add nursing clinical note to a benefit period
    async addNursingClinicalNote(request, reply) {
        try {
            const { benefitPeriodId } = request.params;
            const { note_date, note } = request.body;

            // Find the benefit period
            const benefitPeriodRecords = await db.select().from(benefit_periods).where(eq(benefit_periods.id, benefitPeriodId)).limit(1);
            const benefitPeriod = benefitPeriodRecords[0];
            
            if (!benefitPeriod) {
                reply.code(404);
            return {
                    message: "Benefit period not found",
                };
            }

            // Create the nursing clinical note
            const nursingClinicalNote = await db.insert(nursing_clinical_notes).values({
                benefit_period_id: benefitPeriodId,
                note_date: note_date,
                note: note,
            }).returning();

            reply.code(201);
            return {
                message: "Nursing clinical note added successfully",
                nursing_clinical_note: nursingClinicalNote[0],
            };
        } catch (error) {
            console.error("Error adding nursing clinical note:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get patient chart with benefit periods and nursing clinical notes
    async getPatientChart(request, reply) {
        try {
            const { id } = request.params;

            // Find the patient
            const patientRecords = await db.select().from(patients).where(eq(patients.id, id)).limit(1);
            const patient = patientRecords[0];

            if (!patient) {
                reply.code(404);
            return {
                    message: "Patient not found",
                };
            }

            // Find benefit periods for the patient
            const benefitPeriods = await db.select().from(benefit_periods).where(eq(benefit_periods.patient_id, id));

            // For each benefit period, get associated nursing clinical notes
            const patientWithRelations = {
                ...patient,
                benefitPeriods: await Promise.all(benefitPeriods.map(async (period) => {
                    const notes = await db.select().from(nursing_clinical_notes).where(eq(nursing_clinical_notes.benefit_period_id, period.id));
                    return {
                        ...period,
                        nursingClinicalNotes: notes
                    };
                }))
            };

            return patientWithRelations;
        } catch (error) {
            console.error("Error fetching patient chart:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new BenefitPeriodController();

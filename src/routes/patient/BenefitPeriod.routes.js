import BenefitPeriodController from "../../controllers/patient/BenefitPeriod.controller.js";
import authenticate from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for benefit period routes
async function benefitPeriodRoutes(fastify, options) {
  // Create next benefit period for a patient
  fastify.post(
    "/patient/:patientId/benefit-periods/create-next",
    {
      preHandler: [authenticate],
    },
    BenefitPeriodController.createNextPeriod
  );

  // Add nursing clinical note to a benefit period
  fastify.post(
    "/benefit-periods/:benefitPeriodId/nursing-clinical-notes",
    {
      preHandler: [authenticate],
    },
    BenefitPeriodController.addNursingClinicalNote
  );

  // Get patient chart with benefit periods and nursing clinical notes
  fastify.get(
    "/patients/:id/chart",
    {
      preHandler: [authenticate],
    },
    BenefitPeriodController.getPatientChart
  );
}

export default benefitPeriodRoutes;

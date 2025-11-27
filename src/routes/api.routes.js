import { db } from "../config/db.drizzle.js";
import authRoutes from "./auth.routes.js";
import benefitPeriodRoutes from "./patient/BenefitPeriod.routes.js";
import cardiacAssessmentRoutes from "./patient/CardiacAssessment.routes.js";
import dischargeRoutes from "./patient/Discharge.routes.js";
import endocrineAssessmentRoutes from "./patient/EndocrineAssessment.routes.js";
import hematologicalAssessmentRoutes from "./patient/HematologicalAssessment.routes.js";
import integumentaryAssessmentRoutes from "./patient/IntegumentaryAssessment.routes.js";
import nursingClinicalNoteRoutes from "./patient/NursingClinicalNote.routes.js";
import nutritionRoutes from "./patient/Nutrition.routes.js";
import painRoutes from "./patient/Pain.routes.js";
import painTypeRoutes from "./pain-type.routes.js";
import patientRoutes from "./patient/Patient.routes.js";
import prognosisRoutes from "./patient/Prognosis.routes.js";
import selectRoutes from "./patient/Select.routes.js";
import vitalSignsRoutes from "./patient/VitalSigns.routes.js";
import visitInformationRoutes from "./patient/VisitInformation.routes.js";
import hisPdfRoutes from "./patient/HisPdf.routes.js";
import addressRoutes from "./patient/Address.routes.js";
import admissionInformationRoutes from "./patient/AdmissionInformation.routes.js";
import dmeProviderRoutes from "./patient/DmeProvider.routes.js";
import dnrRoutes from "./patient/Dnr.routes.js";
import emergencyPreparednessLevelRoutes from "./patient/EmergencyPreparednessLevel.routes.js";
import liaisonPrimaryRoutes from "./patient/LiaisonPrimary.routes.js";
import liaisonSecondaryRoutes from "./patient/LiaisonSecondary.routes.js";
import livingArrangementsRoutes from "./patient/LivingArrangements.routes.js";
import patientIdentifiersRoutes from "./patient/PatientIdentifiers.routes.js";
import patientPharmacyRoutes from "./patient/PatientPharmacy.routes.js";
import payerInformationRoutes from "./patient/PayerInformation.routes.js";
import primaryDiagnosisRoutes from "./patient/PrimaryDiagnosis.routes.js";
import raceEthnicityRoutes from "./patient/RaceEthnicity.routes.js";
import signatureRoutes from "./patient/Signature.routes.js";
import spiritualPreferenceRoutes from "./patient/SpiritualPreference.routes.js";
import rbacRoutes from "./rbac.routes.js";
import auditRoutes from "./audit.routes.js";
import abacDemoRoutes from "./abac-demo.routes.js";
import caslDemoRoutes from "./casl-demo.routes.js";
import userRoutes from "./user.routes.js";
import permissionRoutes from "./permission.routes.js";
import { authenticate } from "../middleware/betterAuth.middleware.js";

// Fastify plugin for API routes
async function apiRoutes(fastify, options) {
  // Health check endpoint (public - no authentication required)
  fastify.get("/health", async (request, reply) => {
    try {
      // Test database connection
      await db.execute("SELECT 1");

      return {
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      reply.code(503);
      return {
        status: "unhealthy",
        database: "disconnected",
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  });

  // Public routes
  await fastify.register(authRoutes);

  // Apply authentication middleware to all routes below this point
  fastify.addHook("onRequest", authenticate);

  // Protected routes
  await fastify.register(benefitPeriodRoutes, { prefix: "/benefit-periods" });
  await fastify.register(cardiacAssessmentRoutes, { prefix: "/cardiac-assessment" });
  await fastify.register(dischargeRoutes, { prefix: "/discharge" });
  await fastify.register(endocrineAssessmentRoutes, { prefix: "/endocrine-assessment" });
  await fastify.register(hematologicalAssessmentRoutes, { prefix: "/hematological-assessment" });
  await fastify.register(integumentaryAssessmentRoutes, { prefix: "/integumentary-assessment" });
  await fastify.register(nursingClinicalNoteRoutes, { prefix: "/nursing-clinical-notes" });
  await fastify.register(nutritionRoutes, { prefix: "/nutrition-assessment" });
  await fastify.register(painRoutes, { prefix: "/pain" });
  
  // Register pain-type routes at root level for backward compatibility
  // Frontend calls /api/pain-type/... but routes are at /api/pain/pain-type/...
  // This creates aliases so both paths work
  await fastify.register(painTypeRoutes);
  
  await fastify.register(patientRoutes, { prefix: "/patient" });
  await fastify.register(prognosisRoutes, { prefix: "/prognosis" });
  await fastify.register(selectRoutes, { prefix: "/select" });
  await fastify.register(vitalSignsRoutes, { prefix: "/vital-signs" });
  await fastify.register(visitInformationRoutes, { prefix: "/visit-information" });
  await fastify.register(hisPdfRoutes, { prefix: "/his-pdf" });
  await fastify.register(addressRoutes, { prefix: "/address" });
  await fastify.register(admissionInformationRoutes, { prefix: "/admission-information" });
  await fastify.register(dmeProviderRoutes, { prefix: "/dme-provider" });
  await fastify.register(dnrRoutes, { prefix: "/dnr" });
  await fastify.register(emergencyPreparednessLevelRoutes, { prefix: "/emergency-preparedness-level" });
  await fastify.register(liaisonPrimaryRoutes, { prefix: "/liaison-primary" });
  await fastify.register(liaisonSecondaryRoutes, { prefix: "/liaison-secondary" });
  await fastify.register(livingArrangementsRoutes, { prefix: "/living-arrangements" });
  await fastify.register(patientIdentifiersRoutes, { prefix: "/patient-identifiers" });
  await fastify.register(patientPharmacyRoutes, { prefix: "/patient-pharmacy" });
  await fastify.register(payerInformationRoutes, { prefix: "/payer-information" });
  await fastify.register(primaryDiagnosisRoutes, { prefix: "/primary-diagnosis" });
  await fastify.register(raceEthnicityRoutes, { prefix: "/race-ethnicity" });
  await fastify.register(signatureRoutes, { prefix: "/signature" });
  await fastify.register(spiritualPreferenceRoutes, { prefix: "/spiritual-preference" });
  await fastify.register(rbacRoutes, { prefix: "/rbac" });
  await fastify.register(auditRoutes, { prefix: "/audit" });
  await fastify.register(abacDemoRoutes, { prefix: "/abac-demo" });
  await fastify.register(caslDemoRoutes, { prefix: "/casl-demo" });
  await fastify.register(userRoutes);
  await fastify.register(permissionRoutes);
}

export default apiRoutes;

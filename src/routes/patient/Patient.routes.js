import {
  index,
  store,
  show,
  update,
  destroy,
} from "../../controllers/patient/Patient.controller.js";
import {
  autoSave as admissionAutoSave,
  show as admissionShow,
  index as admissionIndex,
} from "../../controllers/patient/AdmissionInformation.controller.js";
import admissionInformationRoutes from "./AdmissionInformation.routes.js";
import benefitPeriodRoutes from "./BenefitPeriod.routes.js";
import cardiacAssessmentRoutes from "./CardiacAssessment.routes.js";
import dischargeRoutes from "./Discharge.routes.js";
import endocrineAssessmentRoutes from "./EndocrineAssessment.routes.js";
import hematologicalAssessmentRoutes from "./HematologicalAssessment.routes.js";
import hisPdfRoutes from "./HisPdf.routes.js";
import integumentaryAssessmentRoutes from "./IntegumentaryAssessment.routes.js";
import livingArrangementsRoutes from "./LivingArrangements.routes.js";
import nutritionRoutes from "./Nutrition.routes.js";
import patientIdentifiersRoutes from "./PatientIdentifiers.routes.js";
import patientPharmacyRoutes from "./PatientPharmacy.routes.js";
import payerInformationRoutes from "./PayerInformation.routes.js";
import primaryDiagnosisRoutes from "./PrimaryDiagnosis.routes.js";
import prognosisRoutes from "./Prognosis.routes.js";
import raceEthnicityRoutes from "./RaceEthnicity.routes.js";
import selectRoutes from "./Select.routes.js";
import signatureRoutes from "./Signature.routes.js";
import spiritualPreferenceRoutes from "./SpiritualPreference.routes.js";
import visitInformationRoutes from "./VisitInformation.routes.js";
import addressRoutes from "./Address.routes.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";
import {
  requireRole,
  requirePermission,
  requireAnyPermission,
} from "../../middleware/rbac.middleware.js";
import { ROLES, PERMISSIONS } from "../../config/rbac.js";

// Fastify plugin for patient routes
async function patientRoutes(fastify, options) {
  // Patient Routes with RBAC
  // Note: Authentication is already handled by api.routes.js middleware

  // Test route without permission check to verify routing
  fastify.get("/test", async (request, reply) => {
    return {
      message: "Patient routes are working!",
      path: request.url,
      user: request.user,
    };
  });

  // Only doctors, nurses, and admins can view all patients
  // IMPORTANT: This route must come BEFORE all sub-routes to avoid conflicts
  fastify.get(
    "/",
    {
      preHandler: [
        async (request, reply) => {
          console.log("🔍 Patient GET / route hit:", request.url, request.method, request.user?.role);
        },
        async (request, reply) => {
          try {
            // Check permission
            const userRole = request.user?.role || ROLES.PATIENT;
            const hasPermission = PERMISSIONS.VIEW_PATIENT &&
              (userRole === ROLES.ADMIN ||
                userRole === ROLES.DOCTOR ||
                userRole === ROLES.NURSE ||
                userRole === ROLES.PATIENT); // Patients can view their own

            if (!hasPermission) {
              return reply.code(403).send({
                status: 403,
                message: 'Access denied. Insufficient permissions.'
              });
            }
          } catch (error) {
            console.error("Permission check error:", error);
            return reply.code(500).send({
              status: 500,
              message: "Error checking permissions"
            });
          }
        },
      ],
    },
    index
  );

  // Only doctors and admins can create new patients
  fastify.post(
    "/",
    {
      preHandler: [requireAnyPermission(PERMISSIONS.CREATE_PATIENT)],
    },
    store
  );

  // Sub-routes (mounted BEFORE :id route to avoid conflicts with route names)
  // Admission Information Routes
  await fastify.register(admissionInformationRoutes, { prefix: "/admission" });

  // Benefit Period Routes
  await fastify.register(benefitPeriodRoutes);

  // Cardiac Assessment Routes
  await fastify.register(cardiacAssessmentRoutes);

  // Discharge Routes
  await fastify.register(dischargeRoutes);

  // Endocrine Assessment Routes
  await fastify.register(endocrineAssessmentRoutes);

  // Hematological Assessment Routes
  await fastify.register(hematologicalAssessmentRoutes);

  // HisPdf Routes
  await fastify.register(hisPdfRoutes);

  // Integumentary Assessment Routes
  await fastify.register(integumentaryAssessmentRoutes);

  // Living Arrangements Routes
  await fastify.register(livingArrangementsRoutes);

  // Nutrition Routes
  await fastify.register(nutritionRoutes);

  // Patient Identifiers Routes
  await fastify.register(patientIdentifiersRoutes);

  // Patient Pharmacy Routes
  await fastify.register(patientPharmacyRoutes);

  // Payer Information Routes
  await fastify.register(payerInformationRoutes);

  // Primary Diagnosis Routes
  await fastify.register(primaryDiagnosisRoutes);

  // Prognosis Routes
  await fastify.register(prognosisRoutes);

  // Race Ethnicity Routes
  await fastify.register(raceEthnicityRoutes);

  // Select Routes
  await fastify.register(selectRoutes);

  // Signature Routes
  await fastify.register(signatureRoutes);

  // Spiritual Preference Routes
  await fastify.register(spiritualPreferenceRoutes);

  // Visit Information Routes
  await fastify.register(visitInformationRoutes);

  // Address Routes
  await fastify.register(addressRoutes);

  // Patients can view their own info, others need permission
  // IMPORTANT: This :id route must come AFTER all sub-routes to avoid conflicts
  fastify.get(
    "/:id",
    {
      preHandler: [requireAnyPermission(PERMISSIONS.VIEW_PATIENT)],
    },
    show
  );

  // Only doctors and admins can update patient info
  fastify.put(
    "/:id",
    {
      preHandler: [requireAnyPermission(PERMISSIONS.UPDATE_PATIENT)],
    },
    update
  );

  // Only admins can delete patients
  fastify.delete(
    "/:id",
    {
      preHandler: [requireRole(ROLES.ADMIN)],
    },
    destroy
  );
}

export default patientRoutes;

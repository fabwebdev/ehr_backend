import PatientIdentifiersController from "../../controllers/patient/PatientIdentifiers.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for patient identifiers routes
async function patientIdentifiersRoutes(fastify, options) {
  // Patient Identifiers Routes
  fastify.get("/patient-identifiers", {
    preHandler: [verifyToken],
  }, PatientIdentifiersController.index);
  
  fastify.post("/patient-identifiers/store", {
    preHandler: [verifyToken],
  }, PatientIdentifiersController.store);
  
  fastify.get("/patient-identifiers/:id", {
    preHandler: [verifyToken],
  }, PatientIdentifiersController.show);
}

export default patientIdentifiersRoutes;

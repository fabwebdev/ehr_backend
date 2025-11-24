import HematologicalAssessmentController from "../../controllers/patient/HematologicalAssessment.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for hematological assessment routes
async function hematologicalAssessmentRoutes(fastify, options) {
  // Hematological Assessment Routes
  fastify.get(
    "/hematological-assessment",
    {
      preHandler: [verifyToken],
    },
    HematologicalAssessmentController.index
  );
  
  fastify.get(
    "/hematological-list",
    {
      preHandler: [verifyToken],
    },
    HematologicalAssessmentController.hematologicalList
  );
  
  fastify.post(
    "/hematological-assessment/store",
    {
      preHandler: [verifyToken],
    },
    HematologicalAssessmentController.store
  );
  
  fastify.get(
    "/hematological-assessment/:id",
    {
      preHandler: [verifyToken],
    },
    HematologicalAssessmentController.show
  );
}

export default hematologicalAssessmentRoutes;

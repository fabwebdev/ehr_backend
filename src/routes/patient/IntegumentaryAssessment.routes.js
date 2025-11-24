import IntegumentaryAssessmentController from "../../controllers/patient/IntegumentaryAssessment.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for integumentary assessment routes
async function integumentaryAssessmentRoutes(fastify, options) {
  // Integumentary Assessment Routes
  fastify.get(
    "/integumentary-assessment",
    {
      preHandler: [verifyToken],
    },
    IntegumentaryAssessmentController.index
  );
  
  fastify.get(
    "/integumentary-list",
    {
      preHandler: [verifyToken],
    },
    IntegumentaryAssessmentController.integumentaryList
  );
  
  fastify.post(
    "/integumentary-assessment/store",
    {
      preHandler: [verifyToken],
    },
    IntegumentaryAssessmentController.store
  );
  
  fastify.get(
    "/integumentary-assessment/:id",
    {
      preHandler: [verifyToken],
    },
    IntegumentaryAssessmentController.show
  );
}

export default integumentaryAssessmentRoutes;

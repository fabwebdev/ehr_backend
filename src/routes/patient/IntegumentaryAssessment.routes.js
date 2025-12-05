import IntegumentaryAssessmentController from "../../controllers/patient/IntegumentaryAssessment.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for integumentary assessment routes
async function integumentaryAssessmentRoutes(fastify, options) {
  // Integumentary Assessment Routes
  
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
  
  // Parameterized route for getting assessment by patient ID
  fastify.get(
    "/integumentary-assessment/:id",
    {
      preHandler: [
        async (request, reply) => {
          console.log("🔍 Integumentary assessment show route hit:", {
            url: request.url,
            method: request.method,
            params: request.params,
            id: request.params.id,
            fullUrl: request.url
          });
        },
        verifyToken
      ],
    },
    IntegumentaryAssessmentController.show
  );
  
  // Get all integumentary assessments (exact match route)
  fastify.get(
    "/integumentary-assessment",
    {
      preHandler: [verifyToken],
    },
    IntegumentaryAssessmentController.index
  );
}

export default integumentaryAssessmentRoutes;

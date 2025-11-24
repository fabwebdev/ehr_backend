import CardiacAssessmentController from "../../controllers/patient/CardiacAssessment.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for cardiac assessment routes
async function cardiacAssessmentRoutes(fastify, options) {
  // Cardiac Assessment Routes
  fastify.get(
    "/cardiac-assessment",
    {
      preHandler: [verifyToken],
    },
    CardiacAssessmentController.index
  );
  
  fastify.get(
    "/cardiac-list",
    {
      preHandler: [verifyToken],
    },
    CardiacAssessmentController.cardiacList
  );
  
  fastify.post(
    "/cardiac-assessment/store",
    {
      preHandler: [verifyToken],
    },
    CardiacAssessmentController.store
  );
  
  fastify.get(
    "/cardiac-assessment/:id",
    {
      preHandler: [verifyToken],
    },
    CardiacAssessmentController.show
  );
}

export default cardiacAssessmentRoutes;

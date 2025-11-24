import EndocrineAssessmentController from "../../controllers/patient/EndocrineAssessment.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for endocrine assessment routes
async function endocrineAssessmentRoutes(fastify, options) {
  // Endocrine Assessment Routes
  fastify.get(
    "/endocrine-assessment",
    {
      preHandler: [verifyToken],
    },
    EndocrineAssessmentController.index
  );
  
  fastify.get(
    "/endocrine-list",
    {
      preHandler: [verifyToken],
    },
    EndocrineAssessmentController.endocrineList
  );
  
  fastify.post(
    "/endocrine-assessment/store",
    {
      preHandler: [verifyToken],
    },
    EndocrineAssessmentController.store
  );
  
  fastify.get(
    "/endocrine-assessment/:id",
    {
      preHandler: [verifyToken],
    },
    EndocrineAssessmentController.show
  );
}

export default endocrineAssessmentRoutes;

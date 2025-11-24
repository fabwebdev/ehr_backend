import VisitInformationController from "../../controllers/patient/VisitInformation.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for visit information routes
async function visitInformationRoutes(fastify, options) {
  // Visit Information Routes
  fastify.post(
    "/visit-information/store",
    {
      preHandler: [verifyToken],
    },
    VisitInformationController.store
  );
  
  fastify.get(
    "/visit-information/:id",
    {
      preHandler: [verifyToken],
    },
    VisitInformationController.show
  );
}

export default visitInformationRoutes;

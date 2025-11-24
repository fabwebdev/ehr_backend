import PrognosisController from "../../controllers/patient/Prognosis.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for prognosis routes
async function prognosisRoutes(fastify, options) {
  // Prognosis Routes
  fastify.get("/prognosis", {
    preHandler: [verifyToken],
  }, PrognosisController.index);
  
  fastify.post("/prognosis/store", {
    preHandler: [verifyToken],
  }, PrognosisController.store);
  
  fastify.get("/prognosis/:id", {
    preHandler: [verifyToken],
  }, PrognosisController.show);
}

export default prognosisRoutes;

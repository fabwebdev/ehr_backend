import PayerInformationController from "../../controllers/patient/PayerInformation.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for payer information routes
async function payerInformationRoutes(fastify, options) {
  // Payer Information Routes
  fastify.post("/payer-information/store", {
    preHandler: [verifyToken],
  }, PayerInformationController.store);
  
  fastify.get("/payer-information/:id", {
    preHandler: [verifyToken],
  }, PayerInformationController.show);
}

export default payerInformationRoutes;

import * as VitalSignsController from "../../controllers/patient/VitalSigns.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for vital signs routes
async function vitalSignsRoutes(fastify, options) {
  // Vital Signs Routes
  fastify.get("/vital-signs", {
    preHandler: [verifyToken],
  }, VitalSignsController.index);
  
  fastify.post("/vital-signs/store", {
    preHandler: [verifyToken],
  }, VitalSignsController.store);
  
  fastify.get("/vital-signs/:id", {
    preHandler: [verifyToken],
  }, VitalSignsController.show);
}

export default vitalSignsRoutes;

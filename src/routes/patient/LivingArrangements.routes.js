import LivingArrangementsController from "../../controllers/patient/LivingArrangements.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for living arrangements routes
async function livingArrangementsRoutes(fastify, options) {
  // Living Arrangements Routes
  fastify.get("/living-arrangements", {
    preHandler: [verifyToken],
  }, LivingArrangementsController.index);
  
  fastify.post("/living-arrangements/store", {
    preHandler: [verifyToken],
  }, LivingArrangementsController.store);
  
  fastify.get("/living-arrangements/:id", {
    preHandler: [verifyToken],
  }, LivingArrangementsController.show);
}

export default livingArrangementsRoutes;

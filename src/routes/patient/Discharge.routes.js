import DischargeController from "../../controllers/patient/Discharge.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for discharge routes
async function dischargeRoutes(fastify, options) {
  // Discharge Routes
  fastify.get("/discharge", {
    preHandler: [verifyToken],
  }, DischargeController.index);
  
  fastify.get("/discharge-list", {
    preHandler: [verifyToken],
  }, DischargeController.dischargeList);
  
  fastify.post("/discharge/store", {
    preHandler: [verifyToken],
  }, DischargeController.store);
  
  fastify.get("/discharge/:id", {
    preHandler: [verifyToken],
  }, DischargeController.show);
  
  fastify.get("/discharge-sections", {
    preHandler: [verifyToken],
  }, DischargeController.dischargeSections);
}

export default dischargeRoutes;

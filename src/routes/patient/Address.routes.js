import AddressController from "../../controllers/patient/Address.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for address routes
async function addressRoutes(fastify, options) {
  // Address Routes
  fastify.post("/address/store", {
    preHandler: [verifyToken],
  }, AddressController.store);
  
  fastify.get("/address/:id", {
    preHandler: [verifyToken],
  }, AddressController.show);
}

export default addressRoutes;

import SignatureController from "../../controllers/patient/Signature.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for signature routes
async function signatureRoutes(fastify, options) {
  // Signature Routes
  fastify.post("/signature/store", {
    preHandler: [verifyToken],
  }, SignatureController.store);
  
  fastify.get("/signature/:id", {
    preHandler: [verifyToken],
  }, SignatureController.show);
}

export default signatureRoutes;

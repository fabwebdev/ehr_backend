import SignatureController from "../../controllers/patient/Signature.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for signature routes
async function signatureRoutes(fastify, options) {
  // Signature Routes
  // Note: These routes are registered with prefix "/signature" in api.routes.js
  // So "/signature" becomes "/signature/signature", "/signature/:id" becomes "/signature/signature/:id", etc.
  fastify.get("/signature", {
    preHandler: [verifyToken],
  }, SignatureController.index);
  
  fastify.post("/signature/store", {
    preHandler: [verifyToken],
  }, SignatureController.store);
  
  fastify.get("/signature/:id", {
    preHandler: [verifyToken],
  }, SignatureController.show);
}

export default signatureRoutes;

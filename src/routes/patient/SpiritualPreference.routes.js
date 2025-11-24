import SpiritualPreferenceController from "../../controllers/patient/SpiritualPreference.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for spiritual preference routes
async function spiritualPreferenceRoutes(fastify, options) {
  // Spiritual Preference Routes
  fastify.get("/spiritual-preference", {
    preHandler: [verifyToken],
  }, SpiritualPreferenceController.index);
  
  fastify.post("/spiritual-preference/store", {
    preHandler: [verifyToken],
  }, SpiritualPreferenceController.store);
  
  fastify.get("/spiritual-preference/:id", {
    preHandler: [verifyToken],
  }, SpiritualPreferenceController.show);
}

export default spiritualPreferenceRoutes;

import {
    index,
    store,
    show,
    update,
    destroy,
} from "../../controllers/patient/EmergencyPreparednessLevel.controller.js";

// Fastify plugin for emergency preparedness level routes
async function emergencyPreparednessLevelRoutes(fastify, options) {
  // Emergency Preparedness Level Routes
  fastify.get("/emergencyPreparednessLevel", index);
  fastify.post("/emergencyPreparednessLevel/store", store);
  fastify.get("/emergencyPreparednessLevel/:id", show);
  fastify.put("/emergencyPreparednessLevel/:id", update);
  fastify.delete("/emergencyPreparednessLevel/:id", destroy);
}

export default emergencyPreparednessLevelRoutes;

import {
    index,
    store,
    show,
    update,
    destroy,
} from "../../controllers/patient/LiaisonPrimary.controller.js";

// Fastify plugin for liaison primary routes
async function liaisonPrimaryRoutes(fastify, options) {
  // Liaison Primary Routes
  fastify.get("/liaisonPrimary", index);
  fastify.post("/liaisonPrimary/store", store);
  fastify.get("/liaisonPrimary/:id", show);
  fastify.put("/liaisonPrimary/:id", update);
  fastify.delete("/liaisonPrimary/:id", destroy);
}

export default liaisonPrimaryRoutes;

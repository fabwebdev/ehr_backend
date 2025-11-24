import {
    index,
    store,
    show,
    update,
    destroy,
} from "../../controllers/patient/LiaisonSecondary.controller.js";

// Fastify plugin for liaison secondary routes
async function liaisonSecondaryRoutes(fastify, options) {
  // Liaison Secondary Routes
  fastify.get("/liaisonSecondary", index);
  fastify.post("/liaisonSecondary/store", store);
  fastify.get("/liaisonSecondary/:id", show);
  fastify.put("/liaisonSecondary/:id", update);
  fastify.delete("/liaisonSecondary/:id", destroy);
}

export default liaisonSecondaryRoutes;

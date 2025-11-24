import {
    index,
    store,
    show,
    update,
    destroy,
} from "../../controllers/patient/DmeProvider.controller.js";

// Fastify plugin for DME provider routes
async function dmeProviderRoutes(fastify, options) {
  // DME Provider Routes
  fastify.get("/providers", index);
  fastify.post("/providers/store", store);
  fastify.get("/providers/:id", show);
  fastify.put("/providers/update/:id", update);
  fastify.delete("/providers/:id", destroy);
}

export default dmeProviderRoutes;

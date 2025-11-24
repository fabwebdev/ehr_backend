import {
    index,
    store,
    show,
    update,
    destroy,
} from "../../controllers/patient/Dnr.controller.js";

// Fastify plugin for DNR routes
async function dnrRoutes(fastify, options) {
  // DNR Routes
  fastify.get("/dnr", index);
  fastify.post("/dnr/store", store);
  fastify.get("/dnr/:id", show);
  fastify.put("/dnr/:id", update);
  fastify.delete("/dnr/:id", destroy);
}

export default dnrRoutes;

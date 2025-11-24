import {
    index,
    store,
    show,
    update,
    destroy,
} from "../../controllers/patient/RaceEthnicity.controller.js";

// Fastify plugin for race ethnicity routes
async function raceEthnicityRoutes(fastify, options) {
  // Race Ethnicity Routes
  fastify.get("/raceEthnicity", index);
  fastify.post("/raceEthnicity/store", store);
  fastify.get("/raceEthnicity/:id", show);
  fastify.put("/raceEthnicity/:id", update);
  fastify.delete("/raceEthnicity/:id", destroy);
}

export default raceEthnicityRoutes;

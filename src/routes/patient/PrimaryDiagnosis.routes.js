import {
    index,
    store,
    show,
    update,
    destroy,
} from "../../controllers/patient/PrimaryDiagnosis.controller.js";

// Fastify plugin for primary diagnosis routes
async function primaryDiagnosisRoutes(fastify, options) {
  // Primary Diagnosis Routes
  fastify.get("/primaryDiagnosis", index);
  fastify.post("/primaryDiagnosis/store", store);
  fastify.get("/primaryDiagnosis/:id", show);
  fastify.put("/primaryDiagnosis/update/:id", update);
  fastify.delete("/primaryDiagnosis/:id", destroy);
}

export default primaryDiagnosisRoutes;

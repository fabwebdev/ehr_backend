import {
    index,
    show,
    autoSave,
} from "../../controllers/patient/AdmissionInformation.controller.js";

// Fastify plugin for admission information routes
async function admissionInformationRoutes(fastify, options) {
  // Admission Information Routes
  fastify.get("/admission", index);
  fastify.get("/admission/:id", show);
  fastify.post("/admission/store", autoSave);
}

export default admissionInformationRoutes;

import { generatePdf } from "../../controllers/patient/HisPdf.controller.js";

// Fastify plugin for HisPdf routes
async function hisPdfRoutes(fastify, options) {
  // HisPdf Routes
  fastify.get("/generate-his-pdf", generatePdf);
}

export default hisPdfRoutes;

import {
    index,
    store,
    show,
    update,
    destroy,
} from "../../controllers/patient/PatientPharmacy.controller.js";

// Fastify plugin for patient pharmacy routes
async function patientPharmacyRoutes(fastify, options) {
  // Patient Pharmacy Routes
  fastify.get("/patientPharmacy", index);
  fastify.post("/patientPharmacy/store", store);
  fastify.get("/patientPharmacy/:id", show);
  fastify.put("/patientPharmacy/update/:id", update);
  fastify.delete("/patientPharmacy/:id", destroy);
}

export default patientPharmacyRoutes;

import SelectController from "../../controllers/patient/Select.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for select routes
async function selectRoutes(fastify, options) {
  // Select Routes
  fastify.get(
    "/site-of-service-list",
    {
      preHandler: [verifyToken],
    },
    SelectController.siteOfServiceList
  );
  
  fastify.get(
    "/admitted-form-list",
    {
      preHandler: [verifyToken],
    },
    SelectController.admittedFormList
  );
  
  fastify.get(
    "/prognosis-patient-list",
    {
      preHandler: [verifyToken],
    },
    SelectController.prognosisPatientList
  );
  
  fastify.get(
    "/prognosis-imminence",
    {
      preHandler: [verifyToken],
    },
    SelectController.prognosisImminence
  );
  
  fastify.get(
    "/prognosis-caregiver",
    {
      preHandler: [verifyToken],
    },
    SelectController.prognosisCaregiver
  );
  
  fastify.get("/nutrition-template", {
    preHandler: [verifyToken],
  }, SelectController.nutitionTemplate);
  
  fastify.get("/nutrition-problem", {
    preHandler: [verifyToken],
  }, SelectController.nutitionProblem);
}

export default selectRoutes;

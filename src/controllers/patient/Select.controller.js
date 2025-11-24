import { db } from "../../config/db.drizzle.js";
import { 
  admitted_form, 
  site_of_service, 
  prognosis_patient, 
  prognosis_imminence_of_death, 
  prognosis_caregiver, 
  nutrition_template, 
  nutrition_problems_type 
} from "../../db/schemas/index.js";

class SelectController {
    // Get all site of service options
    async siteOfServiceList(request, reply) {
        try {
            const siteOfService = await db.select().from(site_of_service);
            reply.code(200);
            return siteOfService;
        } catch (error) {
            console.error("Error fetching site of service list:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get all admitted form options
    async admittedFormList(request, reply) {
        try {
            const admittedForm = await db.select().from(admitted_form);
            reply.code(200);
            return admittedForm;
        } catch (error) {
            console.error("Error fetching admitted form list:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get all prognosis patient options
    async prognosisPatientList(request, reply) {
        try {
            const prognosisPatient = await db.select().from(prognosis_patient);
            reply.code(200);
            return prognosisPatient;
        } catch (error) {
            console.error("Error fetching prognosis patient list:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get all prognosis imminence options
    async prognosisImminence(request, reply) {
        try {
            const prognosisImminence = await db.select().from(prognosis_imminence_of_death);
            reply.code(200);
            return prognosisImminence;
        } catch (error) {
            console.error("Error fetching prognosis imminence list:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get all prognosis caregiver options
    async prognosisCaregiver(request, reply) {
        try {
            const prognosisCaregiver = await db.select().from(prognosis_caregiver);
            reply.code(200);
            return prognosisCaregiver;
        } catch (error) {
            console.error("Error fetching prognosis caregiver list:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get all nutrition template options
    async nutitionTemplate(request, reply) {
        try {
            const nutritionTemplate = await db.select().from(nutrition_template);
            reply.code(200);
            return nutritionTemplate;
        } catch (error) {
            console.error("Error fetching nutrition template list:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    // Get all nutrition problem options
    async nutitionProblem(request, reply) {
        try {
            const nutritionProblemsType = await db.select().from(nutrition_problems_type);
            reply.code(200);
            return nutritionProblemsType;
        } catch (error) {
            console.error("Error fetching nutrition problem list:", error);
            reply.code(500);
            return {
                message: "Internal server error",
                error: error.message,
            };
        }
    }
}

export default new SelectController();
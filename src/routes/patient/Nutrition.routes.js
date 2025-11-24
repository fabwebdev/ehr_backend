import NutritionController from "../../controllers/patient/Nutrition.controller.js";
import { verifyToken } from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for nutrition routes
async function nutritionRoutes(fastify, options) {
  // Nutrition Routes
  fastify.get("/nutrition/problems-types", {
    preHandler: [verifyToken],
  }, NutritionController.nutritionProblemsTypes);
  
  fastify.get("/nutrition/:id", {
    preHandler: [verifyToken],
  }, NutritionController.nutritionAssessmentShow);
  
  fastify.post("/nutrition/:id/auto-save", {
    preHandler: [verifyToken],
  }, NutritionController.nutritionAssessmentAutoSave);
}

export default nutritionRoutes;

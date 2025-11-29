import * as NursingClinicalNoteController from "../../controllers/patient/NursingClinicalNote.controller.js";
import authenticate from "../../middleware/betterAuth.middleware.js";

// Fastify plugin for nursing clinical note routes
async function nursingClinicalNoteRoutes(fastify, options) {
  // Nursing Clinical Note Routes (clean path)
  fastify.get(
    "/:id",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.show
  );

  fastify.put(
    "/:id",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.update
  );

  fastify.post(
    "/:id",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.store
  );

  // Backward compatibility: support double path for existing frontend
  fastify.get(
    "/nursing-clinical-notes/:id",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.show
  );

  fastify.put(
    "/nursing-clinical-notes/:id",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.update
  );

  fastify.post(
    "/nursing-clinical-notes/:id",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.store
  );

  // Vital signs routes
  fastify.get(
    "/vital_signs/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.getVitalSigns
  );

  fastify.post(
    "/vital_signs/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.autoSaveVitalSigns
  );

  // Scales, tools, and lab data routes
  fastify.get(
    "/scales_tools_lab_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.indexScaleToolLabData
  );

  fastify.post(
    "/scales_tools_lab_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.autoSaveScaleToolLabData
  );

  // Pain data routes
  fastify.get(
    "/pain_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.indexPainData
  );

  fastify.post(
    "/pain_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.autoSavePainData
  );

  // Painad data routes
  fastify.get(
    "/painad_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.indexPainadData
  );

  fastify.post(
    "/painad_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.autoSavePainadData
  );

  // Flacc data routes
  fastify.get(
    "/flacc_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.indexFlaccData
  );

  fastify.post(
    "/flacc_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.autoSaveFlaccData
  );

  // Cardiovascular data routes
  fastify.get(
    "/cardiovascular_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.indexCardiovascularData
  );

  fastify.post(
    "/cardiovascular_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.autoSaveCardiovascularData
  );

  // Respiratory data routes
  fastify.get(
    "/respiratory_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.indexRespiratoryData
  );

  fastify.post(
    "/respiratory_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.autoSaveRespiratoryData
  );

  // Genitourinary data routes
  fastify.get(
    "/genitourinary_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.indexGenitourinaryData
  );

  fastify.post(
    "/genitourinary_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.autoSaveGenitourinaryData
  );

  // Gastrointestinal data routes
  fastify.get(
    "/gastrointestinal_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.indexGastrointestinalData
  );

  fastify.post(
    "/gastrointestinal_data/:noteId",
    {
      preHandler: [authenticate],
    },
    NursingClinicalNoteController.autoSaveGastrointestinalData
  );
}

export default nursingClinicalNoteRoutes;

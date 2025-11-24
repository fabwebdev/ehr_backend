import Prognosis from "../models/Prognosis.model.js";
// Note: express-validator replaced with Fastify schema validation

// Get all prognosis records
export const getAllPrognosis = async (request, reply) => {
  try {
    const prognosis = await Prognosis.findAll();
    return prognosis;
  } catch (error) {
    console.error("Error fetching prognosis:", error);
    reply.code(500);
    return {
      status: 500,
      message: "Server error while fetching prognosis",
    };
  }
};

// Create or update prognosis record
export const createPrognosis = async (request, reply) => {
  try {
    // Note: Validation should be done in route definition using Fastify schema
    const validatedData = request.body;

    // Check if prognosis already exists for this patient
    let prognosis = await Prognosis.findOne({
      where: { patient_id: validatedData.patient_id },
    });

    if (prognosis) {
      // Update existing prognosis
      const updateData = {
        prognosis_patient_is_imminent:
          validatedData.prognosis_patient_is_imminent,
      };

      // Add non-empty fields
      if (validatedData.prognosis_patient_id) {
        updateData.prognosis_patient_id = Array.isArray(
          validatedData.prognosis_patient_id
        )
          ? validatedData.prognosis_patient_id.join(",")
          : validatedData.prognosis_patient_id;
      }

      if (validatedData.prognosis_caregiver_id) {
        updateData.prognosis_caregiver_id = Array.isArray(
          validatedData.prognosis_caregiver_id
        )
          ? validatedData.prognosis_caregiver_id.join(",")
          : validatedData.prognosis_caregiver_id;
      }

      if (validatedData.prognosis_imminence_id) {
        updateData.prognosis_imminence_id = Array.isArray(
          validatedData.prognosis_imminence_id
        )
          ? validatedData.prognosis_imminence_id.join(",")
          : validatedData.prognosis_imminence_id;
      }

      await prognosis.update(updateData);
    } else {
      // Create new prognosis
      const createData = {
        patient_id: validatedData.patient_id,
        prognosis_patient_is_imminent:
          validatedData.prognosis_patient_is_imminent,
      };

      // Add non-empty fields
      if (validatedData.prognosis_patient_id) {
        createData.prognosis_patient_id = Array.isArray(
          validatedData.prognosis_patient_id
        )
          ? validatedData.prognosis_patient_id.join(",")
          : validatedData.prognosis_patient_id;
      }

      if (validatedData.prognosis_caregiver_id) {
        createData.prognosis_caregiver_id = Array.isArray(
          validatedData.prognosis_caregiver_id
        )
          ? validatedData.prognosis_caregiver_id.join(",")
          : validatedData.prognosis_caregiver_id;
      }

      if (validatedData.prognosis_imminence_id) {
        createData.prognosis_imminence_id = Array.isArray(
          validatedData.prognosis_imminence_id
        )
          ? validatedData.prognosis_imminence_id.join(",")
          : validatedData.prognosis_imminence_id;
      }

      prognosis = await Prognosis.create(createData);
    }

    reply.code(201);
    return {
      message: "Prognosis created or updated successfully.",
      data: prognosis,
    };
  } catch (error) {
    console.error("Error creating/updating prognosis:", error);
    reply.code(500);
    return {
      status: 500,
      message: "Server error while creating/updating prognosis",
    };
  }
};

// Get prognosis by patient ID
export const getPrognosisByPatientId = async (request, reply) => {
  try {
    const { id } = request.params;

    const prognosis = await Prognosis.findOne({
      where: { patient_id: id },
    });

    if (!prognosis) {
      reply.code(404);
      return {
        status: 404,
        message: "No prognosis found for this patient",
      };
    }

    return prognosis;
  } catch (error) {
    console.error("Error fetching prognosis:", error);
    reply.code(500);
    return {
      status: 500,
      message: "Server error while fetching prognosis",
    };
  }
};

// Validation rules
// Note: In Fastify, validation should be done using schema in route definitions
export const prognosisValidation = async (request, reply) => {
  // Basic validation - should be done in route schema
  // This is kept for compatibility
};

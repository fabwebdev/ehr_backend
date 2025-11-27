// Note: express-validator replaced with Fastify schema validation
import { db } from "../../../config/db.drizzle.js";
import {
  pain_assessments,
  pain_rated_by,
  pain_duration,
  pain_frequency,
  pain_worsened_by,
  pain_character,
  pain_relieved_by,
  pain_effects_on_function,
  pain_breakthrough,
  type_of_pain_rating_scale_used,
  pain_observations,
  pain_vital_signs,
  pain_scales_tools_lab_data_reviews,
  pain_assessment_in_dementia_scale,
  flacc_behavioral_pain,
  pain_screening,
  pain_summary_interventions_goals,
  comprehensive_pain_assessment,
  pain_active_problem,
} from "../../../db/schemas/index.js";
import { eq, and } from "drizzle-orm";
import { logAudit } from "../../../middleware/audit.middleware.js";

// Index - get all pain assessments
export const index = async (request, reply) => {
  try {
    const painAssessments = await db.select().from(pain_assessments);
    reply.code(200);
    return {
      message: "Pain assessments retrieved successfully",
      data: painAssessments,
    };
  } catch (error) {
    console.error("Error in index:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Show - get pain assessment by patient ID
export const show = async (request, reply) => {
  try {
    const { id } = request.params;
    const painAssessmentResult = await db
      .select()
      .from(pain_assessments)
      .where(eq(pain_assessments.patient_id, parseInt(id)))
      .limit(1);
    const painAssessment = painAssessmentResult[0];

    if (!painAssessment) {
      reply.code(404);
      return { error: "No pain assessment found for this patient" };
    }

    reply.code(200);
    return painAssessment;
  } catch (error) {
    console.error("Error in show:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Level Severity Store
export const painLevelSeveritystore = async (request, reply) => {
  try {
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const {
      patient_id,
      pain_level_now,
      acceptable_level_of_pain,
      worst_pain_level,
      primary_pain_site,
    } = request.body;

    // Check if patient already has a pain assessment
    const existingAssessment = await db
      .select()
      .from(pain_assessments)
      .where(eq(pain_assessments.patient_id, parseInt(patient_id)))
      .limit(1);
    const painAssessment = existingAssessment[0];

    let result;
    let action;
    const now = new Date();
    if (painAssessment) {
      // Update existing record
      const updatedAssessment = await db
        .update(pain_assessments)
        .set({
          pain_level_now,
          acceptable_level_of_pain,
          worst_pain_level,
          primary_pain_site,
          updatedAt: now,
        })
        .where(eq(pain_assessments.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedAssessment[0];
      action = "UPDATE";
    } else {
      // Create new record
      const newAssessment = await db
        .insert(pain_assessments)
        .values({
          patient_id: parseInt(patient_id),
          pain_level_now,
          acceptable_level_of_pain,
          worst_pain_level,
          primary_pain_site,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newAssessment[0];
      action = "CREATE";
    }

    await logAudit(request, action, "pain_assessments", result.id);

    reply.code(201);
    return {
      message: "Pain assessment created successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painLevelSeveritystore:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Rated By Store
export const painRatedByStore = async (request, reply) => {
  try {
    const { patient_id, pain_rated_by_id } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (Number.isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a number" }],
      };
    }

    const normalizedRatedBy = (() => {
      if (pain_rated_by_id === undefined || pain_rated_by_id === null) {
        return null;
      }
      if (Array.isArray(pain_rated_by_id)) {
        return pain_rated_by_id.length > 0 ? String(pain_rated_by_id[0]) : null;
      }
      return String(pain_rated_by_id);
    })();

    const existingRatedBy = await db
      .select()
      .from(pain_rated_by)
      .where(eq(pain_rated_by.patient_id, patientIdNum))
      .limit(1);
    const painRatedBy = existingRatedBy[0];

    const now = new Date();
    let result;
    if (painRatedBy) {
      const updatedRatedBy = await db
        .update(pain_rated_by)
        .set({
          pain_rated_by_id: normalizedRatedBy,
          updatedAt: now,
        })
        .where(eq(pain_rated_by.patient_id, patientIdNum))
        .returning();
      result = updatedRatedBy[0];
    } else {
      const newRatedBy = await db
        .insert(pain_rated_by)
        .values({
          patient_id: patientIdNum,
          pain_rated_by_id: normalizedRatedBy,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newRatedBy[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "painRatedBy created or updated successfully.",
      data: result,
    };
  } catch (error) {
    console.error("Error in painRatedByStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Rated By By ID
export const painRatedById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painRatedByResult = await db
      .select()
      .from(pain_rated_by)
      .where(eq(pain_rated_by.patient_id, parseInt(id)))
      .limit(1);
    const painRatedBy = painRatedByResult[0];

    if (!painRatedBy) {
      reply.code(404);
      return { error: "No painRatedBy found for this painRatedBy" };
    }

    reply.code(200);
    return painRatedBy;
  } catch (error) {
    console.error("Error in painRatedById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Duration Store
export const painDurationStore = async (request, reply) => {
  try {
    const { patient_id, pain_duration_id, createdAt, updatedAt, id } =
      request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (Number.isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a number" }],
      };
    }

    const normalizedDuration = (() => {
      if (pain_duration_id === undefined || pain_duration_id === null) {
        return null;
      }
      if (Array.isArray(pain_duration_id)) {
        return pain_duration_id.length > 0 ? String(pain_duration_id[0]) : null;
      }
      return String(pain_duration_id);
    })();

    const existingDuration = await db
      .select()
      .from(pain_duration)
      .where(eq(pain_duration.patient_id, patientIdNum))
      .limit(1);
    const painDuration = existingDuration[0];

    const now = new Date();
    let result;
    if (painDuration) {
      const updatedDuration = await db
        .update(pain_duration)
        .set({
          pain_duration_id: normalizedDuration,
          updatedAt: now,
        })
        .where(eq(pain_duration.patient_id, patientIdNum))
        .returning();
      result = updatedDuration[0];
    } else {
      const newDuration = await db
        .insert(pain_duration)
        .values({
          patient_id: patientIdNum,
          pain_duration_id: normalizedDuration,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newDuration[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain duration saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painDurationStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Duration By ID
export const painDurationById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painDurationResult = await db
      .select()
      .from(pain_duration)
      .where(eq(pain_duration.patient_id, parseInt(id)))
      .limit(1);
    const painDuration = painDurationResult[0];

    if (!painDuration) {
      reply.code(404);
      return { error: "No painDuration found for this painDuration" };
    }

    reply.code(200);
    return painDuration;
  } catch (error) {
    console.error("Error in painDurationById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Frequency Store
export const painFrequencyStore = async (request, reply) => {
  try {
    const { patient_id, pain_frequency_id } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (Number.isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a number" }],
      };
    }

    const normalizedFrequency = (() => {
      if (pain_frequency_id === undefined || pain_frequency_id === null) {
        return null;
      }
      if (Array.isArray(pain_frequency_id)) {
        return pain_frequency_id.length > 0 ? String(pain_frequency_id[0]) : null;
      }
      return String(pain_frequency_id);
    })();

    const existingFrequency = await db
      .select()
      .from(pain_frequency)
      .where(eq(pain_frequency.patient_id, patientIdNum))
      .limit(1);
    const painFrequency = existingFrequency[0];

    const now = new Date();
    let result;
    if (painFrequency) {
      const updatedFrequency = await db
        .update(pain_frequency)
        .set({
          pain_frequency_id: normalizedFrequency,
          updatedAt: now,
        })
        .where(eq(pain_frequency.patient_id, patientIdNum))
        .returning();
      result = updatedFrequency[0];
    } else {
      const newFrequency = await db
        .insert(pain_frequency)
        .values({
          patient_id: patientIdNum,
          pain_frequency_id: normalizedFrequency,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newFrequency[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain frequency saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painFrequencyStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Frequency By ID
export const painFrequencyById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painFrequencyResult = await db
      .select()
      .from(pain_frequency)
      .where(eq(pain_frequency.patient_id, parseInt(id)))
      .limit(1);
    const painFrequency = painFrequencyResult[0];

    if (!painFrequency) {
      reply.code(404);
      return {
        error: "No painFrequency found for this painFrequency",
      };
    }

    reply.code(200);
    return painFrequency;
  } catch (error) {
    console.error("Error in painFrequencyById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Observation Store
export const painObservationStore = async (request, reply) => {
  try {
    const { patient_id, pain_observations_id } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (Number.isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a number" }],
      };
    }

    const normalizedObservation = (() => {
      if (pain_observations_id === undefined || pain_observations_id === null) {
        return null;
      }
      if (Array.isArray(pain_observations_id)) {
        return pain_observations_id.length > 0
          ? String(pain_observations_id[0])
          : null;
      }
      return String(pain_observations_id);
    })();

    const existingObservation = await db
      .select()
      .from(pain_observations)
      .where(eq(pain_observations.patient_id, patientIdNum))
      .limit(1);
    const painObservation = existingObservation[0];

    const now = new Date();
    let result;
    if (painObservation) {
      const updatedObservation = await db
        .update(pain_observations)
        .set({
          pain_observations_id: normalizedObservation,
          updatedAt: now,
        })
        .where(eq(pain_observations.patient_id, patientIdNum))
        .returning();
      result = updatedObservation[0];
    } else {
      const newObservation = await db
        .insert(pain_observations)
        .values({
          patient_id: patientIdNum,
          pain_observations_id: normalizedObservation,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newObservation[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain observation saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painObservationStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Observation By ID
export const painObservationById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painObservationResult = await db
      .select()
      .from(pain_observations)
      .where(eq(pain_observations.patient_id, parseInt(id)))
      .limit(1);
    const painObservation = painObservationResult[0];

    if (!painObservation) {
      reply.code(404);
      return {
        error: "No painObservation found for this painObservation",
      };
    }

    reply.code(200);
    return painObservation;
  } catch (error) {
    console.error("Error in painObservationById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Worsened By Store
export const painWorsenedByStore = async (request, reply) => {
  try {
    const { patient_id, pain_worsened_by_id } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (Number.isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a number" }],
      };
    }

    const normalizedWorsenedBy = (() => {
      if (pain_worsened_by_id === undefined || pain_worsened_by_id === null) {
        return null;
      }
      if (Array.isArray(pain_worsened_by_id)) {
        return pain_worsened_by_id.length > 0
          ? String(pain_worsened_by_id[0])
          : null;
      }
      return String(pain_worsened_by_id);
    })();

    const existingWorsenedBy = await db
      .select()
      .from(pain_worsened_by)
      .where(eq(pain_worsened_by.patient_id, patientIdNum))
      .limit(1);
    const painWorsenedBy = existingWorsenedBy[0];

    const now = new Date();
    let result;
    if (painWorsenedBy) {
      const updatedWorsenedBy = await db
        .update(pain_worsened_by)
        .set({
          pain_worsened_by_id: normalizedWorsenedBy,
          updatedAt: now,
        })
        .where(eq(pain_worsened_by.patient_id, patientIdNum))
        .returning();
      result = updatedWorsenedBy[0];
    } else {
      const newWorsenedBy = await db
        .insert(pain_worsened_by)
        .values({
          patient_id: patientIdNum,
          pain_worsened_by_id: normalizedWorsenedBy,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newWorsenedBy[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain worsened-by saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painWorsenedByStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Worsened By By ID
export const painWorsenedById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painWorsenedByResult = await db
      .select()
      .from(pain_worsened_by)
      .where(eq(pain_worsened_by.patient_id, parseInt(id)))
      .limit(1);
    const painWorsenedBy = painWorsenedByResult[0];

    if (!painWorsenedBy) {
      reply.code(404);
      return {
        error: "No painWorsenedBy found for this painWorsenedBy",
      };
    }

    reply.code(200);
    return painWorsenedBy;
  } catch (error) {
    console.error("Error in painWorsenedById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Character Store
export const painCharacterStore = async (request, reply) => {
  try {
    const { patient_id, pain_character_id } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (Number.isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a number" }],
      };
    }

    const normalizedCharacter = (() => {
      if (pain_character_id === undefined || pain_character_id === null) {
        return null;
      }
      if (Array.isArray(pain_character_id)) {
        return pain_character_id.length > 0 ? String(pain_character_id[0]) : null;
      }
      return String(pain_character_id);
    })();

    const existingCharacter = await db
      .select()
      .from(pain_character)
      .where(eq(pain_character.patient_id, patientIdNum))
      .limit(1);
    const painCharacter = existingCharacter[0];

    const now = new Date();
    let result;
    if (painCharacter) {
      const updatedCharacter = await db
        .update(pain_character)
        .set({
          pain_character_id: normalizedCharacter,
          updatedAt: now,
        })
        .where(eq(pain_character.patient_id, patientIdNum))
        .returning();
      result = updatedCharacter[0];
    } else {
      const newCharacter = await db
        .insert(pain_character)
        .values({
          patient_id: patientIdNum,
          pain_character_id: normalizedCharacter,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newCharacter[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain character saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painCharacterStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Character By ID
export const painCharacterById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painCharacterResult = await db
      .select()
      .from(pain_character)
      .where(eq(pain_character.patient_id, parseInt(id)))
      .limit(1);
    const painCharacter = painCharacterResult[0];

    if (!painCharacter) {
      reply.code(404);
      return {
        error: "No painCharacter found for this painCharacter",
      };
    }

    reply.code(200);
    return painCharacter;
  } catch (error) {
    console.error("Error in painCharacterById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Relieved By Store
export const painRelievedByStore = async (request, reply) => {
  try {
    const { patient_id, pain_relieved_by_id } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (Number.isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a number" }],
      };
    }

    const normalizedRelievedBy = (() => {
      if (pain_relieved_by_id === undefined || pain_relieved_by_id === null) {
        return null;
      }
      if (Array.isArray(pain_relieved_by_id)) {
        return pain_relieved_by_id.length > 0
          ? String(pain_relieved_by_id[0])
          : null;
      }
      return String(pain_relieved_by_id);
    })();

    const existingRelievedBy = await db
      .select()
      .from(pain_relieved_by)
      .where(eq(pain_relieved_by.patient_id, patientIdNum))
      .limit(1);
    const painRelievedBy = existingRelievedBy[0];

    const now = new Date();
    let result;
    if (painRelievedBy) {
      const updatedRelievedBy = await db
        .update(pain_relieved_by)
        .set({
          pain_relieved_by_id: normalizedRelievedBy,
          updatedAt: now,
        })
        .where(eq(pain_relieved_by.patient_id, patientIdNum))
        .returning();
      result = updatedRelievedBy[0];
    } else {
      const newRelievedBy = await db
        .insert(pain_relieved_by)
        .values({
          patient_id: patientIdNum,
          pain_relieved_by_id: normalizedRelievedBy,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newRelievedBy[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain relieved-by saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painRelievedByStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Relieved By By ID
export const painRelievedById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painRelievedByResult = await db
      .select()
      .from(pain_relieved_by)
      .where(eq(pain_relieved_by.patient_id, parseInt(id)))
      .limit(1);
    const painRelievedBy = painRelievedByResult[0];

    if (!painRelievedBy) {
      reply.code(404);
      return {
        error: "No painRelievedBy found for this painRelievedBy",
      };
    }

    reply.code(200);
    return painRelievedBy;
  } catch (error) {
    console.error("Error in painRelievedById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Effects On Function Store
export const painEffectsOnFunctionStore = async (request, reply) => {
  try {
    const { patient_id, pain_effects_on_function_id } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (Number.isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a number" }],
      };
    }

    const normalizedEffect = (() => {
      if (
        pain_effects_on_function_id === undefined ||
        pain_effects_on_function_id === null
      ) {
        return null;
      }
      if (Array.isArray(pain_effects_on_function_id)) {
        return pain_effects_on_function_id.length > 0
          ? String(pain_effects_on_function_id[0])
          : null;
      }
      return String(pain_effects_on_function_id);
    })();

    const existingEffectsOnFunction = await db
      .select()
      .from(pain_effects_on_function)
      .where(eq(pain_effects_on_function.patient_id, patientIdNum))
      .limit(1);
    const painEffectsOnFunction = existingEffectsOnFunction[0];

    const now = new Date();
    let result;
    if (painEffectsOnFunction) {
      const updatedEffectsOnFunction = await db
        .update(pain_effects_on_function)
        .set({
          pain_effects_on_function_id: normalizedEffect,
          updatedAt: now,
        })
        .where(eq(pain_effects_on_function.patient_id, patientIdNum))
        .returning();
      result = updatedEffectsOnFunction[0];
    } else {
      const newEffectsOnFunction = await db
        .insert(pain_effects_on_function)
        .values({
          patient_id: patientIdNum,
          pain_effects_on_function_id: normalizedEffect,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newEffectsOnFunction[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain effects on function saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painEffectsOnFunctionStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Effects On Function By ID
export const painEffectsOnFunctionById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painEffectsOnFunctionResult = await db
      .select()
      .from(pain_effects_on_function)
      .where(eq(pain_effects_on_function.patient_id, parseInt(id)))
      .limit(1);
    const painEffectsOnFunction = painEffectsOnFunctionResult[0];

    if (!painEffectsOnFunction) {
      reply.code(404);
      return {
        error: "No painEffectsOnFunction found for this painEffectsOnFunction",
      };
    }

    reply.code(200);
    return painEffectsOnFunction;
  } catch (error) {
    console.error("Error in painEffectsOnFunctionById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Breakthrough Store
export const painBreakthroughStore = async (request, reply) => {
  try {
    const { patient_id, pain_breakthrough_id } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (Number.isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a number" }],
      };
    }

    const normalizedBreakthrough = (() => {
      if (pain_breakthrough_id === undefined || pain_breakthrough_id === null) {
        return null;
      }
      if (Array.isArray(pain_breakthrough_id)) {
        return pain_breakthrough_id.length > 0
          ? String(pain_breakthrough_id[0])
          : null;
      }
      return String(pain_breakthrough_id);
    })();

    const existingBreakthrough = await db
      .select()
      .from(pain_breakthrough)
      .where(eq(pain_breakthrough.patient_id, patientIdNum))
      .limit(1);
    const painBreakthrough = existingBreakthrough[0];

    const now = new Date();
    let result;
    if (painBreakthrough) {
      const updatedBreakthrough = await db
        .update(pain_breakthrough)
        .set({
          pain_breakthrough_id: normalizedBreakthrough,
          updatedAt: now,
        })
        .where(eq(pain_breakthrough.patient_id, patientIdNum))
        .returning();
      result = updatedBreakthrough[0];
    } else {
      const newBreakthrough = await db
        .insert(pain_breakthrough)
        .values({
          patient_id: patientIdNum,
          pain_breakthrough_id: normalizedBreakthrough,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newBreakthrough[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain breakthrough saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painBreakthroughStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Breakthrough By ID
export const painBreakthroughById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painBreakthroughResult = await db
      .select()
      .from(pain_breakthrough)
      .where(eq(pain_breakthrough.patient_id, parseInt(id)))
      .limit(1);
    const painBreakthrough = painBreakthroughResult[0];

    if (!painBreakthrough) {
      reply.code(404);
      return {
        error: "No painBreakthrough found for this painBreakthrough",
      };
    }

    reply.code(200);
    return painBreakthrough;
  } catch (error) {
    console.error("Error in painBreakthroughById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Type Of Pain Rating Scale Used Store
export const typeOfPainRatingScaleUsedStore = async (request, reply) => {
  try {
    const { patient_id, type_of_pain_rating_scale_used_id } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (Number.isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a number" }],
      };
    }

    const normalizedType = (() => {
      if (
        type_of_pain_rating_scale_used_id === undefined ||
        type_of_pain_rating_scale_used_id === null
      ) {
        return null;
      }
      if (Array.isArray(type_of_pain_rating_scale_used_id)) {
        return type_of_pain_rating_scale_used_id.length > 0
          ? String(type_of_pain_rating_scale_used_id[0])
          : null;
      }
      return String(type_of_pain_rating_scale_used_id);
    })();

    const existingType = await db
      .select()
      .from(type_of_pain_rating_scale_used)
      .where(eq(type_of_pain_rating_scale_used.patient_id, patientIdNum))
      .limit(1);
    const typeOfPainRatingScaleUsed = existingType[0];

    const now = new Date();
    let result;
    if (typeOfPainRatingScaleUsed) {
      const updatedType = await db
        .update(type_of_pain_rating_scale_used)
        .set({
          type_of_pain_rating_scale_used_id: normalizedType,
          updatedAt: now,
        })
        .where(eq(type_of_pain_rating_scale_used.patient_id, patientIdNum))
        .returning();
      result = updatedType[0];
    } else {
      const newType = await db
        .insert(type_of_pain_rating_scale_used)
        .values({
          patient_id: patientIdNum,
          type_of_pain_rating_scale_used_id: normalizedType,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newType[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain rating scale saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in typeOfPainRatingScaleUsedStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Type Of Pain Rating Scale Used By ID
export const typeOfPainRatingScaleUsedById = async (request, reply) => {
  try {
    const { id } = request.params;
    const typeOfPainRatingScaleUsedResult = await db
      .select()
      .from(type_of_pain_rating_scale_used)
      .where(eq(type_of_pain_rating_scale_used.patient_id, parseInt(id)))
      .limit(1);
    const typeOfPainRatingScaleUsed = typeOfPainRatingScaleUsedResult[0];

    if (!typeOfPainRatingScaleUsed) {
      reply.code(404);
      return {
        error:
          "No typeOfPainRatingScaleUsed found for this typeOfPainRatingScaleUsed",
      };
    }

    reply.code(200);
    return typeOfPainRatingScaleUsed;
  } catch (error) {
    console.error("Error in typeOfPainRatingScaleUsedById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Vital Signs Store
export const painVitalSignsStore = async (request, reply) => {
  try {
    const { patient_id, id, createdAt, updatedAt, ...validatedData } = request.body;

    // Validate patient_id is provided
    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    // Validate patient_id is a valid number
    const patientIdNum = parseInt(patient_id);
    if (isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a valid number" }],
      };
    }

    // Check if patient already has pain vital signs
    const existingVitalSigns = await db
      .select()
      .from(pain_vital_signs)
      .where(eq(pain_vital_signs.patient_id, patientIdNum))
      .limit(1);
    const painVitalSigns = existingVitalSigns[0];

    if (painVitalSigns) {
      // Update existing record
      // Remove any timestamp fields that might be strings
      const updateData = { ...validatedData };
      delete updateData.createdAt;
      delete updateData.updatedAt;
      
      const updatedVitalSigns = await db
        .update(pain_vital_signs)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(pain_vital_signs.patient_id, patientIdNum))
        .returning();
      reply.code(200);
      return {
        status: 200,
        message: "Pain vital signs updated successfully",
        data: updatedVitalSigns[0],
      };
    } else {
      // Create new record
      // Remove any timestamp fields that might be strings
      const insertData = { ...validatedData };
      delete insertData.createdAt;
      delete insertData.updatedAt;
      
      const newVitalSigns = await db
        .insert(pain_vital_signs)
        .values({
          patient_id: patientIdNum,
          ...insertData,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      reply.code(201);
      return {
        status: 201,
        message: "Pain vital signs created successfully",
        data: newVitalSigns[0],
      };
    }
  } catch (error) {
    console.error("Error in painVitalSignsStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Vital Signs By ID
export const painVitalSignsById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painVitalSignsResult = await db
      .select()
      .from(pain_vital_signs)
      .where(eq(pain_vital_signs.patient_id, parseInt(id)))
      .limit(1);
    const painVitalSigns = painVitalSignsResult[0];

    if (!painVitalSigns) {
      reply.code(404);
      return { error: "No pain vital signs found for this patient" };
    }

    reply.code(200);
    return painVitalSigns;
  } catch (error) {
    console.error("Error in painVitalSignsById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Scales Tools Lab Data Reviews Store
export const painScalesToolsLabDataReviewsStore = async (request, reply) => {
  try {
    const { patient_id, id, createdAt, updatedAt, ...validatedData } = request.body;

    // Validate patient_id is provided
    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    // Validate patient_id is a valid number
    const patientIdNum = parseInt(patient_id);
    if (isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a valid number" }],
      };
    }

    const existingReviews = await db
      .select()
      .from(pain_scales_tools_lab_data_reviews)
      .where(
        eq(pain_scales_tools_lab_data_reviews.patient_id, patientIdNum)
      )
      .limit(1);
    const painScalesToolsLabDataReviews = existingReviews[0];

    let result;
    if (painScalesToolsLabDataReviews) {
      // Update existing record
      // Remove any timestamp fields that might be strings
      const updateData = { ...validatedData };
      delete updateData.createdAt;
      delete updateData.updatedAt;
      
      const updatedReviews = await db
        .update(pain_scales_tools_lab_data_reviews)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(
          eq(
            pain_scales_tools_lab_data_reviews.patient_id,
            patientIdNum
          )
        )
        .returning();
      result = updatedReviews[0];
    } else {
      // Create new record
      // Remove any timestamp fields that might be strings
      const insertData = { ...validatedData };
      delete insertData.createdAt;
      delete insertData.updatedAt;
      
      const now = new Date();
      const newReviews = await db
        .insert(pain_scales_tools_lab_data_reviews)
        .values({
          patient_id: patientIdNum,
          ...insertData,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newReviews[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain scales tools lab data reviews saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painScalesToolsLabDataReviewsStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Scales Tools Lab Data Reviews By ID
export const painScalesToolsLabDataReviewsById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painScalesToolsLabDataReviewsResult = await db
      .select()
      .from(pain_scales_tools_lab_data_reviews)
      .where(eq(pain_scales_tools_lab_data_reviews.patient_id, parseInt(id)))
      .limit(1);
    const painScalesToolsLabDataReviews =
      painScalesToolsLabDataReviewsResult[0];

    if (!painScalesToolsLabDataReviews) {
      reply.code(404);
      return {
        error:
          "No painScalesToolsLabDataReviews found for this painScalesToolsLabDataReviews",
      };
    }

    reply.code(200);
    return painScalesToolsLabDataReviews;
  } catch (error) {
    console.error("Error in painScalesToolsLabDataReviewsById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Assessment In Dementia Scale Store
export const painAssessmentInDementiaScaleStore = async (request, reply) => {
  try {
    const { patient_id, id, createdAt, updatedAt, ...validatedData } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a valid number" }],
      };
    }

    const existingScale = await db
      .select()
      .from(pain_assessment_in_dementia_scale)
      .where(
        eq(pain_assessment_in_dementia_scale.patient_id, patientIdNum)
      )
      .limit(1);
    const painAssessmentInDementiaScale = existingScale[0];

    let result;
    if (painAssessmentInDementiaScale) {
      // Update existing record
      const updateData = { ...validatedData };
      delete updateData.createdAt;
      delete updateData.updatedAt;
      
      const updatedScale = await db
        .update(pain_assessment_in_dementia_scale)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(
          eq(pain_assessment_in_dementia_scale.patient_id, patientIdNum)
        )
        .returning();
      result = updatedScale[0];
    } else {
      // Create new record
      const insertData = { ...validatedData };
      delete insertData.createdAt;
      delete insertData.updatedAt;
      
      const now = new Date();
      const newScale = await db
        .insert(pain_assessment_in_dementia_scale)
        .values({
          patient_id: patientIdNum,
          ...insertData,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newScale[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain assessment in dementia scale saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painAssessmentInDementiaScaleStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Assessment In Dementia Scale By ID
export const painAssessmentInDementiaScaleById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painAssessmentInDementiaScaleResult = await db
      .select()
      .from(pain_assessment_in_dementia_scale)
      .where(eq(pain_assessment_in_dementia_scale.patient_id, parseInt(id)))
      .limit(1);
    const painAssessmentInDementiaScale =
      painAssessmentInDementiaScaleResult[0];

    if (!painAssessmentInDementiaScale) {
      reply.code(404);
      return {
        error: "No pain assessment in dementia scale found for this patient",
      };
    }

    reply.code(200);
    return painAssessmentInDementiaScale;
  } catch (error) {
    console.error("Error in painAssessmentInDementiaScaleById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Flacc Behavioral Pain Store
export const flaccBehavioralPainStore = async (request, reply) => {
  try {
    const { patient_id, id, createdAt, updatedAt, ...validatedData } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a valid number" }],
      };
    }

    const existingFlacc = await db
      .select()
      .from(flacc_behavioral_pain)
      .where(eq(flacc_behavioral_pain.patient_id, patientIdNum))
      .limit(1);
    const flaccBehavioralPain = existingFlacc[0];

    let result;
    if (flaccBehavioralPain) {
      // Update existing record
      const updateData = { ...validatedData };
      delete updateData.createdAt;
      delete updateData.updatedAt;
      
      const updatedFlacc = await db
        .update(flacc_behavioral_pain)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(flacc_behavioral_pain.patient_id, patientIdNum))
        .returning();
      result = updatedFlacc[0];
    } else {
      // Create new record
      const insertData = { ...validatedData };
      delete insertData.createdAt;
      delete insertData.updatedAt;
      
      const now = new Date();
      const newFlacc = await db
        .insert(flacc_behavioral_pain)
        .values({
          patient_id: patientIdNum,
          ...insertData,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newFlacc[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "FLACC behavioral pain saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in flaccBehavioralPainStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Flacc Behavioral Pain By ID
export const flaccBehavioralPainById = async (request, reply) => {
  try {
    const { id } = request.params;
    const flaccBehavioralPainResult = await db
      .select()
      .from(flacc_behavioral_pain)
      .where(eq(flacc_behavioral_pain.patient_id, parseInt(id)))
      .limit(1);
    const flaccBehavioralPain = flaccBehavioralPainResult[0];

    if (!flaccBehavioralPain) {
      reply.code(404);
      return {
        error: "No flacc behavioral pain found for this patient",
      };
    }

    reply.code(200);
    return flaccBehavioralPain;
  } catch (error) {
    console.error("Error in flaccBehavioralPainById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Screening Store
export const painScreeningStore = async (request, reply) => {
  try {
    const { patient_id, id, createdAt, updatedAt, ...validatedData } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a valid number" }],
      };
    }

    const existingScreening = await db
      .select()
      .from(pain_screening)
      .where(eq(pain_screening.patient_id, patientIdNum))
      .limit(1);
    const painScreening = existingScreening[0];

    let result;
    if (painScreening) {
      // Update existing record
      const updateData = { ...validatedData };
      delete updateData.createdAt;
      delete updateData.updatedAt;
      
      const updatedScreening = await db
        .update(pain_screening)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(pain_screening.patient_id, patientIdNum))
        .returning();
      result = updatedScreening[0];
    } else {
      // Create new record
      const insertData = { ...validatedData };
      delete insertData.createdAt;
      delete insertData.updatedAt;
      
      const now = new Date();
      const newScreening = await db
        .insert(pain_screening)
        .values({
          patient_id: patientIdNum,
          ...insertData,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newScreening[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain screening saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painScreeningStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Screening By ID
export const painScreeningById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painScreeningResult = await db
      .select()
      .from(pain_screening)
      .where(eq(pain_screening.patient_id, parseInt(id)))
      .limit(1);
    const painScreening = painScreeningResult[0];

    if (!painScreening) {
      reply.code(404);
      return { error: "No pain screening found for this patient" };
    }

    reply.code(200);
    return painScreening;
  } catch (error) {
    console.error("Error in painScreeningById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Summary Interventions Goals Store
export const painSummaryInterventionsGoalsStore = async (request, reply) => {
  try {
    const { patient_id, id, createdAt, updatedAt, ...validatedData } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a valid number" }],
      };
    }

    const existingGoals = await db
      .select()
      .from(pain_summary_interventions_goals)
      .where(
        eq(pain_summary_interventions_goals.patient_id, patientIdNum)
      )
      .limit(1);
    const painSummaryInterventionsGoals = existingGoals[0];

    let result;
    if (painSummaryInterventionsGoals) {
      // Update existing record
      const updateData = { ...validatedData };
      delete updateData.createdAt;
      delete updateData.updatedAt;
      
      const updatedGoals = await db
        .update(pain_summary_interventions_goals)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(
          eq(pain_summary_interventions_goals.patient_id, patientIdNum)
        )
        .returning();
      result = updatedGoals[0];
    } else {
      // Create new record
      const insertData = { ...validatedData };
      delete insertData.createdAt;
      delete insertData.updatedAt;
      
      const now = new Date();
      const newGoals = await db
        .insert(pain_summary_interventions_goals)
        .values({
          patient_id: patientIdNum,
          ...insertData,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newGoals[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain summary interventions goals saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painSummaryInterventionsGoalsStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Summary Interventions Goals By ID
export const painSummaryInterventionsGoalsById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painSummaryInterventionsGoalsResult = await db
      .select()
      .from(pain_summary_interventions_goals)
      .where(eq(pain_summary_interventions_goals.patient_id, parseInt(id)))
      .limit(1);
    const painSummaryInterventionsGoals =
      painSummaryInterventionsGoalsResult[0];

    if (!painSummaryInterventionsGoals) {
      reply.code(404);
      return {
        error: "No pain summary interventions goals found for this patient",
      };
    }

    reply.code(200);
    return painSummaryInterventionsGoals;
  } catch (error) {
    console.error("Error in painSummaryInterventionsGoalsById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Comprehensive Pain Assessment Store
export const comprehensivePainAssessmentStore = async (request, reply) => {
  try {
    const { patient_id, id, createdAt, updatedAt, ...validatedData } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a valid number" }],
      };
    }

    const existingAssessment = await db
      .select()
      .from(comprehensive_pain_assessment)
      .where(eq(comprehensive_pain_assessment.patient_id, patientIdNum))
      .limit(1);
    const comprehensivePainAssessment = existingAssessment[0];

    let result;
    if (comprehensivePainAssessment) {
      // Update existing record
      const updateData = { ...validatedData };
      delete updateData.createdAt;
      delete updateData.updatedAt;
      
      const updatedAssessment = await db
        .update(comprehensive_pain_assessment)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(
          eq(comprehensive_pain_assessment.patient_id, patientIdNum)
        )
        .returning();
      result = updatedAssessment[0];
    } else {
      // Create new record
      const insertData = { ...validatedData };
      delete insertData.createdAt;
      delete insertData.updatedAt;
      
      const now = new Date();
      const newAssessment = await db
        .insert(comprehensive_pain_assessment)
        .values({
          patient_id: patientIdNum,
          ...insertData,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newAssessment[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Comprehensive pain assessment saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in comprehensivePainAssessmentStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Comprehensive Pain Assessment By ID
export const comprehensivePainAssessmentById = async (request, reply) => {
  try {
    const { id } = request.params;
    const comprehensivePainAssessmentResult = await db
      .select()
      .from(comprehensive_pain_assessment)
      .where(eq(comprehensive_pain_assessment.patient_id, parseInt(id)))
      .limit(1);
    const comprehensivePainAssessment = comprehensivePainAssessmentResult[0];

    if (!comprehensivePainAssessment) {
      reply.code(404);
      return {
        error: "No comprehensive pain assessment found for this patient",
      };
    }

    reply.code(200);
    return comprehensivePainAssessment;
  } catch (error) {
    console.error("Error in comprehensivePainAssessmentById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

// Pain Active Problem Store
export const painActiveProblemStore = async (request, reply) => {
  try {
    const { patient_id, id, createdAt, updatedAt, ...validatedData } = request.body;

    if (!patient_id) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID is required" }],
      };
    }

    const patientIdNum = parseInt(patient_id);
    if (isNaN(patientIdNum)) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [{ field: "patient_id", message: "Patient ID must be a valid number" }],
      };
    }

    const existingProblem = await db
      .select()
      .from(pain_active_problem)
      .where(eq(pain_active_problem.patient_id, patientIdNum))
      .limit(1);
    const painActiveProblem = existingProblem[0];

    let result;
    if (painActiveProblem) {
      // Update existing record
      const updateData = { ...validatedData };
      delete updateData.createdAt;
      delete updateData.updatedAt;
      
      const updatedProblem = await db
        .update(pain_active_problem)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(pain_active_problem.patient_id, patientIdNum))
        .returning();
      result = updatedProblem[0];
    } else {
      // Create new record
      const insertData = { ...validatedData };
      delete insertData.createdAt;
      delete insertData.updatedAt;
      
      const now = new Date();
      const newProblem = await db
        .insert(pain_active_problem)
        .values({
          patient_id: patientIdNum,
          ...insertData,
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      result = newProblem[0];
    }

    reply.code(201);
    return {
      status: 201,
      message: "Pain active problem saved successfully",
      data: result,
    };
  } catch (error) {
    console.error("Error in painActiveProblemStore:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: request.body,
    });
    reply.code(500);
    return {
      status: 500,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    };
  }
};

// Pain Active Problem By ID
export const painActiveProblemById = async (request, reply) => {
  try {
    const { id } = request.params;
    const painActiveProblemResult = await db
      .select()
      .from(pain_active_problem)
      .where(eq(pain_active_problem.patient_id, parseInt(id)))
      .limit(1);
    const painActiveProblem = painActiveProblemResult[0];

    if (!painActiveProblem) {
      reply.code(404);
      return {
        error: "No pain active problem found for this patient",
      };
    }

    reply.code(200);
    return painActiveProblem;
  } catch (error) {
    console.error("Error in painActiveProblemById:", error);
    reply.code(500);
    return { message: "Server error" };
  }
};

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
    if (painAssessment) {
      // Update existing record
      const updatedAssessment = await db
        .update(pain_assessments)
        .set({
          pain_level_now,
          acceptable_level_of_pain,
          worst_pain_level,
          primary_pain_site,
        })
        .where(eq(pain_assessments.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedAssessment[0];
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
        })
        .returning();
      result = newAssessment[0];
    }

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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, pain_rated_by_id } = request.body;

    const existingRatedBy = await db
      .select()
      .from(pain_rated_by)
      .where(eq(pain_rated_by.patient_id, parseInt(patient_id)))
      .limit(1);
    const painRatedBy = existingRatedBy[0];

    let result;
    if (painRatedBy) {
      // Update existing record
      const updatedRatedBy = await db
        .update(pain_rated_by)
        .set({ pain_rated_by_id })
        .where(eq(pain_rated_by.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedRatedBy[0];
    } else {
      // Create new record
      const newRatedBy = await db
        .insert(pain_rated_by)
        .values({
          patient_id: parseInt(patient_id),
          pain_rated_by_id,
        })
        .returning();
      result = newRatedBy[0];
    }

    reply.code(201);
    return {
      message: "painRatedBy created or updated successfully.",
      data: result,
    };
  } catch (error) {
    console.error("Error in painRatedByStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, pain_duration_id } = request.body;

    const existingDuration = await db
      .select()
      .from(pain_duration)
      .where(eq(pain_duration.patient_id, parseInt(patient_id)))
      .limit(1);
    const painDuration = existingDuration[0];

    let result;
    if (painDuration) {
      // Update existing record
      const updatedDuration = await db
        .update(pain_duration)
        .set({ pain_duration_id })
        .where(eq(pain_duration.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedDuration[0];
    } else {
      // Create new record
      const newDuration = await db
        .insert(pain_duration)
        .values({
          patient_id: parseInt(patient_id),
          pain_duration_id,
        })
        .returning();
      result = newDuration[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in painDurationStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, pain_frequency_id } = request.body;

    const existingFrequency = await db
      .select()
      .from(pain_frequency)
      .where(eq(pain_frequency.patient_id, parseInt(patient_id)))
      .limit(1);
    const painFrequency = existingFrequency[0];

    let result;
    if (painFrequency) {
      // Update existing record
      const updatedFrequency = await db
        .update(pain_frequency)
        .set({ pain_frequency_id })
        .where(eq(pain_frequency.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedFrequency[0];
    } else {
      // Create new record
      const newFrequency = await db
        .insert(pain_frequency)
        .values({
          patient_id: parseInt(patient_id),
          pain_frequency_id,
        })
        .returning();
      result = newFrequency[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in painFrequencyStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, pain_observations_id } = request.body;

    const existingObservation = await db
      .select()
      .from(pain_observations)
      .where(eq(pain_observations.patient_id, parseInt(patient_id)))
      .limit(1);
    const painObservation = existingObservation[0];

    let result;
    if (painObservation) {
      // Update existing record
      const updatedObservation = await db
        .update(pain_observations)
        .set({ pain_observations_id })
        .where(eq(pain_observations.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedObservation[0];
    } else {
      // Create new record
      const newObservation = await db
        .insert(pain_observations)
        .values({
          patient_id: parseInt(patient_id),
          pain_observations_id,
        })
        .returning();
      result = newObservation[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in painObservationStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, pain_worsened_by_id } = request.body;

    const existingWorsenedBy = await db
      .select()
      .from(pain_worsened_by)
      .where(eq(pain_worsened_by.patient_id, parseInt(patient_id)))
      .limit(1);
    const painWorsenedBy = existingWorsenedBy[0];

    let result;
    if (painWorsenedBy) {
      // Update existing record
      const updatedWorsenedBy = await db
        .update(pain_worsened_by)
        .set({ pain_worsened_by_id })
        .where(eq(pain_worsened_by.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedWorsenedBy[0];
    } else {
      // Create new record
      const newWorsenedBy = await db
        .insert(pain_worsened_by)
        .values({
          patient_id: parseInt(patient_id),
          pain_worsened_by_id,
        })
        .returning();
      result = newWorsenedBy[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in painWorsenedByStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, pain_character_id } = request.body;

    const existingCharacter = await db
      .select()
      .from(pain_character)
      .where(eq(pain_character.patient_id, parseInt(patient_id)))
      .limit(1);
    const painCharacter = existingCharacter[0];

    let result;
    if (painCharacter) {
      // Update existing record
      const updatedCharacter = await db
        .update(pain_character)
        .set({ pain_character_id })
        .where(eq(pain_character.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedCharacter[0];
    } else {
      // Create new record
      const newCharacter = await db
        .insert(pain_character)
        .values({
          patient_id: parseInt(patient_id),
          pain_character_id,
        })
        .returning();
      result = newCharacter[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in painCharacterStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, pain_relieved_by_id } = request.body;

    const existingRelievedBy = await db
      .select()
      .from(pain_relieved_by)
      .where(eq(pain_relieved_by.patient_id, parseInt(patient_id)))
      .limit(1);
    const painRelievedBy = existingRelievedBy[0];

    let result;
    if (painRelievedBy) {
      // Update existing record
      const updatedRelievedBy = await db
        .update(pain_relieved_by)
        .set({ pain_relieved_by_id })
        .where(eq(pain_relieved_by.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedRelievedBy[0];
    } else {
      // Create new record
      const newRelievedBy = await db
        .insert(pain_relieved_by)
        .values({
          patient_id: parseInt(patient_id),
          pain_relieved_by_id,
        })
        .returning();
      result = newRelievedBy[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in painRelievedByStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, pain_effects_on_function_id } = request.body;

    const existingEffectsOnFunction = await db
      .select()
      .from(pain_effects_on_function)
      .where(eq(pain_effects_on_function.patient_id, parseInt(patient_id)))
      .limit(1);
    const painEffectsOnFunction = existingEffectsOnFunction[0];

    let result;
    if (painEffectsOnFunction) {
      // Update existing record
      const updatedEffectsOnFunction = await db
        .update(pain_effects_on_function)
        .set({ pain_effects_on_function_id })
        .where(eq(pain_effects_on_function.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedEffectsOnFunction[0];
    } else {
      // Create new record
      const newEffectsOnFunction = await db
        .insert(pain_effects_on_function)
        .values({
          patient_id: parseInt(patient_id),
          pain_effects_on_function_id,
        })
        .returning();
      result = newEffectsOnFunction[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in painEffectsOnFunctionStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, pain_breakthrough_id } = request.body;

    const existingBreakthrough = await db
      .select()
      .from(pain_breakthrough)
      .where(eq(pain_breakthrough.patient_id, parseInt(patient_id)))
      .limit(1);
    const painBreakthrough = existingBreakthrough[0];

    let result;
    if (painBreakthrough) {
      // Update existing record
      const updatedBreakthrough = await db
        .update(pain_breakthrough)
        .set({ pain_breakthrough_id })
        .where(eq(pain_breakthrough.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedBreakthrough[0];
    } else {
      // Create new record
      const newBreakthrough = await db
        .insert(pain_breakthrough)
        .values({
          patient_id: parseInt(patient_id),
          pain_breakthrough_id,
        })
        .returning();
      result = newBreakthrough[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in painBreakthroughStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, type_of_pain_rating_scale_used_id } = request.body;

    const existingType = await db
      .select()
      .from(type_of_pain_rating_scale_used)
      .where(
        eq(type_of_pain_rating_scale_used.patient_id, parseInt(patient_id))
      )
      .limit(1);
    const typeOfPainRatingScaleUsed = existingType[0];

    let result;
    if (typeOfPainRatingScaleUsed) {
      // Update existing record
      const updatedType = await db
        .update(type_of_pain_rating_scale_used)
        .set({ type_of_pain_rating_scale_used_id })
        .where(
          eq(type_of_pain_rating_scale_used.patient_id, parseInt(patient_id))
        )
        .returning();
      result = updatedType[0];
    } else {
      // Create new record
      const newType = await db
        .insert(type_of_pain_rating_scale_used)
        .values({
          patient_id: parseInt(patient_id),
          type_of_pain_rating_scale_used_id,
        })
        .returning();
      result = newType[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in typeOfPainRatingScaleUsedStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, ...validatedData } = request.body;

    // Check if patient already has pain vital signs
    const existingVitalSigns = await db
      .select()
      .from(pain_vital_signs)
      .where(eq(pain_vital_signs.patient_id, parseInt(patient_id)))
      .limit(1);
    const painVitalSigns = existingVitalSigns[0];

    if (painVitalSigns) {
      // Update existing record
      const updatedVitalSigns = await db
        .update(pain_vital_signs)
        .set(validatedData)
        .where(eq(pain_vital_signs.patient_id, parseInt(patient_id)))
        .returning();
      reply.code(200);
      return {
        message: "Pain vital signs updated successfully",
        data: updatedVitalSigns[0],
      };
    } else {
      // Create new record
      const newVitalSigns = await db
        .insert(pain_vital_signs)
        .values({
          patient_id: parseInt(patient_id),
          ...validatedData,
        })
        .returning();
      reply.code(201);
      return {
        message: "Pain vital signs created successfully",
        data: newVitalSigns[0],
      };
    }
  } catch (error) {
    console.error("Error in painVitalSignsStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, ...validatedData } = request.body;

    const existingReviews = await db
      .select()
      .from(pain_scales_tools_lab_data_reviews)
      .where(
        eq(pain_scales_tools_lab_data_reviews.patient_id, parseInt(patient_id))
      )
      .limit(1);
    const painScalesToolsLabDataReviews = existingReviews[0];

    let result;
    if (painScalesToolsLabDataReviews) {
      // Update existing record
      const updatedReviews = await db
        .update(pain_scales_tools_lab_data_reviews)
        .set(validatedData)
        .where(
          eq(
            pain_scales_tools_lab_data_reviews.patient_id,
            parseInt(patient_id)
          )
        )
        .returning();
      result = updatedReviews[0];
    } else {
      // Create new record
      const newReviews = await db
        .insert(pain_scales_tools_lab_data_reviews)
        .values({
          patient_id: parseInt(patient_id),
          ...validatedData,
        })
        .returning();
      result = newReviews[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in painScalesToolsLabDataReviewsStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, ...validatedData } = request.body;

    const existingScale = await db
      .select()
      .from(pain_assessment_in_dementia_scale)
      .where(
        eq(pain_assessment_in_dementia_scale.patient_id, parseInt(patient_id))
      )
      .limit(1);
    const painAssessmentInDementiaScale = existingScale[0];

    let result;
    if (painAssessmentInDementiaScale) {
      // Update existing record
      const updatedScale = await db
        .update(pain_assessment_in_dementia_scale)
        .set(validatedData)
        .where(
          eq(pain_assessment_in_dementia_scale.patient_id, parseInt(patient_id))
        )
        .returning();
      result = updatedScale[0];
    } else {
      // Create new record
      const newScale = await db
        .insert(pain_assessment_in_dementia_scale)
        .values({
          patient_id: parseInt(patient_id),
          ...validatedData,
        })
        .returning();
      result = newScale[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in painAssessmentInDementiaScaleStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, ...validatedData } = request.body;

    const existingFlacc = await db
      .select()
      .from(flacc_behavioral_pain)
      .where(eq(flacc_behavioral_pain.patient_id, parseInt(patient_id)))
      .limit(1);
    const flaccBehavioralPain = existingFlacc[0];

    let result;
    if (flaccBehavioralPain) {
      // Update existing record
      const updatedFlacc = await db
        .update(flacc_behavioral_pain)
        .set(validatedData)
        .where(eq(flacc_behavioral_pain.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedFlacc[0];
    } else {
      // Create new record
      const newFlacc = await db
        .insert(flacc_behavioral_pain)
        .values({
          patient_id: parseInt(patient_id),
          ...validatedData,
        })
        .returning();
      result = newFlacc[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in flaccBehavioralPainStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, ...validatedData } = request.body;

    const existingScreening = await db
      .select()
      .from(pain_screening)
      .where(eq(pain_screening.patient_id, parseInt(patient_id)))
      .limit(1);
    const painScreening = existingScreening[0];

    let result;
    if (painScreening) {
      // Update existing record
      const updatedScreening = await db
        .update(pain_screening)
        .set(validatedData)
        .where(eq(pain_screening.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedScreening[0];
    } else {
      // Create new record
      const newScreening = await db
        .insert(pain_screening)
        .values({
          patient_id: parseInt(patient_id),
          ...validatedData,
        })
        .returning();
      result = newScreening[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in painScreeningStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, ...validatedData } = request.body;

    const existingGoals = await db
      .select()
      .from(pain_summary_interventions_goals)
      .where(
        eq(pain_summary_interventions_goals.patient_id, parseInt(patient_id))
      )
      .limit(1);
    const painSummaryInterventionsGoals = existingGoals[0];

    let result;
    if (painSummaryInterventionsGoals) {
      // Update existing record
      const updatedGoals = await db
        .update(pain_summary_interventions_goals)
        .set(validatedData)
        .where(
          eq(pain_summary_interventions_goals.patient_id, parseInt(patient_id))
        )
        .returning();
      result = updatedGoals[0];
    } else {
      // Create new record
      const newGoals = await db
        .insert(pain_summary_interventions_goals)
        .values({
          patient_id: parseInt(patient_id),
          ...validatedData,
        })
        .returning();
      result = newGoals[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in painSummaryInterventionsGoalsStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, ...validatedData } = request.body;

    const existingAssessment = await db
      .select()
      .from(comprehensive_pain_assessment)
      .where(eq(comprehensive_pain_assessment.patient_id, parseInt(patient_id)))
      .limit(1);
    const comprehensivePainAssessment = existingAssessment[0];

    let result;
    if (comprehensivePainAssessment) {
      // Update existing record
      const updatedAssessment = await db
        .update(comprehensive_pain_assessment)
        .set(validatedData)
        .where(
          eq(comprehensive_pain_assessment.patient_id, parseInt(patient_id))
        )
        .returning();
      result = updatedAssessment[0];
    } else {
      // Create new record
      const newAssessment = await db
        .insert(comprehensive_pain_assessment)
        .values({
          patient_id: parseInt(patient_id),
          ...validatedData,
        })
        .returning();
      result = newAssessment[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in comprehensivePainAssessmentStore:", error);
    reply.code(500);
    return { message: "Server error" };
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
    // Note: Validation should be done in route schema
    // Validation handled in route schema

    const { patient_id, ...validatedData } = request.body;

    const existingProblem = await db
      .select()
      .from(pain_active_problem)
      .where(eq(pain_active_problem.patient_id, parseInt(patient_id)))
      .limit(1);
    const painActiveProblem = existingProblem[0];

    let result;
    if (painActiveProblem) {
      // Update existing record
      const updatedProblem = await db
        .update(pain_active_problem)
        .set(validatedData)
        .where(eq(pain_active_problem.patient_id, parseInt(patient_id)))
        .returning();
      result = updatedProblem[0];
    } else {
      // Create new record
      const newProblem = await db
        .insert(pain_active_problem)
        .values({
          patient_id: parseInt(patient_id),
          ...validatedData,
        })
        .returning();
      result = newProblem[0];
    }

    reply.code(201);
    return result;
  } catch (error) {
    console.error("Error in painActiveProblemStore:", error);
    reply.code(500);
    return { message: "Server error" };
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

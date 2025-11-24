import {
    index,
    show,
    painLevelSeveritystore,
    painRatedByStore,
    painRatedById,
    painDurationStore,
    painDurationById,
    painFrequencyStore,
    painFrequencyById,
    painObservationStore,
    painObservationById,
    painWorsenedByStore,
    painWorsenedById,
    painCharacterStore,
    painCharacterById,
    painRelievedByStore,
    painRelievedById,
    painEffectsOnFunctionStore,
    painEffectsOnFunctionById,
    painBreakthroughStore,
    painBreakthroughById,
    typeOfPainRatingScaleUsedStore,
    typeOfPainRatingScaleUsedById,
    painVitalSignsStore,
    painVitalSignsById,
    painScalesToolsLabDataReviewsStore,
    painScalesToolsLabDataReviewsById,
    painAssessmentInDementiaScaleStore,
    painAssessmentInDementiaScaleById,
    flaccBehavioralPainStore,
    flaccBehavioralPainById,
    painScreeningStore,
    painScreeningById,
    painSummaryInterventionsGoalsStore,
    painSummaryInterventionsGoalsById,
    comprehensivePainAssessmentStore,
    comprehensivePainAssessmentById,
    painActiveProblemStore,
    painActiveProblemById,
} from "../../controllers/patient/Pain/PainAssessment.controller.js";

import {
    PainBreakthrough,
    PainCharacter,
    PainFrequency,
    PainObservation,
    PainEffectsOnFunction,
    TypeOfPainRatingScaleUsed,
    PainRatedBy,
    PainWorsened,
    PainRelivedBy,
    PainDuration,
    NegativeVocalization,
    FacialExpression,
    BodyLanguage,
    Consolability,
    Breathing,
    Face,
    Legs,
    Activity,
    Cry,
    PainServerity,
    StandardizedPainTool,
    ComprehensivePainIncluded,
    FlaaccBehavioralConsolability,
} from "../../controllers/patient/Pain/PainType.controller.js";

// Fastify plugin for pain routes
async function painRoutes(fastify, options) {
  // Pain Type Routes
  fastify.get("/pain-type/breakthrough", PainBreakthrough);
  fastify.get("/pain-type/character", PainCharacter);
  fastify.get("/pain-type/frequency", PainFrequency);
  fastify.get("/pain-type/observation", PainObservation);
  fastify.get("/pain-type/effects-on-function", PainEffectsOnFunction);
  fastify.get("/pain-type/rating-scale-used", TypeOfPainRatingScaleUsed);
  fastify.get("/pain-type/rated-by", PainRatedBy);
  fastify.get("/pain-type/worsened", PainWorsened);
  fastify.get("/pain-type/relieved-by", PainRelivedBy);
  fastify.get("/pain-type/duration", PainDuration);
  fastify.get("/pain-type/negative-vocalization", NegativeVocalization);
  fastify.get("/pain-type/facial-expression", FacialExpression);
  fastify.get("/pain-type/body-language", BodyLanguage);
  fastify.get("/pain-type/consolability", Consolability);
  fastify.get("/pain-type/breathing", Breathing);
  fastify.get("/pain-type/face", Face);
  fastify.get("/pain-type/legs", Legs);
  fastify.get("/pain-type/activity", Activity);
  fastify.get("/pain-type/cry", Cry);
  fastify.get("/pain-type/pain-serverity", PainServerity);
  fastify.get("/pain-type/standardized-pain-tool", StandardizedPainTool);
  fastify.get("/pain-type/comprehensive-pain-included", ComprehensivePainIncluded);
  fastify.get(
    "/pain-type/flaacc-behavioral-consolability",
    FlaaccBehavioralConsolability
  );

  // Pain Assessment Routes
  fastify.post("/pain-assessment/store", painLevelSeveritystore);
  fastify.get("/pain-assessment", index);
  fastify.get("/pain-assessment/:id", show);

  fastify.post("/pain-rated-by/store", painRatedByStore);
  fastify.post("/pain-duration/store", painDurationStore);
  fastify.post("/pain-frequency/store", painFrequencyStore);
  fastify.post("/pain-observation/store", painObservationStore);
  fastify.post("/pain-worsened-by/store", painWorsenedByStore);
  fastify.post("/pain-character/store", painCharacterStore);
  fastify.post("/pain-relieved-by/store", painRelievedByStore);
  fastify.post("/pain-effects-on-function/store", painEffectsOnFunctionStore);
  fastify.post("/pain-breakthrough/store", painBreakthroughStore);
  fastify.post("/pain-rating-scale/store", typeOfPainRatingScaleUsedStore);
  fastify.post("/pain-vital-signs/store", painVitalSignsStore);
  fastify.post(
    "/pain-scales-tools-lab-data-reviews/store",
    painScalesToolsLabDataReviewsStore
  );
  fastify.post(
    "/pain-assessment-in-dementia-scale/store",
    painAssessmentInDementiaScaleStore
  );
  fastify.post("/flacc-behavioral-pain/store", flaccBehavioralPainStore);
  fastify.post("/pain-screening/store", painScreeningStore);
  fastify.post("/pain-active-problem/store", painActiveProblemStore);
  fastify.post(
    "/pain-summary-interventions-goals/store",
    painSummaryInterventionsGoalsStore
  );
  fastify.post(
    "/comprehensive-pain-assessment/store",
    comprehensivePainAssessmentStore
  );

  fastify.get("/pain-rated-by/:id", painRatedById);
  fastify.get("/pain-duration/:id", painDurationById);
  fastify.get("/pain-frequency/:id", painFrequencyById);
  fastify.get("/pain-observation/:id", painObservationById);
  fastify.get("/pain-worsened-by/:id", painWorsenedById);
  fastify.get("/pain-character/:id", painCharacterById);
  fastify.get("/pain-relieved-by/:id", painRelievedById);
  fastify.get("/pain-effects-on-function/:id", painEffectsOnFunctionById);
  fastify.get("/pain-breakthrough/:id", painBreakthroughById);
  fastify.get("/pain-rating-scale/:id", typeOfPainRatingScaleUsedById);
  fastify.get("/pain-vital-signs/:id", painVitalSignsById);
  fastify.get(
    "/pain-scales-tools-lab-data-reviews/:id",
    painScalesToolsLabDataReviewsById
  );
  fastify.get(
    "/pain-assessment-in-dementia-scale/:id",
    painAssessmentInDementiaScaleById
  );
  fastify.get("/flacc-behavioral-pain/:id", flaccBehavioralPainById);
  fastify.get("/pain-screening/:id", painScreeningById);
  fastify.get(
    "/pain-summary-interventions-goals/:id",
    painSummaryInterventionsGoalsById
  );
  fastify.get(
    "/comprehensive-pain-assessment/:id",
    comprehensivePainAssessmentById
  );
  fastify.get("/pain-active-problem/:id", painActiveProblemById);
}

export default painRoutes;

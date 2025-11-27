// Pain Type Routes - Aliases for backward compatibility
// Frontend calls /api/pain-type/... but routes are at /api/pain/pain-type/...
// This file creates aliases so both paths work

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
} from "../controllers/patient/Pain/PainType.controller.js";

// Fastify plugin for pain-type route aliases
async function painTypeRoutes(fastify, options) {
  // Pain Type Routes - Aliases at root level
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
}

export default painTypeRoutes;


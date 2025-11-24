// Pain Type Controller - Fastify version

// Pain Breakthrough
export const PainBreakthrough = (request, reply) => {
    const data = [
        { id: "yes", name: "Yes" },
        { id: "no", name: "No" },
    ];
    reply.code(200);
    return data;
};

// Pain Character
export const PainCharacter = (request, reply) => {
    const data = [
        { id: "sharp", name: "Sharp" },
        { id: "dull", name: "Dull" },
        { id: "aching", name: "Aching" },
        { id: "throbbing", name: "Throbbing" },
        { id: "burning", name: "Burning" },
        { id: "cramping", name: "Cramping" },
        { id: "shooting", name: "Shooting" },
        { id: "stabbing", name: "Stabbing" },
        { id: "tingling", name: "Tingling" },
        { id: "numbness", name: "Numbness" },
    ];
    reply.code(200);
    return data;
};

// Pain Frequency
export const PainFrequency = (request, reply) => {
    const data = [
        { id: "constant", name: "Constant" },
        { id: "intermittent", name: "Intermittent" },
        { id: "occasional", name: "Occasional" },
        { id: "frequent", name: "Frequent" },
    ];
    reply.code(200);
    return data;
};

// Pain Observation
export const PainObservation = (request, reply) => {
    const data = [
        { id: "grimacing", name: "Grimacing" },
        { id: "guarding", name: "Guarding" },
        { id: "restlessness", name: "Restlessness" },
        { id: "moaning", name: "Moaning" },
        { id: "verbal_complaints", name: "Verbal Complaints" },
        { id: "withdrawal", name: "Withdrawal" },
        { id: "irritability", name: "Irritability" },
        { id: "fatigue", name: "Fatigue" },
    ];
    reply.code(200);
    return data;
};

// Pain Effects On Function
export const PainEffectsOnFunction = (request, reply) => {
    const data = [
        { id: "sleep", name: "Sleep" },
        { id: "mobility", name: "Mobility" },
        { id: "appetite", name: "Appetite" },
        { id: "mood", name: "Mood" },
        { id: "work", name: "Work" },
        { id: "social_activities", name: "Social Activities" },
        { id: "concentration", name: "Concentration" },
        { id: "self_care", name: "Self Care" },
    ];
    reply.code(200);
    return data;
};

// Type Of Pain Rating Scale Used
export const TypeOfPainRatingScaleUsed = (request, reply) => {
    const data = [
        { id: "numeric", name: "Numeric (0-10)" },
        { id: "faces", name: "Faces" },
        { id: "verbal", name: "Verbal Descriptor" },
        { id: "visual_analogue", name: "Visual Analogue Scale" },
    ];
    reply.code(200);
    return data;
};

// Pain Rated By
export const PainRatedBy = (request, reply) => {
    const data = [
        { id: "self", name: "Self" },
        { id: "nurse", name: "Nurse" },
        { id: "family", name: "Family Member" },
        { id: "caregiver", name: "Caregiver" },
    ];
    reply.code(200);
    return data;
};

// Pain Worsened
export const PainWorsened = (request, reply) => {
    const data = [
        { id: "movement", name: "Movement" },
        { id: "sitting", name: "Sitting" },
        { id: "standing", name: "Standing" },
        { id: "lying_down", name: "Lying Down" },
        { id: "weather", name: "Weather Changes" },
        { id: "stress", name: "Stress" },
        { id: "time_of_day", name: "Time of Day" },
        { id: "activity", name: "Activity" },
    ];
    reply.code(200);
    return data;
};

// Pain Relieved By
export const PainRelivedBy = (request, reply) => {
    const data = [
        { id: "rest", name: "Rest" },
        { id: "medication", name: "Medication" },
        { id: "heat", name: "Heat" },
        { id: "cold", name: "Cold" },
        { id: "massage", name: "Massage" },
        { id: "position_change", name: "Position Change" },
        { id: "distraction", name: "Distraction" },
        { id: "relaxation", name: "Relaxation Techniques" },
    ];
    reply.code(200);
    return data;
};

// Pain Duration
export const PainDuration = (request, reply) => {
    const data = [
        { id: "acute", name: "Acute (<3 months)" },
        { id: "chronic", name: "Chronic (>3 months)" },
        { id: "intermittent", name: "Intermittent" },
    ];
    reply.code(200);
    return data;
};

// Negative Vocalization
export const NegativeVocalization = (request, reply) => {
    const data = [
        { id: "crying", name: "Crying" },
        { id: "moaning", name: "Moaning" },
        { id: "screaming", name: "Screaming" },
        { id: "grunting", name: "Grunting" },
        { id: "whimpering", name: "Whimpering" },
    ];
    reply.code(200);
    return data;
};

// Facial Expression
export const FacialExpression = (request, reply) => {
    const data = [
        { id: "smiling", name: "Smiling" },
        { id: "neutral", name: "Neutral" },
        { id: "grimacing", name: "Grimacing" },
        { id: "frowning", name: "Frowning" },
        { id: "tearful", name: "Tearful" },
    ];
    reply.code(200);
    return data;
};

// Body Language
export const BodyLanguage = (request, reply) => {
    const data = [
        { id: "relaxed", name: "Relaxed" },
        { id: "tense", name: "Tense" },
        { id: "rigid", name: "Rigid" },
        { id: "guarded", name: "Guarded" },
        { id: "restless", name: "Restless" },
        { id: "withdrawn", name: "Withdrawn" },
    ];
    reply.code(200);
    return data;
};

// Consolability
export const Consolability = (request, reply) => {
    const data = [
        { id: "easily_consoled", name: "Easily Consoled" },
        { id: "moderately_consoled", name: "Moderately Consoled" },
        { id: "difficult_to_console", name: "Difficult to Console" },
        { id: "not_consoled", name: "Not Consoled" },
    ];
    reply.code(200);
    return data;
};

// Breathing
export const Breathing = (request, reply) => {
    const data = [
        { id: "normal", name: "Normal" },
        { id: "rapid", name: "Rapid/Shallow" },
        { id: "labored", name: "Labored" },
        { id: "irregular", name: "Irregular" },
    ];
    reply.code(200);
    return data;
};

// Face
export const Face = (request, reply) => {
    const data = [
        { id: "no_particular_expression", name: "No Particular Expression" },
        {
            id: "occasional_facial_expression",
            name: "Occasional Facial Expression",
        },
        {
            id: "frequent_facial_expression",
            name: "Frequent Facial Expression",
        },
    ];
    reply.code(200);
    return data;
};

// Legs
export const Legs = (request, reply) => {
    const data = [
        { id: "normal_position", name: "Normal Position/Relaxed" },
        { id: "uneasy_restless", name: "Uneasy/Restless" },
        { id: "kicking", name: "Kicking" },
    ];
    reply.code(200);
    return data;
};

// Activity
export const Activity = (request, reply) => {
    const data = [
        { id: "lying_quietly", name: "Lying Quietly" },
        { id: "squirming", name: "Squirming" },
        { id: "arching", name: "Arching" },
    ];
    reply.code(200);
    return data;
};

// Cry
export const Cry = (request, reply) => {
    const data = [
        { id: "no_cry", name: "No Cry" },
        { id: "moans", name: "Moans/Whimpers" },
        { id: "cries", name: "Cries" },
    ];
    reply.code(200);
    return data;
};

// Pain Serverity
export const PainServerity = (request, reply) => {
    const data = [
        { id: "mild", name: "Mild" },
        { id: "moderate", name: "Moderate" },
        { id: "severe", name: "Severe" },
    ];
    reply.code(200);
    return data;
};

// Standardized Pain Tool
export const StandardizedPainTool = (request, reply) => {
    const data = [
        { id: "faces_pain_scale", name: "Faces Pain Scale" },
        { id: "numeric_rating_scale", name: "Numeric Rating Scale" },
        { id: "verbal_descriptor_scale", name: "Verbal Descriptor Scale" },
        { id: "visual_analogue_scale", name: "Visual Analogue Scale" },
        { id: "flacc_scale", name: "FLACC Scale" },
        { id: "painad_scale", name: "PAINAD Scale" },
    ];
    reply.code(200);
    return data;
};

// Comprehensive Pain Included
export const ComprehensivePainIncluded = (request, reply) => {
    const data = [
        { id: "history", name: "History" },
        { id: "physical_examination", name: "Physical Examination" },
        { id: "functional_assessment", name: "Functional Assessment" },
        { id: "psychosocial_assessment", name: "Psychosocial Assessment" },
        { id: "pharmacological_review", name: "Pharmacological Review" },
        {
            id: "non_pharmacological_review",
            name: "Non-Pharmacological Review",
        },
    ];
    reply.code(200);
    return data;
};

// Flaacc Behavioral Consolability
export const FlaaccBehavioralConsolability = (request, reply) => {
    const data = [
        { id: "consolable", name: "Consolable" },
        { id: "partially_consolable", name: "Partially Consolable" },
        { id: "not_consolable", name: "Not Consolable" },
    ];
    reply.code(200);
    return data;
};

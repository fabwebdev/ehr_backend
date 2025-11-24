// PainObservation enum equivalent
const PainObservation = {
    CRYING: "crying",
    FACIAL_GRIMACING: "facial grimacing",
    GRABBING_HOLDING_BODY_PART: "grabbing holding body part",
    GUARDED_MOVEMENTS: "guarded movements",
    SPLINTING: "splinting",
    THRASHING: "thrashing",
    WINCING_UPON_MOVEMENT: "wincing upon movement",
    OTHER: "other",

    toArray: function () {
        const values = [
            this.CRYING,
            this.FACIAL_GRIMACING,
            this.GRABBING_HOLDING_BODY_PART,
            this.GUARDED_MOVEMENTS,
            this.SPLINTING,
            this.THRASHING,
            this.WINCING_UPON_MOVEMENT,
            this.OTHER,
        ];

        return values.map((value, index) => ({
            id: index + 1,
            value: value,
        }));
    },
};

export default PainObservation;

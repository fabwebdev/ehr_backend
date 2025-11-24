// PainFrequency enum equivalent
const PainFrequency = {
    NO_PATTERN: "no pattern",
    CONSTANT: "constant",
    INTERMITTENT: "intermittent",
    IN_THE_MORNING: "in the morning",
    BREAKTHROUGH: "breakthrough",
    OTHER: "other",

    toArray: function () {
        const values = [
            this.NO_PATTERN,
            this.CONSTANT,
            this.INTERMITTENT,
            this.IN_THE_MORNING,
            this.BREAKTHROUGH,
            this.OTHER,
        ];

        return values.map((value, index) => ({
            id: index + 1,
            value: value,
        }));
    },
};

export default PainFrequency;

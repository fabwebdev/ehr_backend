// PainCharacter enum equivalent
const PainCharacter = {
    CRAMPING: "cramping",
    GNAWING: "gnawing",
    NUMB: "numb",
    SHARP: "sharp",
    TENDER: "tender",
    DEEP: "deep",
    MISERABLE: "miserable",
    PENETRATING: "penetrating",
    SHOOTING: "shooting",
    TIRING: "tiring",
    EXHAUSTING: "exhausting",
    PRESSURE: "pressure",
    SQUEEZING: "squeezing",
    UNBEARABLE: "unbearable",
    PATIENT_UNABLE_TO_DESCRIBE: "patient unable to describe",
    OTHER: "other",

    toArray: function () {
        const values = [
            this.CRAMPING,
            this.GNAWING,
            this.NUMB,
            this.SHARP,
            this.TENDER,
            this.DEEP,
            this.MISERABLE,
            this.PENETRATING,
            this.SHOOTING,
            this.TIRING,
            this.EXHAUSTING,
            this.PRESSURE,
            this.SQUEEZING,
            this.UNBEARABLE,
            this.PATIENT_UNABLE_TO_DESCRIBE,
            this.OTHER,
        ];

        return values.map((value, index) => ({
            id: index + 1,
            value: value,
        }));
    },
};

export default PainCharacter;

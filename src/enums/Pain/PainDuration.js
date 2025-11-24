// PainDuration enum equivalent
const PainDuration = {
    INTERMITTENT: "intermittent",
    FREQUENT: "frequent",
    CONSTANT: "constant",
    OTHER: "other",

    toArray: function () {
        const values = [
            this.INTERMITTENT,
            this.FREQUENT,
            this.CONSTANT,
            this.OTHER,
        ];

        return values.map((value, index) => ({
            id: index + 1,
            value: value,
        }));
    },
};

export default PainDuration;

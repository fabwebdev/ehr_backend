// PainEffectsOnFunction enum equivalent
const PainEffectsOnFunction = {
    ACTIVITIES: "activities",
    APPETITE: "appetite",
    ENERGY: "energy",
    SLEEP: "sleep",
    SOCIALIZATION: "socialization",
    OTHER: "other",

    toArray: function () {
        const values = [
            this.ACTIVITIES,
            this.APPETITE,
            this.ENERGY,
            this.SLEEP,
            this.SOCIALIZATION,
            this.OTHER,
        ];

        return values.map((value, index) => ({
            id: index + 1,
            value: value,
        }));
    },
};

export default PainEffectsOnFunction;

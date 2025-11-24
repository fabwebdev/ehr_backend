const ComprehensivePainIncluded = {
    LOCATION: "1. Location",
    SEVERITY: "2. Severity",
    CHARACTER: "3. Character",
    DURATION: "4. Duration",
    FREQUENCY: "5. Frequency",
    RELIEVES_WORSENS: "6. What relieves/worsens pain",
    EFFECT_ON_FUNCTION: "7. Effect on function or quality of life",
    NONE: "9. None of the above",

    toArray: function () {
        const values = [
            this.LOCATION,
            this.SEVERITY,
            this.CHARACTER,
            this.DURATION,
            this.FREQUENCY,
            this.RELIEVES_WORSENS,
            this.EFFECT_ON_FUNCTION,
            this.NONE,
        ];

        return values.map((value, index) => ({
            id: index,
            value: value,
        }));
    },
};

export default ComprehensivePainIncluded;

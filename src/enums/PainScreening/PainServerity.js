// PainServerity enum equivalent
const PainServerity = {
    NO_PAIN: "0. None",
    MILD_PAIN: "1. Mild",
    MODERATE_PAIN: "2. Moderate",
    SEVERE_PAIN: "3. Severe",
    NOT_RATED: "9. Pain not rated",

    toArray: function () {
        const values = [
            this.NO_PAIN,
            this.MILD_PAIN,
            this.MODERATE_PAIN,
            this.SEVERE_PAIN,
            this.NOT_RATED,
        ];

        return values.map((value, index) => ({
            id: index,
            value: value,
        }));
    },
};

export default PainServerity;

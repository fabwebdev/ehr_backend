// PainRelivedBy enum equivalent
const PainRelivedBy = {
    HEAT: "heat",
    ICE: "ice",
    MASSAGE: "massage",
    MEDICATION: "medication",
    REPOSITIONING: "repositioning",
    REST_RELAXATION: "rest/relaxation",
    OTHER: "other",

    toArray: function () {
        const values = [
            this.HEAT,
            this.ICE,
            this.MASSAGE,
            this.MEDICATION,
            this.REPOSITIONING,
            this.REST_RELAXATION,
            this.OTHER,
        ];

        return values.map((value, index) => ({
            id: index + 1,
            value: value,
        }));
    },
};

export default PainRelivedBy;

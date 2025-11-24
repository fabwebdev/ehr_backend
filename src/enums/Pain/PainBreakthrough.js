// PainBreakthrough enum equivalent
const PainBreakthrough = {
    NEVER: "never",
    LESS_THAN_DAILY: "less than daily",
    DAILY: "daily",
    SEVERAL_TIMES_A_DAY: "several times a day",

    toArray: function () {
        const values = [
            this.NEVER,
            this.LESS_THAN_DAILY,
            this.DAILY,
            this.SEVERAL_TIMES_A_DAY,
        ];

        return values.map((value, index) => ({
            id: index + 1,
            value: value,
        }));
    },
};

export default PainBreakthrough;

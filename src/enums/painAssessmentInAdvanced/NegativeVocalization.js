const NegativeVocalization = {
    NONE: "None (0)",
    OCCASIONAL_MOAN:
        "Occasional moan or groan, low level speech with negative or disapproving quality (1)",
    REPEATED_TROUBLED:
        "Repeated troubled calling out, loud moaning or groaning, crying (2)",

    toArray: function () {
        const values = [
            this.NONE,
            this.OCCASIONAL_MOAN,
            this.REPEATED_TROUBLED,
        ];

        return values.map((value, index) => ({
            id: index,
            value: value,
        }));
    },
};

export default NegativeVocalization;

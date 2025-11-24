const BodyLanguage = {
    RELAXED: "Relaxed (0)",
    TENSE_DISTRESSED: "Tense, distressed pacing, fidgeting (1)",
    RIGID_FISTS_CLENCHED:
        "Rigid, fists clenched, knees pulled up, pulling or pushing away, striking out (2)",

    toArray: function () {
        const values = [
            this.RELAXED,
            this.TENSE_DISTRESSED,
            this.RIGID_FISTS_CLENCHED,
        ];

        return values.map((value, index) => ({
            id: index,
            value: value,
        }));
    },
};

export default BodyLanguage;

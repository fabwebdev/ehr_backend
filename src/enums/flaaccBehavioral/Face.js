const Face = {
    NO_EXPRESSION: "No particular expression or smile (0)",
    OCCASIONAL_GRIMACE:
        "Occasional grimace or frown, withdrawn, disinterested (1)",
    FREQUENT_FROWN:
        "Frequent to constant frown, clenched jaw, quivering chin (2)",

    toArray: function () {
        const values = [
            this.NO_EXPRESSION,
            this.OCCASIONAL_GRIMACE,
            this.FREQUENT_FROWN,
        ];

        return values.map((value, index) => ({
            id: index,
            value: value,
        }));
    },
};

export default Face;

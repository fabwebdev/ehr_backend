const Legs = {
    NORMAL: "Normal position or relaxed (0)",
    UNEASY: "Uneasy, restless, tense (1)",
    KICKING: "Kicking or legs drawn up (2)",

    toArray: function () {
        const values = [this.NORMAL, this.UNEASY, this.KICKING];

        return values.map((value, index) => ({
            id: index,
            value: value,
        }));
    },
};

export default Legs;

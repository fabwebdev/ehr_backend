const Activity = {
    NORMAL: "Lying quietly, normal position, moves easily (0)",
    SQUIRMING: "Squirming, shifting back and forth, tense (1)",
    ARCHED: "Arched, rigid, or jerking (2)",

    toArray: function () {
        const values = [this.NORMAL, this.SQUIRMING, this.ARCHED];

        return values.map((value, index) => ({
            id: index,
            value: value,
        }));
    },
};

export default Activity;

const Consolability = {
    RELAXED: "Content, relaxed (0)",
    REASSURED:
        "Reassured by occasional touching, hugging, or being talked to, distractable (1)",
    DIFFICULT: "Difficult to console or comfort (2)",

    toArray: function () {
        const values = [this.RELAXED, this.REASSURED, this.DIFFICULT];

        return values.map((value, index) => ({
            id: index,
            value: value,
        }));
    },
};

export default Consolability;

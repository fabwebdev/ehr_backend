const FacialExpression = {
    SMILING_OR_INEXPRESSIVE: "Smiling or inexpressive (0)",
    SAD_FRIGHTENED_FROWN: "Sad, frightened, frown (1)",
    FACIAL_GRIMACING: "Facial grimacing (2)",

    toArray: function () {
        const values = [
            this.SMILING_OR_INEXPRESSIVE,
            this.SAD_FRIGHTENED_FROWN,
            this.FACIAL_GRIMACING,
        ];

        return values.map((value, index) => ({
            id: index,
            value: value,
        }));
    },
};

export default FacialExpression;

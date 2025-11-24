// TypeOfPainRatingScaleUsed enum equivalent
const TypeOfPainRatingScaleUsed = {
    NUMERIC_ESAS: "numeric/esas",
    VERBAL_DESCRIPTOR: "verbal descriptor",
    POISE_VISUAL_FACES: "poise visual/faces",
    STAFF_OBSERVATION_PAINAD: "staff observation/painad",
    NO_SCALE_USED: "no scale used",

    toArray: function () {
        const values = [
            this.NUMERIC_ESAS,
            this.VERBAL_DESCRIPTOR,
            this.POISE_VISUAL_FACES,
            this.STAFF_OBSERVATION_PAINAD,
            this.NO_SCALE_USED,
        ];

        return values.map((value, index) => ({
            id: index + 1,
            value: value,
        }));
    },
};

export default TypeOfPainRatingScaleUsed;

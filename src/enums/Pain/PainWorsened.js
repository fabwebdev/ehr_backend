// PainWorsened enum equivalent
const PainWorsened = {
    CHANGE_IN_POSITION: "change in position",
    MOVEMENT: "movement",
    WALKING: "walking",
    COLD: "cold",
    SITTING: "sitting",
    STANDING: "standing",
    HEAT: "heat",
    OTHER: "other",

    toArray: function () {
        const values = [
            this.CHANGE_IN_POSITION,
            this.MOVEMENT,
            this.WALKING,
            this.COLD,
            this.SITTING,
            this.STANDING,
            this.HEAT,
            this.OTHER,
        ];

        return values.map((value, index) => ({
            id: index + 1,
            value: value,
        }));
    },
};

export default PainWorsened;

const Cry = {
    NO_CRY: "No cry (awake or asleep) (0)",
    MOANS: "Moans or whimpers, occasional complaint (1)",
    CRYING: "Crying steadily, screams or sobs, frequent complaints (2)",

    toArray: function () {
        const values = [this.NO_CRY, this.MOANS, this.CRYING];

        return values.map((value, index) => ({
            id: index,
            value: value,
        }));
    },
};

export default Cry;

const Breathing = {
    NORMAL: "Normal (0)",
    OCCASIONAL_LABORED:
        "Occasional labored breathing, short periods of hyperventilation (1)",
    NOISY_LABORED:
        "Noisy labored breathing, long periods of hyperventilation, Cheyne-Stokes respirations (2)",

    toArray: function () {
        const values = [
            this.NORMAL,
            this.OCCASIONAL_LABORED,
            this.NOISY_LABORED,
        ];

        return values.map((value, index) => ({
            id: index,
            value: value,
        }));
    },
};

export default Breathing;

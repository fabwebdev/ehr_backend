const Consolability = {
    NO_NEED_TO_CONSOLE: "No need to console (0)",
    DISTRACTED_OR_REASSURED: "Distracted or reassured by voice or touch (1)",
    UNABLE_TO_CONSOLE: "Unable to console, distract, reassure (2)",

    toArray: function () {
        const values = [
            this.NO_NEED_TO_CONSOLE,
            this.DISTRACTED_OR_REASSURED,
            this.UNABLE_TO_CONSOLE,
        ];

        return values.map((value, index) => ({
            id: index,
            value: value,
        }));
    },
};

export default Consolability;

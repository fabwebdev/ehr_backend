// StandardizedPainTool enum equivalent
const StandardizedPainTool = {
    NUMERIC: "1. Numeric",
    VERBAL_DESCRIPTOR: "2. Verbal descriptor",
    PATIENT_VISUAL: "3. Patient visual",
    STAFF_OBSERVATION: "4. Staff observation",
    NO_STANDARDIZED_TOOL: "9. No standardized tool used",

    toArray: function () {
        const values = [
            this.NUMERIC,
            this.VERBAL_DESCRIPTOR,
            this.PATIENT_VISUAL,
            this.STAFF_OBSERVATION,
            this.NO_STANDARDIZED_TOOL,
        ];

        return values.map((value, index) => ({
            id: index,
            value: value,
        }));
    },
};

export default StandardizedPainTool;

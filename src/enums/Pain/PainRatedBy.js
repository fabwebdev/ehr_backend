// PainRatedBy enum equivalent
const PainRatedBy = {
    PATIENT: "patient",
    CAREGIVER: "caregiver",
    HOSPICE_NURSE: "hospice nurse",
    FACILITY_STAFF: "facility staff",
    OTHER: "other",

    toArray: function () {
        const values = [
            this.PATIENT,
            this.CAREGIVER,
            this.HOSPICE_NURSE,
            this.FACILITY_STAFF,
            this.OTHER,
        ];

        return values.map((value, index) => ({
            id: index + 1,
            value: value,
        }));
    },
};

export default PainRatedBy;

# Patient Routes Summary

## 📊 Patient Count

**Total Patients in Database: 0**

Currently, there are no patients in the database.

---

## 🛣️ Patient Routes Overview

All patient routes are mounted under `/api/patient` and require authentication (except where noted).

### **Main Patient Routes** (`/api/patient`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/patient/test` | Test route - verify patient routes are working | ✅ |
| `GET` | `/api/patient` | Get all patients | ✅ (Admin, Doctor, Nurse, Patient) |
| `POST` | `/api/patient` | Create a new patient | ✅ (Doctor, Admin) |
| `GET` | `/api/patient/:id` | Get patient by ID | ✅ (Permission: VIEW_PATIENT) |
| `PUT` | `/api/patient/:id` | Update patient | ✅ (Permission: UPDATE_PATIENT) |
| `DELETE` | `/api/patient/:id` | Delete patient | ✅ (Admin only) |

---

### **Patient Sub-Routes**

#### 1. **Admission Information** (`/api/patient/admission`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patient/admission` | Get all admission information |
| `GET` | `/api/patient/admission/:id` | Get admission info by ID |
| `POST` | `/api/patient/admission/store` | Auto-save admission information |

#### 2. **Address** (`/api/address`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| Routes for patient addresses |

#### 3. **Benefit Period** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/patient/benefit-period/store` | Create benefit period |
| `POST` | `/api/patient/benefit-period/update/:id` | Update benefit period |
| `GET` | `/api/patient/benefit-period/:id` | Get benefit period by ID |

#### 4. **Cardiac Assessment** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patient/cardiac-assessment/:id` | Get cardiac assessment |
| `GET` | `/api/patient/cardiac-assessment/:patientId/:id` | Get specific assessment |
| `POST` | `/api/patient/cardiac-assessment/store` | Store cardiac assessment |
| `GET` | `/api/patient/cardiac-assessment/:patientId` | Get all assessments for patient |

#### 5. **Discharge** (`/api/discharge`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/discharge` | Get all discharges |
| `GET` | `/api/discharge-list` | Get discharge list |
| `POST` | `/api/discharge/store` | Store discharge information |
| `GET` | `/api/discharge/:id` | Get discharge by ID |
| `GET` | `/api/discharge-sections` | Get discharge sections |

#### 6. **DME Provider** (`/api/dme-provider`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dme-provider/providers` | Get all providers |
| `POST` | `/api/dme-provider/providers/store` | Create provider |
| `GET` | `/api/dme-provider/providers/:id` | Get provider by ID |
| `PUT` | `/api/dme-provider/providers/update/:id` | Update provider |
| `DELETE` | `/api/dme-provider/providers/:id` | Delete provider |

#### 7. **DNR** (`/api/dnr`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dnr/dnr` | Get all DNR records |
| `POST` | `/api/dnr/dnr/store` | Create DNR record |
| `GET` | `/api/dnr/dnr/:id` | Get DNR by ID |
| `PUT` | `/api/dnr/dnr/:id` | Update DNR |
| `DELETE` | `/api/dnr/dnr/:id` | Delete DNR |

#### 8. **Emergency Preparedness Level** (`/api/emergency-preparedness-level`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/emergency-preparedness-level/emergencyPreparednessLevel` | Get all levels |
| `POST` | `/api/emergency-preparedness-level/emergencyPreparednessLevel/store` | Create level |
| `GET` | `/api/emergency-preparedness-level/emergencyPreparednessLevel/:id` | Get level by ID |
| `PUT` | `/api/emergency-preparedness-level/emergencyPreparednessLevel/:id` | Update level |

#### 9. **Endocrine Assessment** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patient/endocrine-assessment/:id` | Get endocrine assessment |
| `GET` | `/api/patient/endocrine-assessment/:patientId/:id` | Get specific assessment |
| `POST` | `/api/patient/endocrine-assessment/store` | Store endocrine assessment |
| `GET` | `/api/patient/endocrine-assessment/:patientId` | Get all assessments for patient |

#### 10. **Hematological Assessment** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patient/hematological-assessment/:id` | Get hematological assessment |
| `GET` | `/api/patient/hematological-assessment/:patientId/:id` | Get specific assessment |
| `POST` | `/api/patient/hematological-assessment/store` | Store hematological assessment |
| `GET` | `/api/patient/hematological-assessment/:patientId` | Get all assessments for patient |

#### 11. **HIS PDF** (`/api/his-pdf`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/his-pdf/generate-his-pdf` | Generate HIS PDF |

#### 12. **Integumentary Assessment** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patient/integumentary-assessment/:id` | Get integumentary assessment |
| `GET` | `/api/patient/integumentary-assessment/:patientId/:id` | Get specific assessment |
| `POST` | `/api/patient/integumentary-assessment/store` | Store integumentary assessment |
| `GET` | `/api/patient/integumentary-assessment/:patientId` | Get all assessments for patient |

#### 13. **Liaison Primary** (`/api/liaison-primary`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/liaison-primary/liaisonPrimary` | Get all primary liaisons |
| `POST` | `/api/liaison-primary/liaisonPrimary/store` | Create primary liaison |
| `GET` | `/api/liaison-primary/liaisonPrimary/:id` | Get liaison by ID |
| `PUT` | `/api/liaison-primary/liaisonPrimary/:id` | Update liaison |
| `DELETE` | `/api/liaison-primary/liaisonPrimary/:id` | Delete liaison |

#### 14. **Liaison Secondary** (`/api/liaison-secondary`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/liaison-secondary/liaisonSecondary` | Get all secondary liaisons |
| `POST` | `/api/liaison-secondary/liaisonSecondary/store` | Create secondary liaison |
| `GET` | `/api/liaison-secondary/liaisonSecondary/:id` | Get liaison by ID |
| `PUT` | `/api/liaison-secondary/liaisonSecondary/:id` | Update liaison |
| `DELETE` | `/api/liaison-secondary/liaisonSecondary/:id` | Delete liaison |

#### 15. **Living Arrangements** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patient/living-arrangements` | Get all living arrangements |
| `POST` | `/api/patient/living-arrangements/store` | Create living arrangement |
| `GET` | `/api/patient/living-arrangements/:id` | Get living arrangement by ID |

#### 16. **Nursing Clinical Notes** (`/api/nursing-clinical-notes`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| Multiple routes for various nursing clinical note types |

#### 17. **Nutrition Assessment** (`/api/nutrition-assessment`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/nutrition-assessment/nutrition/problems-types` | Get nutrition problem types |
| `GET` | `/api/nutrition-assessment/nutrition/:id` | Get nutrition assessment |
| `POST` | `/api/nutrition-assessment/nutrition/:id/auto-save` | Auto-save nutrition assessment |

#### 18. **Pain Assessment** (`/api/pain`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| **Pain Types:**
| `GET` | `/api/pain/pain-type/breakthrough` | Get breakthrough pain types |
| `GET` | `/api/pain/pain-type/character` | Get pain character types |
| `GET` | `/api/pain/pain-type/frequency` | Get pain frequency types |
| `GET` | `/api/pain/pain-type/observation` | Get pain observation types |
| `GET` | `/api/pain/pain-type/effects-on-function` | Get effects on function types |
| `GET` | `/api/pain/pain-type/rating-scale-used` | Get rating scale types |
| `GET` | `/api/pain/pain-type/rated-by` | Get rated by types |
| `GET` | `/api/pain/pain-type/worsened` | Get worsened types |
| `GET` | `/api/pain/pain-type/relieved-by` | Get relieved by types |
| `GET` | `/api/pain/pain-type/duration` | Get duration types |
| `GET` | `/api/pain/pain-type/negative-vocalization` | Get negative vocalization types |
| `GET` | `/api/pain/pain-type/facial-expression` | Get facial expression types |
| `GET` | `/api/pain/pain-type/body-language` | Get body language types |
| `GET` | `/api/pain/pain-type/consolability` | Get consolability types |
| `GET` | `/api/pain/pain-type/breathing` | Get breathing types |
| `GET` | `/api/pain/pain-type/face` | Get face types |
| `GET` | `/api/pain/pain-type/legs` | Get legs types |
| `GET` | `/api/pain/pain-type/activity` | Get activity types |
| `GET` | `/api/pain/pain-type/cry` | Get cry types |
| `GET` | `/api/pain/pain-type/pain-serverity` | Get pain severity types |
| `GET` | `/api/pain/pain-type/standardized-pain-tool` | Get standardized pain tool types |
| `GET` | `/api/pain/pain-type/comprehensive-pain-included` | Get comprehensive pain included types |
| **Pain Assessments:**
| `GET` | `/api/pain/pain-assessment` | Get all pain assessments |
| `GET` | `/api/pain/pain-assessment/:id` | Get pain assessment by ID |
| `POST` | `/api/pain/pain-assessment/store` | Store pain assessment |
| **Pain Sub-Assessments:**
| `POST` | `/api/pain/pain-rated-by/store` | Store pain rated by |
| `POST` | `/api/pain/pain-duration/store` | Store pain duration |
| `POST` | `/api/pain/pain-frequency/store` | Store pain frequency |
| `POST` | `/api/pain/pain-observation/store` | Store pain observation |
| `POST` | `/api/pain/pain-worsened-by/store` | Store pain worsened by |
| `POST` | `/api/pain/pain-character/store` | Store pain character |
| `POST` | `/api/pain/pain-relieved-by/store` | Store pain relieved by |
| `POST` | `/api/pain/pain-effects-on-function/store` | Store effects on function |
| `POST` | `/api/pain/pain-breakthrough/store` | Store breakthrough pain |
| `POST` | `/api/pain/pain-rating-scale/store` | Store rating scale |
| `POST` | `/api/pain/pain-vital-signs/store` | Store vital signs |
| `POST` | `/api/pain/flacc-behavioral-pain/store` | Store FLACC behavioral pain |
| `POST` | `/api/pain/pain-screening/store` | Store pain screening |
| `POST` | `/api/pain/pain-active-problem/store` | Store active problem |
| **Get Pain Sub-Assessments:**
| `GET` | `/api/pain/pain-rated-by/:id` | Get pain rated by |
| `GET` | `/api/pain/pain-duration/:id` | Get pain duration |
| `GET` | `/api/pain/pain-frequency/:id` | Get pain frequency |
| `GET` | `/api/pain/pain-observation/:id` | Get pain observation |
| `GET` | `/api/pain/pain-worsened-by/:id` | Get pain worsened by |
| `GET` | `/api/pain/pain-character/:id` | Get pain character |
| `GET` | `/api/pain/pain-relieved-by/:id` | Get pain relieved by |
| `GET` | `/api/pain/pain-effects-on-function/:id` | Get effects on function |
| `GET` | `/api/pain/pain-breakthrough/:id` | Get breakthrough pain |
| `GET` | `/api/pain/pain-rating-scale/:id` | Get rating scale |
| `GET` | `/api/pain/pain-vital-signs/:id` | Get vital signs |
| `GET` | `/api/pain/flacc-behavioral-pain/:id` | Get FLACC behavioral pain |
| `GET` | `/api/pain/pain-screening/:id` | Get pain screening |
| `GET` | `/api/pain/pain-active-problem/:id` | Get active problem |

#### 19. **Patient Identifiers** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patient/patient-identifiers` | Get all patient identifiers |
| `POST` | `/api/patient/patient-identifiers/store` | Create patient identifier |
| `GET` | `/api/patient/patient-identifiers/:id` | Get patient identifier by ID |

#### 20. **Patient Pharmacy** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patient/patientPharmacy` | Get all patient pharmacies |
| `POST` | `/api/patient/patientPharmacy/store` | Create patient pharmacy |
| `GET` | `/api/patient/patientPharmacy/:id` | Get patient pharmacy by ID |
| `PUT` | `/api/patient/patientPharmacy/update/:id` | Update patient pharmacy |
| `DELETE` | `/api/patient/patientPharmacy/:id` | Delete patient pharmacy |

#### 21. **Payer Information** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/patient/payer-information/store` | Store payer information |
| `GET` | `/api/patient/payer-information/:id` | Get payer information by ID |

#### 22. **Primary Diagnosis** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patient/primaryDiagnosis` | Get all primary diagnoses |
| `POST` | `/api/patient/primaryDiagnosis/store` | Create primary diagnosis |
| `GET` | `/api/patient/primaryDiagnosis/:id` | Get primary diagnosis by ID |
| `PUT` | `/api/patient/primaryDiagnosis/update/:id` | Update primary diagnosis |
| `DELETE` | `/api/patient/primaryDiagnosis/:id` | Delete primary diagnosis |

#### 23. **Prognosis** (`/api/prognosis`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/prognosis/prognosis` | Get all prognoses |
| `POST` | `/api/prognosis/prognosis/store` | Create prognosis |
| `GET` | `/api/prognosis/prognosis/:id` | Get prognosis by ID |

#### 24. **Race Ethnicity** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patient/raceEthnicity` | Get all race/ethnicity records |
| `POST` | `/api/patient/raceEthnicity/store` | Create race/ethnicity record |
| `GET` | `/api/patient/raceEthnicity/:id` | Get race/ethnicity by ID |
| `PUT` | `/api/patient/raceEthnicity/:id` | Update race/ethnicity |
| `DELETE` | `/api/patient/raceEthnicity/:id` | Delete race/ethnicity |

#### 25. **Select Options** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patient/select/race-ethnicity` | Get race/ethnicity options |
| `GET` | `/api/patient/select/primary-diagnosis` | Get primary diagnosis options |
| `GET` | `/api/patient/select/dme-provider` | Get DME provider options |
| `GET` | `/api/patient/select/liaison-primary` | Get primary liaison options |
| `GET` | `/api/patient/select/liaison-secondary` | Get secondary liaison options |
| `GET` | `/api/patient/nutrition-template` | Get nutrition template |
| `GET` | `/api/patient/nutrition-problem` | Get nutrition problem |

#### 26. **Signature** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/patient/signature/store` | Store signature |
| `GET` | `/api/patient/signature/:id` | Get signature by ID |

#### 27. **Spiritual Preference** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/patient/spiritual-preference` | Get all spiritual preferences |
| `POST` | `/api/patient/spiritual-preference/store` | Create spiritual preference |
| `GET` | `/api/patient/spiritual-preference/:id` | Get spiritual preference by ID |

#### 28. **Visit Information** (`/api/patient`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/patient/visit-information/store` | Store visit information |
| `GET` | `/api/patient/visit-information/:id` | Get visit information by ID |

#### 29. **Vital Signs** (`/api/vital-signs`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/vital-signs/vital-signs` | Get all vital signs |
| `POST` | `/api/vital-signs/vital-signs/store` | Store vital signs |
| `GET` | `/api/vital-signs/vital-signs/:id` | Get vital signs by ID |

---

## 📝 Notes

1. **Authentication**: All routes (except `/api/patient/test`) require authentication via `better-auth` middleware
2. **Authorization**: Many routes have RBAC (Role-Based Access Control) checks
3. **Route Structure**: Most patient-related routes are nested under `/api/patient`, but some are mounted at the root level (e.g., `/api/discharge`, `/api/pain`)
4. **Database**: Currently, there are **0 patients** in the database

---

## 🔍 Quick Reference

- **Base URL**: `/api/patient`
- **Main CRUD**: `GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id`
- **Total Patient-Related Route Files**: 30+ route files
- **Total Routes**: 150+ individual endpoints


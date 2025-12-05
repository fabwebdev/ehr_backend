# Complete Backend API Routes Documentation

**Base URL:** `http://localhost:3000/api`

**Note:** All routes except `/health` and `/auth/*` require authentication (session token in cookies).

---

## Table of Contents

1. [Public Routes](#public-routes)
2. [Authentication Routes](#authentication-routes)
3. [Patient Routes](#patient-routes)
4. [Pain Assessment Routes](#pain-assessment-routes)
5. [User Management Routes](#user-management-routes)
6. [RBAC & Permissions Routes](#rbac--permissions-routes)
7. [Audit Routes](#audit-routes)
8. [Demo Routes](#demo-routes)

---

## Public Routes

### Health Check
- **GET** `/api/health` - Health check endpoint (no authentication required)
  - Returns: `{ status: "healthy", database: "connected", timestamp: "..." }`

---

## Authentication Routes

**Base Path:** `/api/auth`

All authentication routes are handled by Better Auth with custom enhancements.

### Authentication Endpoints

- **POST** `/api/auth/sign-up` - User registration
  - Body: `{ email, password, firstName, lastName }`
  - Returns: User object with assigned default "patient" role

- **POST** `/api/auth/sign-in` - User login
  - Body: `{ email, password }`
  - Returns: User object with role and permissions

- **POST** `/api/auth/sign-out` - User logout
  - Clears session cookies

- **GET** `/api/auth/me` - Get current user profile
  - Returns: User object with role and permissions
  - Requires: Authentication

- **GET** `/api/auth/admin-only` - Admin only test route
  - Requires: Admin role

- **GET** `/api/auth/medical-staff` - Medical staff only route
  - Requires: Admin, Doctor, or Nurse role

- **GET** `/api/auth/view-patients` - Permission test route
  - Requires: VIEW_PATIENT permission

- **POST** `/api/auth/create-admin` - Create admin user (temporary, unprotected)
  - Body: `{ email, password, name, firstName, lastName }`

---

## Patient Routes

**Base Path:** `/api/patient`

All patient routes require authentication.

### Main Patient Routes

- **GET** `/api/patient/test` - Test route to verify patient routes are working
- **GET** `/api/patient` - Get all patients
  - Requires: VIEW_PATIENT permission (Admin, Doctor, Nurse, Patient)
- **POST** `/api/patient` - Create new patient
  - Requires: CREATE_PATIENT permission (Doctor, Admin)
- **GET** `/api/patient/:id` - Get patient by ID
  - Requires: VIEW_PATIENT permission
- **PUT** `/api/patient/:id` - Update patient
  - Requires: UPDATE_PATIENT permission (Doctor, Admin)
- **DELETE** `/api/patient/:id` - Delete patient
  - Requires: Admin role only

### Patient Sub-Routes

#### Admission Information
**Base Path:** `/api/patient/admission`

- **GET** `/api/patient/admission/admission` - Get all admission information
- **GET** `/api/patient/admission/admission/:id` - Get admission info by ID
- **POST** `/api/patient/admission/admission/store` - Auto-save admission information

#### Benefit Period
**Base Path:** `/api/benefit-periods`

- Routes for benefit period management

#### Cardiac Assessment
**Base Path:** `/api/cardiac-assessment`

- Routes for cardiac assessment data

#### Discharge
**Base Path:** `/api/discharge`

- Routes for discharge information

#### Endocrine Assessment
**Base Path:** `/api/endocrine-assessment`

- Routes for endocrine assessment data

#### Hematological Assessment
**Base Path:** `/api/hematological-assessment`

- Routes for hematological assessment data

#### Integumentary Assessment
**Base Path:** `/api/integumentary-assessment`

- Routes for integumentary assessment data

#### Nursing Clinical Notes
**Base Path:** `/api/nursing-clinical-notes`

- Routes for nursing clinical notes

#### Nutrition Assessment
**Base Path:** `/api/nutrition-assessment`

- Routes for nutrition assessment data

#### Prognosis
**Base Path:** `/api/prognosis`

- Routes for prognosis data

#### Vital Signs
**Base Path:** `/api/vital-signs`

- **GET** `/api/vital-signs/vital-signs` - Get all vital signs
- **POST** `/api/vital-signs/vital-signs/store` - Store vital signs
- **GET** `/api/vital-signs/vital-signs/:id` - Get vital signs by ID

#### Visit Information
**Base Path:** `/api/visit-information`

- Routes for visit information

#### HIS PDF
**Base Path:** `/api/his-pdf`

- Routes for HIS PDF generation

#### Address
**Base Path:** `/api/address`

- Routes for patient addresses

#### Admission Information (Alternative)
**Base Path:** `/api/admission-information`

- Routes for admission information

#### DME Provider
**Base Path:** `/api/dme-provider`

- Routes for DME provider information

#### DNR
**Base Path:** `/api/dnr`

- Routes for DNR (Do Not Resuscitate) information

#### Emergency Preparedness Level
**Base Path:** `/api/emergency-preparedness-level`

- Routes for emergency preparedness level

#### Liaison Primary
**Base Path:** `/api/liaison-primary`

- Routes for primary liaison information

#### Liaison Secondary
**Base Path:** `/api/liaison-secondary`

- Routes for secondary liaison information

#### Living Arrangements
**Base Path:** `/api/living-arrangements`

- Routes for living arrangements information

#### Patient Identifiers
**Base Path:** `/api/patient-identifiers`

- Routes for patient identifiers

#### Patient Pharmacy
**Base Path:** `/api/patient-pharmacy`

- Routes for patient pharmacy information

#### Payer Information
**Base Path:** `/api/payer-information`

- Routes for payer information

#### Primary Diagnosis
**Base Path:** `/api/primary-diagnosis`

- Routes for primary diagnosis information

#### Race Ethnicity
**Base Path:** `/api/race-ethnicity`

- Routes for race and ethnicity information

#### Signature
**Base Path:** `/api/signature`

- Routes for signature information

#### Spiritual Preference
**Base Path:** `/api/spiritual-preference`

- Routes for spiritual preference information

#### Select Routes
**Base Path:** `/api/select`

- **GET** `/api/select/site-of-service-list` - Get site of service list
- **GET** `/api/select/admitted-form-list` - Get admitted form list
- **GET** `/api/select/prognosis-patient-list` - Get prognosis patient list
- **GET** `/api/select/prognosis-imminence` - Get prognosis imminence
- **GET** `/api/select/prognosis-caregiver` - Get prognosis caregiver
- **GET** `/api/select/nutrition-template` - Get nutrition template
- **GET** `/api/select/nutrition-problem` - Get nutrition problem

---

## Pain Assessment Routes

**Base Path:** `/api/pain`

All pain routes require authentication.

### Pain Type Routes (GET - Dropdown Options)

- **GET** `/api/pain/pain-type/breakthrough` - Get pain breakthrough types
- **GET** `/api/pain/pain-type/character` - Get pain character types
- **GET** `/api/pain/pain-type/frequency` - Get pain frequency types
- **GET** `/api/pain/pain-type/observation` - Get pain observation types
- **GET** `/api/pain/pain-type/effects-on-function` - Get pain effects on function types
- **GET** `/api/pain/pain-type/rating-scale-used` - Get pain rating scale types
- **GET** `/api/pain/pain-type/rated-by` - Get pain rated by types
- **GET** `/api/pain/pain-type/worsened` - Get pain worsened types
- **GET** `/api/pain/pain-type/relieved-by` - Get pain relieved by types
- **GET** `/api/pain/pain-type/duration` - Get pain duration types
- **GET** `/api/pain/pain-type/negative-vocalization` - Get negative vocalization types
- **GET** `/api/pain/pain-type/facial-expression` - Get facial expression types
- **GET** `/api/pain/pain-type/body-language` - Get body language types
- **GET** `/api/pain/pain-type/consolability` - Get consolability types
- **GET** `/api/pain/pain-type/breathing` - Get breathing types
- **GET** `/api/pain/pain-type/face` - Get face types
- **GET** `/api/pain/pain-type/legs` - Get legs types
- **GET** `/api/pain/pain-type/activity` - Get activity types
- **GET** `/api/pain/pain-type/cry` - Get cry types
- **GET** `/api/pain/pain-type/pain-serverity` - Get pain severity types
- **GET** `/api/pain/pain-type/standardized-pain-tool` - Get standardized pain tool types
- **GET** `/api/pain/pain-type/comprehensive-pain-included` - Get comprehensive pain included types
- **GET** `/api/pain/pain-type/flaacc-behavioral-consolability` - Get FLACC behavioral consolability types

### Pain Assessment Data Routes

#### Pain Assessment (Main)
- **POST** `/api/pain/pain-assessment/store` - Create/update pain assessment
  - Body: `{ patient_id, pain_level_now, acceptable_level_of_pain, worst_pain_level, primary_pain_site }`
- **GET** `/api/pain/pain-assessment` - Get all pain assessments
- **GET** `/api/pain/pain-assessment/:id` - Get pain assessment by patient ID

#### Pain Rated By
- **POST** `/api/pain/pain-rated-by/store` - Create/update pain rated by
  - Body: `{ patient_id, pain_rated_by_id }`
- **GET** `/api/pain/pain-rated-by/:id` - Get pain rated by by patient ID

#### Pain Duration
- **POST** `/api/pain/pain-duration/store` - Create/update pain duration
  - Body: `{ patient_id, pain_duration_id }`
- **GET** `/api/pain/pain-duration/:id` - Get pain duration by patient ID

#### Pain Frequency
- **POST** `/api/pain/pain-frequency/store` - Create/update pain frequency
  - Body: `{ patient_id, pain_frequency_id }`
- **GET** `/api/pain/pain-frequency/:id` - Get pain frequency by patient ID

#### Pain Observation
- **POST** `/api/pain/pain-observation/store` - Create/update pain observation
  - Body: `{ patient_id, pain_observations_id }`
- **GET** `/api/pain/pain-observation/:id` - Get pain observation by patient ID

#### Pain Worsened By
- **POST** `/api/pain/pain-worsened-by/store` - Create/update pain worsened by
  - Body: `{ patient_id, pain_worsened_by_id }`
- **GET** `/api/pain/pain-worsened-by/:id` - Get pain worsened by by patient ID

#### Pain Character
- **POST** `/api/pain/pain-character/store` - Create/update pain character
  - Body: `{ patient_id, pain_character_id }`
- **GET** `/api/pain/pain-character/:id` - Get pain character by patient ID

#### Pain Relieved By
- **POST** `/api/pain/pain-relieved-by/store` - Create/update pain relieved by
  - Body: `{ patient_id, pain_relieved_by_id }`
- **GET** `/api/pain/pain-relieved-by/:id` - Get pain relieved by by patient ID

#### Pain Effects On Function
- **POST** `/api/pain/pain-effects-on-function/store` - Create/update pain effects on function
  - Body: `{ patient_id, pain_effects_on_function_id }`
- **GET** `/api/pain/pain-effects-on-function/:id` - Get pain effects on function by patient ID

#### Pain Breakthrough
- **POST** `/api/pain/pain-breakthrough/store` - Create/update pain breakthrough
  - Body: `{ patient_id, pain_breakthrough_id }`
- **GET** `/api/pain/pain-breakthrough/:id` - Get pain breakthrough by patient ID

#### Pain Rating Scale
- **POST** `/api/pain/pain-rating-scale/store` - Create/update pain rating scale
  - Body: `{ patient_id, type_of_pain_rating_scale_used_id }`
- **GET** `/api/pain/pain-rating-scale/:id` - Get pain rating scale by patient ID

#### Pain Vital Signs
- **POST** `/api/pain/pain-vital-signs/store` - Create/update pain vital signs
  - Body: `{ patient_id, temperature_fahrenheit, temperature_method, heart_rate, heart_rhythm, heart_rate_location, respiratory_rate, respiratory_rhythm, blood_pressure_systolic, blood_pressure_diastolic, bp_location, bp_position, bp_additional_details, pulse_oximetry, pulse_ox_location, pulse_ox_other_location, bmi, bmi_percentile, body_height_inches, body_weight_lbs, body_weight_kg, weight_source }`
  - Note: All fields except `patient_id` are optional
- **GET** `/api/pain/pain-vital-signs/:id` - Get pain vital signs by patient ID

#### Pain Scales Tools Lab Data Reviews
- **POST** `/api/pain/pain-scales-tools-lab-data-reviews/store` - Create/update pain scales tools lab data reviews
  - Body: `{ patient_id, mid_arm_circumference, mid_thigh_circumference, sleep_hours, fast, nyha, pps, blood_sugar, pt_inr, other_reading_2, other_reading_3, other_reading_4 }`
  - Note: All fields except `patient_id` are optional
- **GET** `/api/pain/pain-scales-tools-lab-data-reviews/:id` - Get pain scales tools lab data reviews by patient ID

#### Pain Assessment In Dementia Scale
- **POST** `/api/pain/pain-assessment-in-dementia-scale/store` - Create/update pain assessment in dementia scale
  - Body: `{ patient_id, ...other_fields }`
- **GET** `/api/pain/pain-assessment-in-dementia-scale/:id` - Get pain assessment in dementia scale by patient ID

#### FLACC Behavioral Pain
- **POST** `/api/pain/flacc-behavioral-pain/store` - Create/update FLACC behavioral pain
  - Body: `{ patient_id, ...other_fields }`
- **GET** `/api/pain/flacc-behavioral-pain/:id` - Get FLACC behavioral pain by patient ID

#### Pain Screening
- **POST** `/api/pain/pain-screening/store` - Create/update pain screening
  - Body: `{ patient_id, ...other_fields }`
- **GET** `/api/pain/pain-screening/:id` - Get pain screening by patient ID

#### Pain Active Problem
- **POST** `/api/pain/pain-active-problem/store` - Create/update pain active problem
  - Body: `{ patient_id, ...other_fields }`
- **GET** `/api/pain/pain-active-problem/:id` - Get pain active problem by patient ID

#### Pain Summary Interventions Goals
- **POST** `/api/pain/pain-summary-interventions-goals/store` - Create/update pain summary interventions goals
  - Body: `{ patient_id, ...other_fields }`
- **GET** `/api/pain/pain-summary-interventions-goals/:id` - Get pain summary interventions goals by patient ID

#### Comprehensive Pain Assessment
- **POST** `/api/pain/comprehensive-pain-assessment/store` - Create/update comprehensive pain assessment
  - Body: `{ patient_id, ...other_fields }`
- **GET** `/api/pain/comprehensive-pain-assessment/:id` - Get comprehensive pain assessment by patient ID

---

## User Management Routes

**Base Path:** `/api`

- **GET** `/api/users` - Get all users
- **POST** `/api/users` - Create new user
- **GET** `/api/users/:id` - Get user by ID
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user

---

## RBAC & Permissions Routes

**Base Path:** `/api/rbac`

All RBAC routes require authentication and admin role (unless specified).

- **GET** `/api/rbac/roles` - Get all roles (Admin only)
- **GET** `/api/rbac/permissions` - Get all permissions (Admin only)
- **GET** `/api/rbac/my-permissions` - Get current user's permissions (Any authenticated user)
- **GET** `/api/rbac/roles/:role/permissions` - Get permissions for a specific role (Admin only)
- **PUT** `/api/rbac/roles/:role` - Update permissions for a role (Admin only)
  - Body: `{ permissions: [permission_id1, permission_id2, ...] }`
- **POST** `/api/rbac/users/:userId/role` - Assign role to user (Admin only)
  - Body: `{ role: "admin" | "doctor" | "nurse" | "patient" | "staff" }`

### Permission Routes

**Base Path:** `/api/permissions`

- **GET** `/api/permissions` - Get all permissions
- **GET** `/api/permissions/list` - Get permission list
- **POST** `/api/permissions/store` - Create new permission
- **GET** `/api/permissions/:id` - Get permission by ID
- **PUT** `/api/permissions/:id` - Update permission
- **DELETE** `/api/permissions/:id` - Delete permission

---

## Audit Routes

**Base Path:** `/api/audit`

All audit routes require authentication.

- **GET** `/api/audit` - Get all audit logs (Admin only)
- **GET** `/api/audit/:id` - Get audit log by ID (Admin only)
- **GET** `/api/audit/user/logs` - Get current user's audit logs (Any authenticated user)

---

## Demo Routes

### ABAC Demo Routes

**Base Path:** `/api/abac-demo`

All routes require authentication.

- **GET** `/api/abac-demo/rbac-only/admin` - RBAC only: Admin access
- **GET** `/api/abac-demo/rbac-only/healthcare` - RBAC only: Healthcare staff access
- **GET** `/api/abac-demo/abac-only/patient/:id` - ABAC only: Patient record access
- **GET** `/api/abac-demo/rbac-and-abac/patient/:id` - RBAC and ABAC: Both required
- **GET** `/api/abac-demo/rbac-or-abac/patient/:id` - RBAC or ABAC: Either sufficient
- **GET** `/api/abac-demo/complex-access/patient/:id` - Complex access control demo

### CASL Demo Routes

**Base Path:** `/api/casl-demo`

All routes require authentication.

- **GET** `/api/casl-demo/can-view-patients` - Check if user can view patients
- **GET** `/api/casl-demo/can-create-patients` - Check if user can create patients
- **GET** `/api/casl-demo/require-view-patients` - Require VIEW_PATIENT ability
- **GET** `/api/casl-demo/require-create-patients` - Require CREATE_PATIENT ability
- **GET** `/api/casl-demo/require-any-patient-abilities` - Require any patient ability
- **GET** `/api/casl-demo/require-all-patient-abilities` - Require all patient abilities
- **GET** `/api/casl-demo/manual-check` - Manual CASL ability checks
- **GET** `/api/casl-demo/admin-only` - Admin-only access with CASL

---

## Important Notes

### Authentication

- All routes except `/api/health` and `/api/auth/*` require authentication
- Authentication is done via Better Auth session tokens (cookies)
- Include `credentials: 'include'` in frontend requests to send cookies

### Route Parameters

- `:id` in patient-related routes typically refers to `patient_id`, not record ID
- Most POST routes automatically create if record doesn't exist, or update if it does

### Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

### Common Response Format

**Success:**
```json
{
  "status": 200,
  "message": "Success message",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": 400,
  "message": "Error message",
  "errors": [ ... ]
}
```

---

## Last Updated

Generated on: 2024-01-15

**Note:** This documentation is auto-generated. For the most up-to-date routes, check the route files in `src/routes/` directory.


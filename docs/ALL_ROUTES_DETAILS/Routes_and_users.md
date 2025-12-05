# EHR System - Routes and User Roles Summary

## User Roles Summary

To check how many nurses, doctors, and staff you have in your database, run:
```bash
node check_user_roles.js
```
*(Note: This requires DATABASE_URL environment variable to be set)*

### Available Roles in System:
- **admin** - Full system access
- **doctor** - Medical staff with patient management permissions
- **nurse** - Healthcare staff with patient care permissions
- **staff** - General staff with view-only permissions
- **patient** - Patients with limited access to their own records

---

## All Routes Summary

### Base Path: `/api`

### Public Routes (No Authentication)

#### Health Check
- `GET /api/health` - Health check endpoint

#### Authentication Routes (`/api/auth/*` or `/api/`)
- `POST /api/sign-up` - User registration
- `POST /api/sign-in` - User login
- `POST /api/sign-out` - User logout
- `GET /api/session` - Get current session

---

### Protected Routes (Requires Authentication)

All routes below require authentication. Most routes use role-based access control (RBAC).

---

### Patient Management Routes (`/api/patient`)

**Access Control:**
- `GET /api/patient` - View all patients
  - **Roles**: Admin, Doctor, Nurse, Patient (own records)
- `POST /api/patient` - Create new patient
  - **Roles**: Admin, Doctor (CREATE_PATIENT permission)
- `GET /api/patient/:id` - View specific patient
  - **Roles**: Admin, Doctor, Nurse, Patient (own record)
- `PUT /api/patient/:id` - Update patient
  - **Roles**: Admin, Doctor (UPDATE_PATIENT permission)
- `DELETE /api/patient/:id` - Delete patient
  - **Roles**: Admin only
- `GET /api/patient/test` - Test route (all authenticated users)

#### Patient Sub-routes:

**Admission Information** (`/api/patient/admission/*`)
- `GET /api/patient/admission` - List admission info
- `GET /api/patient/admission/:id` - Get admission info
- `POST /api/patient/admission/auto-save` - Auto-save admission info

**Benefit Period** (`/api/patient/*`)
- Benefit period related routes

**Cardiac Assessment** (`/api/patient/*`)
- Cardiac assessment routes

**Discharge** (`/api/patient/*`)
- Discharge related routes

**Endocrine Assessment** (`/api/patient/*`)
- Endocrine assessment routes

**Hematological Assessment** (`/api/patient/*`)
- Hematological assessment routes

**Integumentary Assessment** (`/api/patient/*`)
- Integumentary assessment routes

**Living Arrangements** (`/api/patient/*`)
- Living arrangements routes

**Nutrition** (`/api/patient/nutrition/*`)
- Nutrition assessment routes

**Patient Identifiers** (`/api/patient/*`)
- Patient identifiers routes

**Payer Information** (`/api/patient/*`)
- Payer information routes

**Prognosis** (`/api/patient/prognosis/*`)
- Prognosis routes

**Select** (`/api/patient/*`)
- Select/dropdown data routes

**Signature** (`/api/patient/*`)
- Signature routes

**Spiritual Preference** (`/api/patient/*`)
- Spiritual preference routes

**Visit Information** (`/api/patient/visit-information/*`)
- Visit information routes

**Address** (`/api/patient/*`)
- Address routes

**Primary Diagnosis** (`/api/primary-diagnosis/*`)
- `GET /api/primary-diagnosis/:patientId` - Get primary diagnosis
- `POST /api/primary-diagnosis` - Create primary diagnosis
- `PUT /api/primary-diagnosis/:id` - Update primary diagnosis
- `DELETE /api/primary-diagnosis/:id` - Delete primary diagnosis

---

### Vital Signs Routes (`/api/vital-signs`)

- `GET /api/vital-signs` - List vital signs
- `POST /api/vital-signs/store` - Create vital signs
- `GET /api/vital-signs/:id` - Get specific vital signs

**Access**: Authenticated users (typically healthcare staff)

---

### Nursing Clinical Notes Routes (`/api/nursing-clinical-notes`)

**Access**: Healthcare staff (Doctors, Nurses, Admin)

#### Main Routes:
- `GET /api/nursing-clinical-notes/:id` - Get nursing clinical note
- `PUT /api/nursing-clinical-notes/:id` - Update nursing clinical note

#### Vital Signs:
- `GET /api/vital_signs/:noteId` - Get vital signs for note
- `POST /api/vital_signs/:noteId` - Auto-save vital signs

#### Scales, Tools, Lab Data:
- `GET /api/scales_tools_lab_data/:noteId` - Get scales/tools/lab data
- `POST /api/scales_tools_lab_data/:noteId` - Auto-save scales/tools/lab data

#### Pain Data:
- `GET /api/pain_data/:noteId` - Get pain data
- `POST /api/pain_data/:noteId` - Auto-save pain data

#### PainAD Data:
- `GET /api/painad_data/:noteId` - Get PainAD data
- `POST /api/painad_data/:noteId` - Auto-save PainAD data

#### FLACC Data:
- `GET /api/flacc_data/:noteId` - Get FLACC data
- `POST /api/flacc_data/:noteId` - Auto-save FLACC data

#### Cardiovascular Data:
- `GET /api/cardiovascular_data/:noteId` - Get cardiovascular data
- `POST /api/cardiovascular_data/:noteId` - Auto-save cardiovascular data

#### Respiratory Data:
- `GET /api/respiratory_data/:noteId` - Get respiratory data
- `POST /api/respiratory_data/:noteId` - Auto-save respiratory data

#### Genitourinary Data:
- `GET /api/genitourinary_data/:noteId` - Get genitourinary data
- `POST /api/genitourinary_data/:noteId` - Auto-save genitourinary data

#### Gastrointestinal Data:
- `GET /api/gastrointestinal_data/:noteId` - Get gastrointestinal data
- `POST /api/gastrointestinal_data/:noteId` - Auto-save gastrointestinal data

---

### Pain Assessment Routes (`/api/patient/*`)

**Access**: Healthcare staff

#### Pain Type Routes (GET):
- `GET /api/patient/pain-type/breakthrough`
- `GET /api/patient/pain-type/character`
- `GET /api/patient/pain-type/frequency`
- `GET /api/patient/pain-type/observation`
- `GET /api/patient/pain-type/effects-on-function`
- `GET /api/patient/pain-type/rating-scale-used`
- `GET /api/patient/pain-type/rated-by`
- `GET /api/patient/pain-type/worsened`
- `GET /api/patient/pain-type/relieved-by`
- `GET /api/patient/pain-type/duration`
- `GET /api/patient/pain-type/negative-vocalization`
- `GET /api/patient/pain-type/facial-expression`
- `GET /api/patient/pain-type/body-language`
- `GET /api/patient/pain-type/consolability`
- `GET /api/patient/pain-type/breathing`
- `GET /api/patient/pain-type/face`
- `GET /api/patient/pain-type/legs`
- `GET /api/patient/pain-type/activity`
- `GET /api/patient/pain-type/cry`
- `GET /api/patient/pain-type/pain-serverity`
- `GET /api/patient/pain-type/standardized-pain-tool`
- `GET /api/patient/pain-type/comprehensive-pain-included`
- `GET /api/patient/pain-type/flaacc-behavioral-consolability`

#### Pain Assessment Routes:
- `GET /api/patient/pain-assessment` - List pain assessments
- `GET /api/patient/pain-assessment/:id` - Get specific pain assessment
- `POST /api/patient/pain-assessment/store` - Create pain assessment
- `POST /api/patient/pain-rated-by/store` - Create pain rated by
- `GET /api/patient/pain-rated-by/:id` - Get pain rated by
- `POST /api/patient/pain-duration/store` - Create pain duration
- `GET /api/patient/pain-duration/:id` - Get pain duration
- `POST /api/patient/pain-frequency/store` - Create pain frequency
- `GET /api/patient/pain-frequency/:id` - Get pain frequency
- `POST /api/patient/pain-observation/store` - Create pain observation
- `GET /api/patient/pain-observation/:id` - Get pain observation
- `POST /api/patient/pain-worsened-by/store` - Create pain worsened by
- `GET /api/patient/pain-worsened-by/:id` - Get pain worsened by
- `POST /api/patient/pain-character/store` - Create pain character
- `GET /api/patient/pain-character/:id` - Get pain character
- `POST /api/patient/pain-relieved-by/store` - Create pain relieved by
- `GET /api/patient/pain-relieved-by/:id` - Get pain relieved by
- `POST /api/patient/pain-effects-on-function/store` - Create pain effects on function
- `GET /api/patient/pain-effects-on-function/:id` - Get pain effects on function
- `POST /api/patient/pain-breakthrough/store` - Create pain breakthrough
- `GET /api/patient/pain-breakthrough/:id` - Get pain breakthrough
- `POST /api/patient/pain-rating-scale/store` - Create pain rating scale
- `GET /api/patient/pain-rating-scale/:id` - Get pain rating scale
- `POST /api/patient/pain-vital-signs/store` - Create pain vital signs
- `GET /api/patient/pain-vital-signs/:id` - Get pain vital signs
- `POST /api/patient/pain-scales-tools-lab-data-reviews/store` - Create pain scales tools lab data reviews
- `GET /api/patient/pain-scales-tools-lab-data-reviews/:id` - Get pain scales tools lab data reviews
- `POST /api/patient/pain-assessment-in-dementia-scale/store` - Create pain assessment in dementia scale
- `GET /api/patient/pain-assessment-in-dementia-scale/:id` - Get pain assessment in dementia scale
- `POST /api/patient/flacc-behavioral-pain/store` - Create FLACC behavioral pain
- `GET /api/patient/flacc-behavioral-pain/:id` - Get FLACC behavioral pain
- `POST /api/patient/pain-screening/store` - Create pain screening
- `GET /api/patient/pain-screening/:id` - Get pain screening
- `POST /api/patient/pain-active-problem/store` - Create pain active problem
- `GET /api/patient/pain-active-problem/:id` - Get pain active problem
- `POST /api/patient/pain-summary-interventions-goals/store` - Create pain summary interventions goals
- `GET /api/patient/pain-summary-interventions-goals/:id` - Get pain summary interventions goals
- `POST /api/patient/comprehensive-pain-assessment/store` - Create comprehensive pain assessment
- `GET /api/patient/comprehensive-pain-assessment/:id` - Get comprehensive pain assessment

---

### User Management Routes (`/api/users`)

**Access**: Typically Admin or authenticated users

- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

---

### Role Management Routes (`/api/roles`)

**Access**: Admin only

- `GET /api/roles` - List all roles
- `POST /api/role/store` - Create role
- `GET /api/role/:id` - Get specific role
- `PUT /api/role/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

---

### RBAC Routes (`/api/rbac`)

**Access**: Varies by endpoint

- `GET /api/rbac/roles` - Get all roles (Admin only)
- `GET /api/rbac/permissions` - Get all permissions (Admin only)
- `GET /api/rbac/my-permissions` - Get current user's permissions (Any authenticated user)
- `GET /api/rbac/roles/:role/permissions` - Get permissions for a role (Admin only)
- `POST /api/rbac/users/:userId/role` - Assign role to user (Admin only)

---

### Permission Management Routes (`/api/permissions`)

**Access**: Typically Admin or authenticated users

- `GET /api/permissions` - List all permissions
- `GET /api/permissions/list` - Get permission list
- `POST /api/permissions/store` - Create permission
- `GET /api/permissions/:id` - Get specific permission
- `PUT /api/permissions/:id` - Update permission
- `DELETE /api/permissions/:id` - Delete permission

---

### Audit Routes (`/api/audit`)

**Access**: Admin for all logs, users for their own logs

- `GET /api/audit` - Get all audit logs (Admin only)
- `GET /api/audit/:id` - Get specific audit log (Admin only)
- `GET /api/audit/user/logs` - Get current user's audit logs (Any authenticated user)

---

### ABAC Demo Routes (`/api/abac-demo`)

**Access**: Varies by route

- `GET /api/abac-demo/rbac-only/admin` - Admin only access
- `GET /api/abac-demo/rbac-only/healthcare` - Healthcare staff (Admin, Doctor, Nurse)
- `GET /api/abac-demo/abac-only/patient/:id` - ABAC-based patient record access
- `GET /api/abac-demo/rbac-and-abac/patient/:id` - Requires both RBAC and ABAC
- `GET /api/abac-demo/rbac-or-abac/patient/:id` - Requires either RBAC or ABAC
- `GET /api/abac-demo/complex-access/patient/:id` - Complex access control demo

---

### CASL Demo Routes (`/api/casl-demo`)

- Demo routes for CASL authorization library

---

### HIS PDF Routes (`/api/his-pdf`)

**Access**: Authenticated users (typically healthcare staff)

- Routes for generating HIS (Health Information System) PDFs

---

### Additional Patient-Related Routes

#### Visit Information (`/api/visit-information/*`)
- Visit information routes

#### Admission Information (`/api/admission-information/*`)
- Admission information routes

#### Discharge (`/api/discharge/*`)
- Discharge routes

#### DME Provider (`/api/dme-provider/*`)
- DME provider routes

#### DNR (`/api/dnr/*`)
- DNR (Do Not Resuscitate) routes

#### Emergency Preparedness Level (`/api/emergency-preparedness-level/*`)
- Emergency preparedness level routes

#### Liaison Primary (`/api/liaison-primary/*`)
- Liaison primary routes

#### Liaison Secondary (`/api/liaison-secondary/*`)
- Liaison secondary routes

#### Race Ethnicity (`/api/race-ethnicity/*`)
- Race ethnicity routes

---

## Role-Based Access Summary

### Admin
- Full access to all routes
- User management
- Role and permission management
- Audit logs
- Can delete patients

### Doctor
- Create and manage patients
- View all patients
- Create and update clinical notes
- Manage vital signs and medications
- Generate reports
- Cannot delete patients

### Nurse
- View patients
- Update patient information
- Create and update clinical notes
- View and create vital signs
- View medications
- Cannot create patients or delete records

### Staff
- View patients (read-only)
- View clinical notes (read-only)
- View vital signs (read-only)
- View medications (read-only)
- Limited access for support functions

### Patient
- View own patient record
- Limited access to personal information only

---

## Notes

1. All routes (except health check and auth) require authentication via Better Auth
2. Most routes use RBAC (Role-Based Access Control) for authorization
3. Some routes use ABAC (Attribute-Based Access Control) for more granular control
4. Patient routes allow patients to view their own records
5. Admin has full access to all routes
6. Healthcare staff (Doctor, Nurse) have broad access to patient management
7. Staff role has read-only access to most patient information

---

## To Check User Counts

Run the following script (requires DATABASE_URL):
```bash
node check_user_roles.js
```

This will display:
- Total count of users by role
- List of all nurses with their details
- List of all doctors with their details
- List of all staff with their details


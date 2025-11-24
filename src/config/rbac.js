// RBAC Configuration for the application
// Role-Based Access Control with ABAC integration

// Define roles
export const ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  NURSE: "nurse",
  PATIENT: "patient",
  STAFF: "staff",
};

// Define permissions
export const PERMISSIONS = {
  // Patient Management
  VIEW_PATIENT: "view:patient",
  CREATE_PATIENT: "create:patient",
  UPDATE_PATIENT: "update:patient",
  DELETE_PATIENT: "delete:patient",

  // Clinical Notes
  VIEW_CLINICAL_NOTES: "view:clinical_notes",
  CREATE_CLINICAL_NOTES: "create:clinical_notes",
  UPDATE_CLINICAL_NOTES: "update:clinical_notes",
  DELETE_CLINICAL_NOTES: "delete:clinical_notes",

  // Vital Signs
  VIEW_VITAL_SIGNS: "view:vital_signs",
  CREATE_VITAL_SIGNS: "create:vital_signs",
  UPDATE_VITAL_SIGNS: "update:vital_signs",
  DELETE_VITAL_SIGNS: "delete:vital_signs",

  // Medications
  VIEW_MEDICATIONS: "view:medications",
  CREATE_MEDICATIONS: "create:medications",
  UPDATE_MEDICATIONS: "update:medications",
  DELETE_MEDICATIONS: "delete:medications",

  // Reports
  VIEW_REPORTS: "view:reports",
  GENERATE_REPORTS: "generate:reports",

  // Admin
  MANAGE_USERS: "manage:users",
  MANAGE_ROLES: "manage:roles",
  MANAGE_PERMISSIONS: "manage:permissions",
  VIEW_AUDIT_LOGS: "view:audit_logs",
};

// Define role-permission mappings
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_PATIENT,
    PERMISSIONS.CREATE_PATIENT,
    PERMISSIONS.UPDATE_PATIENT,
    PERMISSIONS.DELETE_PATIENT,
    PERMISSIONS.VIEW_CLINICAL_NOTES,
    PERMISSIONS.CREATE_CLINICAL_NOTES,
    PERMISSIONS.UPDATE_CLINICAL_NOTES,
    PERMISSIONS.DELETE_CLINICAL_NOTES,
    PERMISSIONS.VIEW_VITAL_SIGNS,
    PERMISSIONS.CREATE_VITAL_SIGNS,
    PERMISSIONS.UPDATE_VITAL_SIGNS,
    PERMISSIONS.DELETE_VITAL_SIGNS,
    PERMISSIONS.VIEW_MEDICATIONS,
    PERMISSIONS.CREATE_MEDICATIONS,
    PERMISSIONS.UPDATE_MEDICATIONS,
    PERMISSIONS.DELETE_MEDICATIONS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_PERMISSIONS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
  ],

  [ROLES.DOCTOR]: [
    PERMISSIONS.VIEW_PATIENT,
    PERMISSIONS.CREATE_PATIENT,
    PERMISSIONS.UPDATE_PATIENT,
    PERMISSIONS.VIEW_CLINICAL_NOTES,
    PERMISSIONS.CREATE_CLINICAL_NOTES,
    PERMISSIONS.UPDATE_CLINICAL_NOTES,
    PERMISSIONS.VIEW_VITAL_SIGNS,
    PERMISSIONS.CREATE_VITAL_SIGNS,
    PERMISSIONS.UPDATE_VITAL_SIGNS,
    PERMISSIONS.VIEW_MEDICATIONS,
    PERMISSIONS.CREATE_MEDICATIONS,
    PERMISSIONS.UPDATE_MEDICATIONS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.GENERATE_REPORTS,
  ],

  [ROLES.NURSE]: [
    PERMISSIONS.VIEW_PATIENT,
    PERMISSIONS.UPDATE_PATIENT,
    PERMISSIONS.VIEW_CLINICAL_NOTES,
    PERMISSIONS.CREATE_CLINICAL_NOTES,
    PERMISSIONS.UPDATE_CLINICAL_NOTES,
    PERMISSIONS.VIEW_VITAL_SIGNS,
    PERMISSIONS.CREATE_VITAL_SIGNS,
    PERMISSIONS.UPDATE_VITAL_SIGNS,
    PERMISSIONS.VIEW_MEDICATIONS,
  ],

  [ROLES.PATIENT]: [PERMISSIONS.VIEW_PATIENT],

  [ROLES.STAFF]: [
    PERMISSIONS.VIEW_PATIENT,
    PERMISSIONS.VIEW_CLINICAL_NOTES,
    PERMISSIONS.VIEW_VITAL_SIGNS,
    PERMISSIONS.VIEW_MEDICATIONS,
  ],
};

// Helper function to check if a role has a specific permission
export function hasPermission(role, permission) {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
}

// Helper function to check if a user has a specific permission
export function userHasPermission(userRole, requiredPermission) {
  return hasPermission(userRole, requiredPermission);
}

// Helper function to check if a user has any of the required permissions
export function userHasAnyPermission(userRole, requiredPermissions) {
  return requiredPermissions.some((permission) =>
    hasPermission(userRole, permission)
  );
}

// Helper function to check if a user has all of the required permissions
export function userHasAllPermissions(userRole, requiredPermissions) {
  return requiredPermissions.every((permission) =>
    hasPermission(userRole, permission)
  );
}

export default {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  userHasPermission,
  userHasAnyPermission,
  userHasAllPermissions,
};

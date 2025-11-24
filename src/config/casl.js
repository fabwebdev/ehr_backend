import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from "./rbac.js";

// Define CASL actions and subjects
export const ACTIONS = {
  MANAGE: "manage", // Wildcard for any action
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  VIEW: "view", // Custom action for viewing
  GENERATE: "generate", // Custom action for generating reports
};

export const SUBJECTS = {
  PATIENT: "Patient",
  CLINICAL_NOTE: "ClinicalNote",
  VITAL_SIGN: "VitalSign",
  MEDICATION: "Medication",
  REPORT: "Report",
  USER: "User",
  ROLE: "Role",
  PERMISSION: "Permission",
  AUDIT_LOG: "AuditLog",
  ALL: "all", // Wildcard for any subject
};

// Map RBAC permissions to CASL actions and subjects
const permissionToCaslMap = {
  // Patient Management
  [PERMISSIONS.VIEW_PATIENT]: {
    action: ACTIONS.VIEW,
    subject: SUBJECTS.PATIENT,
  },
  [PERMISSIONS.CREATE_PATIENT]: {
    action: ACTIONS.CREATE,
    subject: SUBJECTS.PATIENT,
  },
  [PERMISSIONS.UPDATE_PATIENT]: {
    action: ACTIONS.UPDATE,
    subject: SUBJECTS.PATIENT,
  },
  [PERMISSIONS.DELETE_PATIENT]: {
    action: ACTIONS.DELETE,
    subject: SUBJECTS.PATIENT,
  },

  // Clinical Notes
  [PERMISSIONS.VIEW_CLINICAL_NOTES]: {
    action: ACTIONS.VIEW,
    subject: SUBJECTS.CLINICAL_NOTE,
  },
  [PERMISSIONS.CREATE_CLINICAL_NOTES]: {
    action: ACTIONS.CREATE,
    subject: SUBJECTS.CLINICAL_NOTE,
  },
  [PERMISSIONS.UPDATE_CLINICAL_NOTES]: {
    action: ACTIONS.UPDATE,
    subject: SUBJECTS.CLINICAL_NOTE,
  },
  [PERMISSIONS.DELETE_CLINICAL_NOTES]: {
    action: ACTIONS.DELETE,
    subject: SUBJECTS.CLINICAL_NOTE,
  },

  // Vital Signs
  [PERMISSIONS.VIEW_VITAL_SIGNS]: {
    action: ACTIONS.VIEW,
    subject: SUBJECTS.VITAL_SIGN,
  },
  [PERMISSIONS.CREATE_VITAL_SIGNS]: {
    action: ACTIONS.CREATE,
    subject: SUBJECTS.VITAL_SIGN,
  },
  [PERMISSIONS.UPDATE_VITAL_SIGNS]: {
    action: ACTIONS.UPDATE,
    subject: SUBJECTS.VITAL_SIGN,
  },
  [PERMISSIONS.DELETE_VITAL_SIGNS]: {
    action: ACTIONS.DELETE,
    subject: SUBJECTS.VITAL_SIGN,
  },

  // Medications
  [PERMISSIONS.VIEW_MEDICATIONS]: {
    action: ACTIONS.VIEW,
    subject: SUBJECTS.MEDICATION,
  },
  [PERMISSIONS.CREATE_MEDICATIONS]: {
    action: ACTIONS.CREATE,
    subject: SUBJECTS.MEDICATION,
  },
  [PERMISSIONS.UPDATE_MEDICATIONS]: {
    action: ACTIONS.UPDATE,
    subject: SUBJECTS.MEDICATION,
  },
  [PERMISSIONS.DELETE_MEDICATIONS]: {
    action: ACTIONS.DELETE,
    subject: SUBJECTS.MEDICATION,
  },

  // Reports
  [PERMISSIONS.VIEW_REPORTS]: {
    action: ACTIONS.VIEW,
    subject: SUBJECTS.REPORT,
  },
  [PERMISSIONS.GENERATE_REPORTS]: {
    action: ACTIONS.GENERATE,
    subject: SUBJECTS.REPORT,
  },

  // Admin
  [PERMISSIONS.MANAGE_USERS]: {
    action: ACTIONS.MANAGE,
    subject: SUBJECTS.USER,
  },
  [PERMISSIONS.MANAGE_ROLES]: {
    action: ACTIONS.MANAGE,
    subject: SUBJECTS.ROLE,
  },
  [PERMISSIONS.MANAGE_PERMISSIONS]: {
    action: ACTIONS.MANAGE,
    subject: SUBJECTS.PERMISSION,
  },
  [PERMISSIONS.VIEW_AUDIT_LOGS]: {
    action: ACTIONS.VIEW,
    subject: SUBJECTS.AUDIT_LOG,
  },
};

// Function to define user abilities based on their role
export function defineUserAbilities(user) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  // Get user role (default to patient if not specified)
  const userRole = user.role || ROLES.PATIENT;

  // Get permissions for the user's role
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];

  // Grant abilities based on role permissions
  rolePermissions.forEach((permission) => {
    const caslRule = permissionToCaslMap[permission];
    if (caslRule) {
      can(caslRule.action, caslRule.subject);
    }
  });

  // Special rules for specific roles
  switch (userRole) {
    case ROLES.ADMIN:
      // Admins can manage everything
      can(ACTIONS.MANAGE, SUBJECTS.ALL);
      break;

    case ROLES.DOCTOR:
      // Doctors can view all patients
      can(ACTIONS.VIEW, SUBJECTS.PATIENT);
      break;

    case ROLES.PATIENT:
      // Patients can only view their own records
      // This would typically be handled with ABAC, but we can add a general rule here
      can(ACTIONS.VIEW, SUBJECTS.PATIENT);
      break;
  }

  return build();
}

// Function to check if user can perform an action on a subject
export function canUser(user, action, subject) {
  const ability = defineUserAbilities(user);
  return ability.can(action, subject);
}

// Function to check if user cannot perform an action on a subject
export function cannotUser(user, action, subject) {
  const ability = defineUserAbilities(user);
  return ability.cannot(action, subject);
}

// CASL middleware for Fastify
export function requireCaslAbility(action, subject) {
  return async (request, reply) => {
    // Check if user is authenticated
    if (!request.user) {
      reply.code(401);
      return {
        status: 401,
        message: "Access denied. Authentication required.",
      };
    }

    // Check if user has the required ability
    const ability = defineUserAbilities(request.user);
    if (ability.cannot(action, subject)) {
      reply.code(403);
      return {
        status: 403,
        message: "Access denied. Insufficient permissions.",
      };
    }

    // Attach ability to request for further use
    request.ability = ability;
  };
}

export default {
  ACTIONS,
  SUBJECTS,
  defineUserAbilities,
  canUser,
  cannotUser,
  requireCaslAbility,
};

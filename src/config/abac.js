// ABAC Configuration for the application
// Attribute-Based Access Control policies

// Define attributes that can be used in ABAC policies
export const ATTRIBUTES = {
  // User attributes
  USER_ID: "userId",
  USER_ROLE: "userRole",
  USER_DEPARTMENT: "userDepartment",
  USER_LOCATION: "userLocation",

  // Resource attributes
  RESOURCE_OWNER_ID: "resourceOwnerId",
  RESOURCE_TYPE: "resourceType",
  RESOURCE_DEPARTMENT: "resourceDepartment",
  RESOURCE_LOCATION: "resourceLocation",

  // Environment attributes
  TIME_OF_DAY: "timeOfDay",
  DAY_OF_WEEK: "dayOfWeek",
  IP_ADDRESS: "ipAddress",
  DEVICE_TYPE: "deviceType",
};

// Define ABAC policies
// Each policy is a function that takes context (user, resource, environment) and returns true/false
export const ABAC_POLICIES = {
  // Patient can only view their own records
  patientViewOwnRecords: (context) => {
    const { user, resource } = context;
    return (
      user.role === "patient" &&
      resource.type === "patient_record" &&
      user.id === resource.ownerId
    );
  },

  // Healthcare staff can only access records in their department
  healthcareStaffDepartmentAccess: (context) => {
    const { user, resource } = context;
    const healthcareRoles = ["doctor", "nurse", "staff"];
    return (
      healthcareRoles.includes(user.role) &&
      user.department === resource.department
    );
  },

  // Admins can access all records
  adminFullAccess: (context) => {
    const { user } = context;
    return user.role === "admin";
  },

  // Doctors can view all patient records
  doctorViewAllPatients: (context) => {
    const { user, resource } = context;
    return user.role === "doctor" && resource.type === "patient_record";
  },

  // Restricted hours policy (9AM-5PM access only)
  businessHoursOnly: (context) => {
    const { environment } = context;
    const hour = new Date().getHours();
    return hour >= 9 && hour < 17;
  },

  // Location-based access policy
  locationBasedAccess: (context) => {
    const { user, environment } = context;
    // Allow access if user's location matches request IP location
    // This is a simplified example - in practice, you'd use a geolocation service
    return user.location === environment.ipLocation;
  },
};

// Helper function to evaluate ABAC policies
export function evaluatePolicies(policies, context) {
  // All policies must return true for access to be granted
  return policies.every((policy) => {
    if (typeof policy === "function") {
      return policy(context);
    } else if (typeof policy === "string" && ABAC_POLICIES[policy]) {
      return ABAC_POLICIES[policy](context);
    }
    return false;
  });
}

// Helper function to check if user has access based on ABAC policies
export function hasAbacAccess(user, resource, environment = {}) {
  // Create context object for policies
  const context = {
    user: {
      id: user.id,
      role: user.role,
      department: user.department || null,
      location: user.location || null,
      ...user.attributes, // Any additional user attributes
    },
    resource: {
      type: resource.type || null,
      ownerId: resource.ownerId || null,
      department: resource.department || null,
      location: resource.location || null,
      ...resource.attributes, // Any additional resource attributes
    },
    environment: {
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      ...environment, // Any additional environment attributes
    },
  };

  // Determine which policies to apply based on user role and resource type
  let policiesToApply = [];

  // Admins always have access
  if (user.role === "admin") {
    policiesToApply.push(ABAC_POLICIES.adminFullAccess);
  }

  // Doctors can view all patient records, but only during business hours
  if (user.role === "doctor" && resource.type === "patient_record") {
    policiesToApply.push(ABAC_POLICIES.doctorViewAllPatients);
    policiesToApply.push(ABAC_POLICIES.businessHoursOnly);
  }

  // Patients can only view their own records
  if (user.role === "patient" && resource.type === "patient_record") {
    policiesToApply.push(ABAC_POLICIES.patientViewOwnRecords);
  }

  // Healthcare staff can access records in their department
  const healthcareRoles = ["doctor", "nurse", "staff"];
  if (healthcareRoles.includes(user.role) && resource.department) {
    policiesToApply.push(ABAC_POLICIES.healthcareStaffDepartmentAccess);
  }

  // If no specific policies apply, deny access
  if (policiesToApply.length === 0) {
    return false;
  }

  // Evaluate all applicable policies
  return evaluatePolicies(policiesToApply, context);
}

export default {
  ATTRIBUTES,
  ABAC_POLICIES,
  evaluatePolicies,
  hasAbacAccess,
};

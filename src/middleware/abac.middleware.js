import { hasAbacAccess } from "../config/abac.js";

/**
 * Middleware to check if user has access based on ABAC policies
 * @param {Object} resource - The resource being accessed
 * @param {Object} options - Additional options for ABAC evaluation
 */
export const requireAbacAccess = (resource, options = {}) => {
  return async (request, reply) => {
    // Check if user is authenticated
    if (!request.user) {
      return reply.code(401).send({
        status: 401,
        message: "Access denied. Authentication required.",
      });
    }

    // Prepare resource object for ABAC evaluation
    const resourceObj = {
      type: resource.type || "unknown",
      ownerId: resource.ownerId || null,
      department: resource.department || null,
      location: resource.location || null,
      ...resource,
    };

    // Prepare environment object
    const environment = {
      ipAddress: request.ip || request.socket.remoteAddress,
      userAgent: request.headers["user-agent"],
      ...options.environment,
    };

    // Check ABAC access
    const hasAccess = hasAbacAccess(request.user, resourceObj, environment);

    if (!hasAccess) {
      return reply.code(403).send({
        status: 403,
        message: "Access denied. Insufficient attributes or policy violation.",
      });
    }
  };
};

/**
 * Middleware to check if user has access to a patient record
 * @param {Function} getPatientId - Function to extract patient ID from request
 */
export const requirePatientRecordAccess = (
  getPatientId = (request) => request.params.id
) => {
  return async (request, reply) => {
    // Check if user is authenticated
    if (!request.user) {
      return reply.code(401).send({
        status: 401,
        message: "Access denied. Authentication required.",
      });
    }

    try {
      // Get patient ID from request
      const patientId = getPatientId(request);

      if (!patientId) {
        return reply.code(400).send({
          status: 400,
          message: "Patient ID is required for access control.",
        });
      }

      // Prepare resource object for patient record
      const resource = {
        type: "patient_record",
        ownerId: parseInt(patientId),
        // In a real implementation, you would fetch the patient's department from the database
        department: "general", // Default department
      };

      // Prepare environment object
      const environment = {
        ipAddress: request.ip || request.socket.remoteAddress,
        userAgent: request.headers["user-agent"],
      };

      // Check ABAC access
      const hasAccess = hasAbacAccess(request.user, resource, environment);

      if (!hasAccess) {
        return reply.code(403).send({
          status: 403,
          message:
            "Access denied. You do not have permission to access this patient record.",
        });
      }
    } catch (error) {
      console.error("Error in patient record access control:", error);
      return reply.code(500).send({
        status: 500,
        message: "Server error during access control check.",
      });
    }
  };
};

/**
 * Middleware to check if user has access based on both RBAC and ABAC
 * @param {Array} requiredPermissions - Permissions required (RBAC)
 * @param {Object} resource - The resource being accessed (ABAC)
 * @param {Object} options - Additional options
 */
export const requireRbacAndAbac = (
  requiredPermissions,
  resource,
  options = {}
) => {
  return async (request, reply) => {
    try {
      // First check RBAC permissions
      const { userHasAllPermissions } = await import("../config/rbac.js");
      
      // Check if user is authenticated
      if (!request.user) {
        return reply.code(401).send({
          status: 401,
          message: "Access denied. Authentication required.",
        });
      }

      // Check RBAC permissions
      const userRole = request.user.role || "patient"; // Default to patient if no role specified
      const hasAllPermissions = requiredPermissions.every((permission) =>
        userHasAllPermissions(userRole, [permission])
      );

      if (!hasAllPermissions) {
        return reply.code(403).send({
          status: 403,
          message: "Access denied. Insufficient RBAC permissions.",
        });
      }

      // If RBAC passes, check ABAC
      const resourceObj = {
        type: resource.type || "unknown",
        ownerId: resource.ownerId || null,
        department: resource.department || null,
        location: resource.location || null,
        ...resource,
      };

      const environment = {
        ipAddress: request.ip || request.socket.remoteAddress,
        userAgent: request.headers["user-agent"],
        ...options.environment,
      };

      const hasAccess = hasAbacAccess(request.user, resourceObj, environment);

      if (!hasAccess) {
        return reply.code(403).send({
          status: 403,
          message: "Access denied. ABAC policy violation.",
        });
      }
    } catch (error) {
      console.error("Error importing RBAC module:", error);
      return reply.code(500).send({
        status: 500,
        message: "Server error during access control check.",
      });
    }
  };
};

/**
 * Middleware to check if user has access based on either RBAC or ABAC
 * @param {Array} requiredPermissions - Permissions required (RBAC)
 * @param {Object} resource - The resource being accessed (ABAC)
 * @param {Object} options - Additional options
 */
export const requireRbacOrAbac = (
  requiredPermissions,
  resource,
  options = {}
) => {
  return async (request, reply) => {
    try {
      // Check if user is authenticated
      if (!request.user) {
        return reply.code(401).send({
          status: 401,
          message: "Access denied. Authentication required.",
        });
      }

      // Check RBAC permissions
      const { userHasAllPermissions } = await import("../config/rbac.js");
      const userRole = request.user.role || "patient"; // Default to patient if no role specified
      const hasRbacAccess = requiredPermissions.every((permission) =>
        userHasAllPermissions(userRole, [permission])
      );

      // Check ABAC access
      const resourceObj = {
        type: resource.type || "unknown",
        ownerId: resource.ownerId || null,
        department: resource.department || null,
        location: resource.location || null,
        ...resource,
      };

      const environment = {
        ipAddress: request.ip || request.socket.remoteAddress,
        userAgent: request.headers["user-agent"],
        ...options.environment,
      };

      const hasAbacAccessResult = hasAbacAccess(
        request.user,
        resourceObj,
        environment
      );

      // Allow access if either RBAC or ABAC passes
      if (!hasRbacAccess && !hasAbacAccessResult) {
        return reply.code(403).send({
          status: 403,
          message:
            "Access denied. Neither RBAC permissions nor ABAC policies allow access.",
        });
      }
    } catch (error) {
      console.error("Error importing RBAC module:", error);
      return reply.code(500).send({
        status: 500,
        message: "Server error during access control check.",
      });
    }
  };
};

export default {
  requireAbacAccess,
  requirePatientRecordAccess,
  requireRbacAndAbac,
  requireRbacOrAbac,
};

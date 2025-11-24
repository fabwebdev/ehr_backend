import { ROLES, PERMISSIONS, userHasPermission } from '../config/rbac.js';

/**
 * Middleware to check if user has a specific role
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 */
export const requireRole = (...allowedRoles) => {
  return async (request, reply) => {
    // Check if user is authenticated
    if (!request.user) {
      return reply.code(401).send({
        status: 401,
        message: 'Access denied. Authentication required.'
      });
    }

    // Check if user has one of the allowed roles
    const userRole = request.user.role || ROLES.PATIENT; // Default to patient if no role specified
    if (!allowedRoles.includes(userRole)) {
      return reply.code(403).send({
        status: 403,
        message: 'Access denied. Insufficient permissions.'
      });
    }
  };
};

/**
 * Middleware to check if user has specific permissions
 * @param {...string} requiredPermissions - Permissions required to access the route
 */
export const requirePermission = (...requiredPermissions) => {
  return async (request, reply) => {
    // Check if user is authenticated
    if (!request.user) {
      return reply.code(401).send({
        status: 401,
        message: 'Access denied. Authentication required.'
      });
    }

    // Check if user has all required permissions
    const userRole = request.user.role || ROLES.PATIENT; // Default to patient if no role specified
    const hasAllPermissions = requiredPermissions.every(permission => 
      userHasPermission(userRole, permission)
    );

    if (!hasAllPermissions) {
      return reply.code(403).send({
        status: 403,
        message: 'Access denied. Insufficient permissions.'
      });
    }
  };
};

/**
 * Middleware to check if user has any of the specified permissions
 * @param {...string} requiredPermissions - Permissions where having any is sufficient
 */
export const requireAnyPermission = (...requiredPermissions) => {
  return async (request, reply) => {
    // Check if user is authenticated
    if (!request.user) {
      return reply.code(401).send({
        status: 401,
        message: 'Access denied. Authentication required.'
      });
    }

    // Check if user has any of the required permissions
    const userRole = request.user.role || ROLES.PATIENT; // Default to patient if no role specified
    const hasAnyPermission = requiredPermissions.some(permission => 
      userHasPermission(userRole, permission)
    );

    if (!hasAnyPermission) {
      return reply.code(403).send({
        status: 403,
        message: 'Access denied. Insufficient permissions.'
      });
    }
  };
};

/**
 * Middleware to check if user is an admin
 */
export const requireAdmin = requireRole(ROLES.ADMIN);

/**
 * Middleware to check if user is a doctor or admin
 */
export const requireMedicalStaff = requireRole(ROLES.ADMIN, ROLES.DOCTOR);

/**
 * Middleware to check if user is healthcare staff (doctor, nurse, or admin)
 */
export const requireHealthcareStaff = requireRole(ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE);

export default {
  requireRole,
  requirePermission,
  requireAnyPermission,
  requireAdmin,
  requireMedicalStaff,
  requireHealthcareStaff
};
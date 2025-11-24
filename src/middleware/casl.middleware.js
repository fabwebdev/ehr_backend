import { defineUserAbilities } from "../config/casl.js";

/**
 * Middleware to inject CASL abilities into the request object
 * This middleware should be used after authentication middleware
 */
export const injectCaslAbility = async (request, reply) => {
  // Check if user is authenticated
  if (!request.user) {
    return reply.code(401).send({
      status: 401,
      message: "Access denied. Authentication required.",
    });
  }

  // Create and attach user abilities
  request.ability = defineUserAbilities(request.user);
};

/**
 * Middleware to check if user can perform a specific action on a subject
 * @param {string} action - The action to check (e.g., 'read', 'create', 'update', 'delete')
 * @param {string} subject - The subject to check (e.g., 'Patient', 'User')
 */
export const requireCaslAbility = (action, subject) => {
  return async (request, reply) => {
    // Check if user is authenticated
    if (!request.user) {
      return reply.code(401).send({
        status: 401,
        message: "Access denied. Authentication required.",
      });
    }

    // Ensure abilities are available
    if (!request.ability) {
      request.ability = defineUserAbilities(request.user);
    }

    // Check if user has the required ability
    if (request.ability.cannot(action, subject)) {
      return reply.code(403).send({
        status: 403,
        message: "Access denied. Insufficient permissions.",
      });
    }
  };
};

/**
 * Middleware to check if user can perform any of the specified actions on a subject
 * @param {Array} actions - Array of actions to check
 * @param {string} subject - The subject to check
 */
export const requireAnyCaslAbility = (actions, subject) => {
  return async (request, reply) => {
    // Check if user is authenticated
    if (!request.user) {
      return reply.code(401).send({
        status: 401,
        message: "Access denied. Authentication required.",
      });
    }

    // Ensure abilities are available
    if (!request.ability) {
      request.ability = defineUserAbilities(request.user);
    }

    // Check if user has any of the required abilities
    const hasAnyAbility = actions.some((action) =>
      request.ability.can(action, subject)
    );

    if (!hasAnyAbility) {
      return reply.code(403).send({
        status: 403,
        message: "Access denied. Insufficient permissions.",
      });
    }
  };
};

/**
 * Middleware to check if user can perform all of the specified actions on a subject
 * @param {Array} actions - Array of actions to check
 * @param {string} subject - The subject to check
 */
export const requireAllCaslAbilities = (actions, subject) => {
  return async (request, reply) => {
    // Check if user is authenticated
    if (!request.user) {
      return reply.code(401).send({
        status: 401,
        message: "Access denied. Authentication required.",
      });
    }

    // Ensure abilities are available
    if (!request.ability) {
      request.ability = defineUserAbilities(request.user);
    }

    // Check if user has all of the required abilities
    const hasAllAbilities = actions.every((action) =>
      request.ability.can(action, subject)
    );

    if (!hasAllAbilities) {
      return reply.code(403).send({
        status: 403,
        message: "Access denied. Insufficient permissions.",
      });
    }
  };
};

export default {
  injectCaslAbility,
  requireCaslAbility,
  requireAnyCaslAbility,
  requireAllCaslAbilities,
};

import { authenticate } from "../middleware/betterAuth.middleware.js";
import {
  requireRole,
  requirePermission,
} from "../middleware/rbac.middleware.js";
import {
  requireAbacAccess,
  requirePatientRecordAccess,
  requireRbacAndAbac,
  requireRbacOrAbac,
} from "../middleware/abac.middleware.js";
import { ROLES, PERMISSIONS } from "../config/rbac.js";

// Fastify plugin for ABAC demo routes
async function abacDemoRoutes(fastify, options) {
  // Demo route showing RBAC only - Admins can access
  fastify.get(
    "/rbac-only/admin",
    {
      preHandler: [authenticate, requireRole(ROLES.ADMIN)],
    },
    async (request, reply) => {
      return {
        status: 200,
        message: "RBAC Only: Admins can access this route",
        user: request.user,
      };
    }
  );

  // Demo route showing RBAC only - Healthcare staff can access
  fastify.get(
    "/rbac-only/healthcare",
    {
      preHandler: [authenticate, requireRole(ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE)],
    },
    async (request, reply) => {
      return {
        status: 200,
        message: "RBAC Only: Healthcare staff can access this route",
        user: request.user,
      };
    }
  );

  // Demo route showing ABAC only - Access based on patient record ownership
  fastify.get(
    "/abac-only/patient/:id",
    {
      preHandler: [authenticate, requirePatientRecordAccess((request) => request.params.id)],
    },
    async (request, reply) => {
      return {
        status: 200,
        message: "ABAC Only: Access granted based on patient record ownership",
        user: request.user,
        patientId: request.params.id,
      };
    }
  );

  // Demo route showing RBAC and ABAC together - User must have permission AND satisfy ABAC policies
  fastify.get(
    "/rbac-and-abac/patient/:id",
    {
      preHandler: [
        authenticate,
        requireRbacAndAbac([PERMISSIONS.VIEW_PATIENT], {
          type: "patient_record",
          ownerId: null /* will be set dynamically */,
        }),
      ],
    },
    async (request, reply) => {
      return {
        status: 200,
        message:
          "RBAC and ABAC: Both permission and attribute policies satisfied",
        user: request.user,
        patientId: request.params.id,
      };
    }
  );

  // Demo route showing RBAC or ABAC - User can satisfy either RBAC permissions or ABAC policies
  fastify.get(
    "/rbac-or-abac/patient/:id",
    {
      preHandler: [
        authenticate,
        requireRbacOrAbac([PERMISSIONS.VIEW_PATIENT], {
          type: "patient_record",
          ownerId: null /* will be set dynamically */,
        }),
      ],
    },
    async (request, reply) => {
      return {
        status: 200,
        message:
          "RBAC or ABAC: Either permission or attribute policies satisfied",
        user: request.user,
        patientId: request.params.id,
      };
    }
  );

  // Demo route showing complex access control - Admins always have access, doctors have access during business hours
  fastify.get(
    "/complex-access/patient/:id",
    {
      preHandler: [
        authenticate,
        async (request, reply) => {
          // First check if user is admin (they always have access)
          if (request.user.role === ROLES.ADMIN) {
            return;
          }

          // For non-admins, apply ABAC access control
          await requirePatientRecordAccess((request) => request.params.id)(request, reply);
        },
      ],
    },
    async (request, reply) => {
      return {
        status: 200,
        message:
          "Complex Access Control: Access granted based on role and attributes",
        user: request.user,
        patientId: request.params.id,
      };
    }
  );
}

export default abacDemoRoutes;

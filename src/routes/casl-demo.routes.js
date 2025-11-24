import { authenticate } from "../middleware/betterAuth.middleware.js";
import {
  injectCaslAbility,
  requireCaslAbility,
  requireAnyCaslAbility,
  requireAllCaslAbilities,
} from "../middleware/casl.middleware.js";
import { ACTIONS, SUBJECTS, canUser } from "../config/casl.js";

// Fastify plugin for CASL demo routes
async function caslDemoRoutes(fastify, options) {
  // Apply authentication middleware to all routes in this plugin
  fastify.addHook("onRequest", authenticate);
  
  // Inject CASL abilities into the request object
  fastify.addHook("onRequest", injectCaslAbility);

  // Demo route showing CASL ability check - Check if user can view patients
  fastify.get("/can-view-patients", async (request, reply) => {
    const canView = request.ability.can(ACTIONS.VIEW, SUBJECTS.PATIENT);
    return {
      status: 200,
      message: `User ${canView ? "can" : "cannot"} view patients`,
      user: request.user,
      canView,
    };
  });

  // Demo route showing CASL ability check - Check if user can create patients
  fastify.get("/can-create-patients", async (request, reply) => {
    const canCreate = request.ability.can(ACTIONS.CREATE, SUBJECTS.PATIENT);
    return {
      status: 200,
      message: `User ${canCreate ? "can" : "cannot"} create patients`,
      user: request.user,
      canCreate,
    };
  });

  // Demo route showing CASL middleware - Require ability to view patients
  fastify.get(
    "/require-view-patients",
    {
      preHandler: [requireCaslAbility(ACTIONS.VIEW, SUBJECTS.PATIENT)],
    },
    async (request, reply) => {
      return {
        status: 200,
        message: "CASL Middleware: User can view patients",
        user: request.user,
      };
    }
  );

  // Demo route showing CASL middleware - Require ability to create patients
  fastify.get(
    "/require-create-patients",
    {
      preHandler: [requireCaslAbility(ACTIONS.CREATE, SUBJECTS.PATIENT)],
    },
    async (request, reply) => {
      return {
        status: 200,
        message: "CASL Middleware: User can create patients",
        user: request.user,
      };
    }
  );

  // Demo route showing CASL middleware - Require any of the specified abilities
  fastify.get(
    "/require-any-patient-abilities",
    {
      preHandler: [
        requireAnyCaslAbility(
          [ACTIONS.VIEW, ACTIONS.CREATE, ACTIONS.UPDATE],
          SUBJECTS.PATIENT
        ),
      ],
    },
    async (request, reply) => {
      return {
        status: 200,
        message: "CASL Middleware: User has at least one patient-related ability",
        user: request.user,
      };
    }
  );

  // Demo route showing CASL middleware - Require all of the specified abilities
  fastify.get(
    "/require-all-patient-abilities",
    {
      preHandler: [
        requireAllCaslAbilities([ACTIONS.VIEW, ACTIONS.CREATE], SUBJECTS.PATIENT),
      ],
    },
    async (request, reply) => {
      return {
        status: 200,
        message:
          "CASL Middleware: User has all required patient-related abilities",
        user: request.user,
      };
    }
  );

  // Demo route showing manual CASL check
  fastify.get("/manual-check", async (request, reply) => {
    const canViewPatients = canUser(request.user, ACTIONS.VIEW, SUBJECTS.PATIENT);
    const canCreatePatients = canUser(request.user, ACTIONS.CREATE, SUBJECTS.PATIENT);
    const canDeletePatients = canUser(request.user, ACTIONS.DELETE, SUBJECTS.PATIENT);

    return {
      status: 200,
      message: "Manual CASL ability checks",
      user: request.user,
      abilities: {
        canViewPatients,
        canCreatePatients,
        canDeletePatients,
      },
    };
  });

  // Demo route showing admin-only access with CASL
  fastify.get(
    "/admin-only",
    {
      preHandler: [requireCaslAbility(ACTIONS.MANAGE, SUBJECTS.ALL)],
    },
    async (request, reply) => {
      return {
        status: 200,
        message: "CASL Middleware: Admin-only access granted",
        user: request.user,
      };
    }
  );
}

export default caslDemoRoutes;

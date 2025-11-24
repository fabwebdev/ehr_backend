import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../config/rbac.js';
import { verifyToken } from '../middleware/betterAuth.middleware.js';
import { requireAdmin } from '../middleware/rbac.middleware.js';

// Fastify plugin for RBAC routes
async function rbacRoutes(fastify, options) {
  // Get all roles
  fastify.get('/roles', {
    preHandler: [verifyToken, requireAdmin],
  }, async (request, reply) => {
    try {
      return {
        status: 200,
        data: {
          roles: Object.values(ROLES)
        }
      };
    } catch (error) {
      console.error('Error fetching roles:', error);
      reply.code(500);
      return {
        status: 500,
        message: 'Server error while fetching roles'
      };
    }
  });

  // Get all permissions (admin only)
  fastify.get('/permissions', {
    preHandler: [verifyToken, requireAdmin],
  }, async (request, reply) => {
    try {
      return {
        status: 200,
        data: {
          permissions: Object.values(PERMISSIONS)
        }
      };
    } catch (error) {
      console.error('Error fetching permissions:', error);
      reply.code(500);
      return {
        status: 500,
        message: 'Server error while fetching permissions'
      };
    }
  });

  // Get current user's permissions (any authenticated user)
  fastify.get('/my-permissions', {
    preHandler: [verifyToken],
  }, async (request, reply) => {
    try {
      const userRole = request.user.role || ROLES.PATIENT;
      const permissions = ROLE_PERMISSIONS[userRole] || [];
      
      return {
        status: 200,
        data: {
          role: userRole,
          permissions: permissions
        }
      };
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      reply.code(500);
      return {
        status: 500,
        message: 'Server error while fetching user permissions'
      };
    }
  });

  // Get role permissions
  fastify.get('/roles/:role/permissions', {
    preHandler: [verifyToken, requireAdmin],
  }, async (request, reply) => {
    try {
      const { role } = request.params;
      
      // Check if role exists
      if (!Object.values(ROLES).includes(role)) {
        reply.code(404);
        return {
          status: 404,
          message: 'Role not found'
        };
      }
      
      const permissions = ROLE_PERMISSIONS[role] || [];
      
      return {
        status: 200,
        data: {
          role,
          permissions
        }
      };
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      reply.code(500);
      return {
        status: 500,
        message: 'Server error while fetching role permissions'
      };
    }
  });

  // Assign role to user (this would typically be done by an admin)
  fastify.post('/users/:userId/role', {
    preHandler: [verifyToken, requireAdmin],
  }, async (request, reply) => {
    try {
      const { userId } = request.params;
      const { role } = request.body;
      
      // Validate role
      if (!Object.values(ROLES).includes(role)) {
        reply.code(400);
        return {
          status: 400,
          message: 'Invalid role'
        };
      }
      
      // In a real implementation, you would update the user's role in the database
      // For now, we'll just return a success response
      return {
        status: 200,
        message: `Role ${role} assigned to user ${userId}`,
        data: {
          userId,
          role
        }
      };
    } catch (error) {
      console.error('Error assigning role:', error);
      reply.code(500);
      return {
        status: 500,
        message: 'Server error while assigning role'
      };
    }
  });
}

export default rbacRoutes;

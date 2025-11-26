import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../config/rbac.js';
import { verifyToken } from '../middleware/betterAuth.middleware.js';
import { requireAdmin } from '../middleware/rbac.middleware.js';
import { db } from '../config/db.drizzle.js';
import { roles, permissions, role_has_permissions } from '../db/schemas/index.js';
import { eq, and } from 'drizzle-orm';

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

  // Update role permissions (PUT /api/rbac/roles/:role)
  // This route handles both /api/rbac/roles/:role and /api/rbac/roles/:role/permissions
  fastify.put('/roles/:role', {
    preHandler: [verifyToken, requireAdmin],
  }, async (request, reply) => {
    try {
      const { role: roleName } = request.params;
      const { permissions: permissionIds } = request.body;
      
      // Validate role name
      if (!Object.values(ROLES).includes(roleName)) {
        reply.code(404);
        return {
          status: 404,
          message: 'Role not found'
        };
      }

      // Find role by name to get role ID
      const roleResult = await db
        .select()
        .from(roles)
        .where(eq(roles.name, roleName))
        .limit(1);

      if (roleResult.length === 0) {
        reply.code(404);
        return {
          status: 404,
          message: 'Role not found in database'
        };
      }

      const roleId = roleResult[0].id;

      // Validate permissions array
      if (!Array.isArray(permissionIds)) {
        reply.code(400);
        return {
          status: 400,
          message: 'Permissions must be an array'
        };
      }

      // Remove all existing permissions for this role
      await db
        .delete(role_has_permissions)
        .where(eq(role_has_permissions.role_id, roleId));

      // Add new permissions if provided
      if (permissionIds.length > 0) {
        // Validate and convert permission IDs to numbers
        const validPermissionIds = permissionIds
          .filter(id => id !== null && id !== undefined)
          .map(id => {
            if (typeof id === 'number') return id;
            if (typeof id === 'string' && !isNaN(id)) return parseInt(id);
            return null;
          })
          .filter(id => id !== null);

        if (validPermissionIds.length > 0) {
          // Verify all permission IDs exist in database
          const existingPermissions = await db
            .select()
            .from(permissions)
            .where(eq(permissions.id, validPermissionIds[0])); // Sample check

          // Insert new role-permission associations
          const rolePermissionValues = validPermissionIds.map(permissionId => ({
            role_id: roleId,
            permission_id: permissionId
          }));

          try {
            await db.insert(role_has_permissions).values(rolePermissionValues);
          } catch (insertError) {
            // If insert fails (e.g., invalid permission ID), return error
            console.error('Error inserting role permissions:', insertError);
            reply.code(400);
            return {
              status: 400,
              message: 'Invalid permission IDs provided. Some permissions may not exist.'
            };
          }
        }
      }

      // Fetch updated role with permissions
      const rolePermissions = await db
        .select()
        .from(role_has_permissions)
        .where(eq(role_has_permissions.role_id, roleId));

      const permissionDetails = [];
      for (const rp of rolePermissions) {
        const perm = await db
          .select()
          .from(permissions)
          .where(eq(permissions.id, rp.permission_id));
        if (perm.length > 0) {
          permissionDetails.push(perm[0]);
        }
      }

      return {
        status: 200,
        message: `Permissions updated for role ${roleName}`,
        data: {
          role: roleResult[0],
          permissions: permissionDetails
        }
      };
    } catch (error) {
      console.error('Error updating role permissions:', error);
      reply.code(500);
      return {
        status: 500,
        message: 'Server error while updating role permissions'
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

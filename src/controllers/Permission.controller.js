// Note: express-validator replaced with Fastify schema validation
// Validation should be done in route definitions using Fastify's schema
import { db } from "../config/db.drizzle.js";
import { permissions, roles } from "../db/schemas/index.js";
import { role_has_permissions } from "../db/schemas/index.js";
import { eq } from "drizzle-orm";

// Get all permissions
export const getAllPermissions = async (request, reply) => {
    try {
        const permissionsList = await db.select().from(permissions);
        
        return {
            status: 200,
            data: permissionsList,
        };
    } catch (error) {
        console.error("Error fetching permissions:", error);
        reply.code(500);
            return {
            status: 500,
            message: "Server error while fetching permissions",
        };
    }
};

// Get permission list (names only)
export const getPermissionList = async (request, reply) => {
    try {
        const permissionsList = await db
            .select({
                id: permissions.id,
                name: permissions.name,
            })
            .from(permissions);
        
        return {
            status: 200,
            data: permissionsList,
        };
    } catch (error) {
        console.error("Error fetching permission list:", error);
        reply.code(500);
            return {
            status: 500,
            message: "Server error while fetching permission list",
        };
    }
};

// Create a new permission
export const createPermission = async (request, reply) => {
    try {
        // Note: Validation should be done in route definition using Fastify schema
        const { name, guard_name } = request.body;
        
        // Basic validation
        if (!name) {
            reply.code(400);
            return {
                status: 400,
                message: "Validation failed",
                errors: [{ field: "name", message: "Permission name is required" }],
            };
        }

        // Check if permission already exists
        const existingPermission = await db
            .select()
            .from(permissions)
            .where(eq(permissions.name, name))
            .limit(1);
            
        if (existingPermission.length > 0) {
            reply.code(400);
            return {
                status: 400,
                message: "Permission already exists with this name",
            };
        }

        // Create permission
        const now = new Date();
        const permissionResult = await db
            .insert(permissions)
            .values({
                name,
                guard_name: guard_name || "web",
                createdAt: now,
                updatedAt: now,
            })
            .returning();

        const permission = permissionResult[0];

        reply.code(201);
            return {
            status: 201,
            message: "Permission created successfully",
            data: {
                permission,
            },
        };
    } catch (error) {
        console.error("Error creating permission:", error);
        reply.code(500);
            return {
            status: 500,
            message: "Server error while creating permission",
        };
    }
};

// Get permission by ID
export const getPermissionById = async (request, reply) => {
    try {
        const { id } = request.params;
        
        const permissionResult = await db
            .select()
            .from(permissions)
            .where(eq(permissions.id, parseInt(id)))
            .limit(1);

        if (permissionResult.length === 0) {
            reply.code(404);
            return {
                status: 404,
                message: "Permission not found",
            };
        }

        const permission = permissionResult[0];

        // Get roles that have this permission
        const rolePermissions = await db
            .select()
            .from(role_has_permissions)
            .where(eq(role_has_permissions.permission_id, parseInt(id)));

        const roleIds = rolePermissions.map((rp) => rp.role_id);
        const roleDetails = [];
        
        if (roleIds.length > 0) {
            for (const roleId of roleIds) {
                const roleResult = await db
                    .select()
                    .from(roles)
                    .where(eq(roles.id, roleId))
                    .limit(1);
                if (roleResult.length > 0) {
                    roleDetails.push(roleResult[0]);
                }
            }
        }

        return {
            status: 200,
            data: {
                permission: {
                    ...permission,
                    roles: roleDetails,
                },
            },
        };
    } catch (error) {
        console.error("Error fetching permission:", error);
        reply.code(500);
            return {
            status: 500,
            message: "Server error while fetching permission",
        };
    }
};

// Update permission by ID
export const updatePermission = async (request, reply) => {
    try {
        const { id } = request.params;
        const { name, guard_name } = request.body;

        // Find permission
        const permissionResult = await db
            .select()
            .from(permissions)
            .where(eq(permissions.id, parseInt(id)))
            .limit(1);

        if (permissionResult.length === 0) {
            reply.code(404);
            return {
                status: 404,
                message: "Permission not found",
            };
        }

        const permission = permissionResult[0];

        // Check if another permission exists with the same name
        if (name && name !== permission.name) {
            const existingPermission = await db
                .select()
                .from(permissions)
                .where(eq(permissions.name, name))
                .limit(1);
                
            if (existingPermission.length > 0) {
                reply.code(400);
            return {
                    status: 400,
                    message: "Permission already exists with this name",
                };
            }
        }

        // Prepare update data
        const updateData = {
            updatedAt: new Date(),
        };
        if (name !== undefined) updateData.name = name;
        if (guard_name !== undefined) updateData.guard_name = guard_name;

        // Check if there are any fields to update
        if (Object.keys(updateData).length === 1) { // Only updatedAt
            reply.code(400);
            return {
                status: 400,
                message: "No fields provided to update",
            };
        }

        // Update permission
        const updatedPermissionResult = await db
            .update(permissions)
            .set(updateData)
            .where(eq(permissions.id, parseInt(id)))
            .returning();

        const updatedPermission = updatedPermissionResult[0];

        return {
            status: 200,
            message: "Permission updated successfully",
            data: {
                permission: updatedPermission,
            },
        };
    } catch (error) {
        console.error("Error updating permission:", error);
        reply.code(500);
            return {
            status: 500,
            message: "Server error while updating permission",
        };
    }
};

// Delete permission by ID
export const deletePermission = async (request, reply) => {
    try {
        const { id } = request.params;

        // Find permission
        const permissionResult = await db
            .select()
            .from(permissions)
            .where(eq(permissions.id, parseInt(id)))
            .limit(1);

        if (permissionResult.length === 0) {
            reply.code(404);
            return {
                status: 404,
                message: "Permission not found",
            };
        }

        // Delete role-permission associations first
        await db
            .delete(role_has_permissions)
            .where(eq(role_has_permissions.permission_id, parseInt(id)));

        // Delete permission
        await db
            .delete(permissions)
            .where(eq(permissions.id, parseInt(id)));

        return {
            status: 200,
            message: "Permission deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting permission:", error);
        reply.code(500);
            return {
            status: 500,
            message: "Server error while deleting permission",
        };
    }
};

// Validation rules for creating/updating permission
// Note: In Fastify, validation should be done using schema in route definitions
// This is kept for compatibility but should be replaced with Fastify schema validation
export const permissionValidation = async (request, reply) => {
    // Basic validation - should be done in route schema
    if (!request.body.name) {
        reply.code(400);
            return {
            status: 400,
            message: "Validation failed",
            errors: [{ field: "name", message: "Permission name is required" }],
        };
    }
};

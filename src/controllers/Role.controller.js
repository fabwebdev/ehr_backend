// Note: express-validator replaced with Fastify schema validation
import { db } from "../config/db.drizzle.js";
import { roles, permissions } from "../db/schemas/index.js";
import { role_has_permissions, user_has_roles } from "../db/schemas/index.js";
import { eq, like, and } from "drizzle-orm";

// Get all roles with permissions
export const getAllRoles = async (request, reply) => {
    try {
        // First get all roles
        const rolesList = await db.select().from(roles);
        
        // For each role, get its permissions
        const rolesWithPermissions = await Promise.all(rolesList.map(async (role) => {
            // Get permission IDs associated with this role
            const rolePermissions = await db.select()
                .from(role_has_permissions)
                .where(eq(role_has_permissions.role_id, role.id));
            
            // Get permission details
            const permissionDetails = [];
            for (const rp of rolePermissions) {
                const perm = await db.select()
                    .from(permissions)
                    .where(eq(permissions.id, rp.permission_id));
                if (perm.length > 0) {
                    permissionDetails.push(perm[0]);
                }
            }
            
            return {
                ...role,
                permissions: permissionDetails
            };
        }));
        
        return {
            status: 200,
            data: rolesWithPermissions,
        };
    } catch (error) {
        console.error("Error fetching roles:", error);
        reply.code(500);
            return {
            status: 500,
            message: "Server error while fetching roles",
        };
    }
};

// Create a new role with permissions
export const createRole = async (request, reply) => {
    try {
        // Note: Validation should be done in route definition using Fastify schema
        const { name, guard_name, permissions: permissionIds } = request.body;
        
        // Basic validation
        if (!name) {
            reply.code(400);
            return {
                status: 400,
                message: "Validation failed",
                errors: [{ field: "name", message: "Role name is required" }],
            };
        }

        // Check if role already exists
        const existingRole = await db.select()
            .from(roles)
            .where(eq(roles.name, name));
            
        if (existingRole.length > 0) {
            reply.code(400);
            return {
                status: 400,
                message: "Role already exists with this name",
            };
        }

        // Create role
        const roleResult = await db.insert(roles)
            .values({
                name,
                guard_name: guard_name || "web",
            })
            .returning();
            
        const role = roleResult[0];

        // Associate permissions if provided
        if (permissionIds && Array.isArray(permissionIds)) {
            // Filter out invalid permission IDs and prepare insert data
            const validPermissionIds = permissionIds.filter(id => typeof id === 'number' || (typeof id === 'string' && !isNaN(id)));
            
            // Insert role-permission associations
            if (validPermissionIds.length > 0) {
                const rolePermissionValues = validPermissionIds.map(permissionId => ({
                    role_id: role.id,
                    permission_id: parseInt(permissionId)
                }));
                
                await db.insert(role_has_permissions).values(rolePermissionValues);
            }
        }

        // Fetch role with permissions
        const rolePermissions = await db.select()
            .from(role_has_permissions)
            .where(eq(role_has_permissions.role_id, role.id));
        
        const permissionDetails = [];
        for (const rp of rolePermissions) {
            const perm = await db.select()
                .from(permissions)
                .where(eq(permissions.id, rp.permission_id));
            if (perm.length > 0) {
                permissionDetails.push(perm[0]);
            }
        }
        
        const roleWithPermissions = {
            ...role,
            permissions: permissionDetails
        };

        reply.code(201);
            return {
            status: 201,
            message: "Role created successfully",
            data: {
                role: roleWithPermissions,
            },
        };
    } catch (error) {
        console.error("Error creating role:", error);
        reply.code(500);
            return {
            status: 500,
            message: "Server error while creating role",
        };
    }
};

// Get role by ID with permissions
export const getRoleById = async (request, reply) => {
    try {
        const { id } = request.params;
        
        // Find role by ID
        const roleResult = await db.select()
            .from(roles)
            .where(eq(roles.id, parseInt(id)));
            
        if (roleResult.length === 0) {
            reply.code(404);
            return {
                status: 404,
                message: "Role not found",
            };
        }
        
        const role = roleResult[0];

        // Get permissions for this role
        const rolePermissions = await db.select()
            .from(role_has_permissions)
            .where(eq(role_has_permissions.role_id, role.id));
        
        const permissionDetails = [];
        for (const rp of rolePermissions) {
            const perm = await db.select()
                .from(permissions)
                .where(eq(permissions.id, rp.permission_id));
            if (perm.length > 0) {
                permissionDetails.push(perm[0]);
            }
        }
        
        const roleWithPermissions = {
            ...role,
            permissions: permissionDetails
        };

        return {
            status: 200,
            data: {
                role: roleWithPermissions,
            },
        };
    } catch (error) {
        console.error("Error fetching role:", error);
        reply.code(500);
            return {
            status: 500,
            message: "Server error while fetching role",
        };
    }
};

// Update role by ID with permissions
export const updateRole = async (request, reply) => {
    try {
        const { id } = request.params;
        const { name, guard_name, permissions: permissionIds } = request.body;

        // Find role
        const roleResult = await db.select()
            .from(roles)
            .where(eq(roles.id, parseInt(id)));
            
        if (roleResult.length === 0) {
            reply.code(404);
            return {
                status: 404,
                message: "Role not found",
            };
        }
        
        const role = roleResult[0];

        // Check if another role exists with the same name
        if (name && name !== role.name) {
            const existingRole = await db.select()
                .from(roles)
                .where(and(
                    eq(roles.name, name),
                    eq(roles.id, parseInt(id))
                ));
                
            if (existingRole.length > 0) {
                reply.code(400);
            return {
                    status: 400,
                    message: "Role already exists with this name",
                };
            }
        }

        // Update role
        const updateData = {};
        if (name) updateData.name = name;
        if (guard_name) updateData.guard_name = guard_name;
        
        const updatedRoleResult = await db.update(roles)
            .set(updateData)
            .where(eq(roles.id, parseInt(id)))
            .returning();
            
        const updatedRole = updatedRoleResult[0];

        // Update permissions if provided
        if (permissionIds && Array.isArray(permissionIds)) {
            // First remove all existing permissions for this role
            await db.delete(role_has_permissions)
                .where(eq(role_has_permissions.role_id, parseInt(id)));
            
            // Add new permissions
            if (permissionIds.length > 0) {
                const validPermissionIds = permissionIds.filter(id => typeof id === 'number' || (typeof id === 'string' && !isNaN(id)));
                
                if (validPermissionIds.length > 0) {
                    const rolePermissionValues = validPermissionIds.map(permissionId => ({
                        role_id: parseInt(id),
                        permission_id: parseInt(permissionId)
                    }));
                    
                    await db.insert(role_has_permissions).values(rolePermissionValues);
                }
            }
        }

        // Fetch updated role with permissions
        const rolePermissions = await db.select()
            .from(role_has_permissions)
            .where(eq(role_has_permissions.role_id, parseInt(id)));
        
        const permissionDetails = [];
        for (const rp of rolePermissions) {
            const perm = await db.select()
                .from(permissions)
                .where(eq(permissions.id, rp.permission_id));
            if (perm.length > 0) {
                permissionDetails.push(perm[0]);
            }
        }
        
        const roleWithPermissions = {
            ...updatedRole,
            permissions: permissionDetails
        };

        return {
            status: 200,
            message: "Role updated successfully",
            data: {
                role: roleWithPermissions,
            },
        };
    } catch (error) {
        console.error("Error updating role:", error);
        reply.code(500);
            return {
            status: 500,
            message: "Server error while updating role",
        };
    }
};

// Delete role by ID
export const deleteRole = async (request, reply) => {
    try {
        const { id } = request.params;

        // Find role
        const roleResult = await db.select()
            .from(roles)
            .where(eq(roles.id, parseInt(id)));
            
        if (roleResult.length === 0) {
            reply.code(404);
            return {
                status: 404,
                message: "Role not found",
            };
        }

        // Delete role associations first
        await db.delete(role_has_permissions)
            .where(eq(role_has_permissions.role_id, parseInt(id)));
            
        await db.delete(user_has_roles)
            .where(eq(user_has_roles.role_id, parseInt(id)));

        // Delete role
        await db.delete(roles)
            .where(eq(roles.id, parseInt(id)));

        return {
            status: 200,
            message: "Role deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting role:", error);
        reply.code(500);
            return {
            status: 500,
            message: "Server error while deleting role",
        };
    }
};

// Validation rules for creating/updating role
// Note: In Fastify, validation should be done using schema in route definitions
// This is kept for compatibility but should be replaced with Fastify schema validation
export const roleValidation = async (request, reply) => {
    // Basic validation - should be done in route schema
    if (!request.body.name) {
        reply.code(400);
            return {
            status: 400,
            message: "Validation failed",
            errors: [{ field: "name", message: "Role name is required" }],
        };
    }
};
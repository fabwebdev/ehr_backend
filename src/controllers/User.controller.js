// Note: express-validator replaced with Fastify schema validation
// Validation should be done in route definitions using Fastify's schema
import { db } from "../config/db.drizzle.js";
import { users, roles } from "../db/schemas/index.js";
import { accounts } from "../db/schemas/index.js";
import { user_has_roles } from "../db/schemas/index.js";
import { eq, like, and } from "drizzle-orm";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import auth from "../config/betterAuth.js";
import { fromNodeHeaders } from "better-auth/node";

// Get all users with roles
export const getAllUsers = async (request, reply) => {
  try {
    // First get all users
    const usersList = await db.select().from(users);

    // For each user, get their roles
    const usersWithRoles = await Promise.all(
      usersList.map(async (user) => {
        // Get role IDs associated with this user
        const userRoles = await db
          .select()
          .from(user_has_roles)
          .where(eq(user_has_roles.user_id, user.id));

        // Get role details
        const roleDetails = [];
        for (const ur of userRoles) {
          const role = await db
            .select()
            .from(roles)
            .where(eq(roles.id, ur.role_id));
          if (role.length > 0) {
            roleDetails.push(role[0]);
          }
        }

        // Remove password from response
        const userResponse = { ...user };
        delete userResponse.password;

        // Ensure contact is always included (even if null)
        return {
          ...userResponse,
          contact: userResponse.contact || null,
          roles: roleDetails,
        };
      })
    );

    return {
      status: 200,
      data: usersWithRoles,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    reply.code(500);
    return {
      status: 500,
      message: "Server error while fetching users",
    };
  }
};

// Create a new user
export const createUser = async (request, reply) => {
  try {
    // Note: Validation should be done in route definition using Fastify schema
    // For now, basic validation is handled here
    const {
      name,
      firstName,
      lastName,
      email,
      password,
      role,
      contact,
      action,
    } = request.body;

    // Basic validation (should be done in route schema)
    if (!email || !password) {
      reply.code(400);
      return {
        status: 400,
        message: "Validation failed",
        errors: [
          ...(!email ? [{ field: "email", message: "Email is required" }] : []),
          ...(!password
            ? [{ field: "password", message: "Password is required" }]
            : []),
        ],
      };
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      reply.code(400);
      return {
        status: 400,
        message: "User already exists with this email",
      };
    }

    // Generate name from firstName and lastName (name is optional, will be auto-generated)
    const finalName = name || `${firstName} ${lastName}`.trim() || "User";

    // Use Better Auth API to create user (this automatically creates account record)
    const signupResponse = await auth.api.signUpEmail({
      body: {
        email: email,
        password: password,
        name: finalName,
      },
      headers: fromNodeHeaders(request.headers || {}),
      cookies: request.cookies || {},
    });

    if (!signupResponse || !signupResponse.user) {
      reply.code(500);
      return {
        status: 500,
        message: "Failed to create user via Better Auth",
      };
    }

    const userId = signupResponse.user.id;

    // Update user with additional fields (firstName, lastName, contact)
    const now = new Date();
    await db
      .update(users)
      .set({
        firstName: firstName || null,
        lastName: lastName || null,
        contact: contact || null,
        updatedAt: now,
      })
      .where(eq(users.id, userId));

    // Get the updated user
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userResult[0];

    // Assign role if provided
    if (role) {
      let roleId = null;

      if (typeof role === "object" && role.id) {
        roleId = role.id;
      } else if (typeof role === "string") {
        // Find role by name
        const roleResult = await db
          .select()
          .from(roles)
          .where(eq(roles.name, role));
        if (roleResult.length > 0) {
          roleId = roleResult[0].id;
        }
      } else if (typeof role === "number") {
        roleId = role;
      }

      if (roleId) {
        // Associate user with role
        await db.insert(user_has_roles).values({
          user_id: user.id,
          role_id: roleId,
        });
      }
    }

    // Fetch user with roles
    const userRoles = await db
      .select()
      .from(user_has_roles)
      .where(eq(user_has_roles.user_id, user.id));

    const roleDetails = [];
    for (const ur of userRoles) {
      const role = await db
        .select()
        .from(roles)
        .where(eq(roles.id, ur.role_id));
      if (role.length > 0) {
        roleDetails.push(role[0]);
      }
    }

    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;

    const userWithRoles = {
      ...userResponse,
      contact: userResponse.contact || null,
      roles: roleDetails,
    };

    reply.code(201);
    return {
      status: 201,
      message: "User created successfully",
      data: {
        user: userWithRoles,
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);
    reply.code(500);
    return {
      status: 500,
      message: "Server error while creating user",
    };
  }
};

// Get user by ID with roles
export const getUserById = async (request, reply) => {
  try {
    const { id } = request.params;

    // Find user by ID
    const userResult = await db.select().from(users).where(eq(users.id, id));

    if (userResult.length === 0) {
      reply.code(404);
      return {
        status: 404,
        message: "User not found",
      };
    }

    const user = userResult[0];

    // Get roles for this user
    const userRoles = await db
      .select()
      .from(user_has_roles)
      .where(eq(user_has_roles.user_id, user.id));

    const roleDetails = [];
    for (const ur of userRoles) {
      const role = await db
        .select()
        .from(roles)
        .where(eq(roles.id, ur.role_id));
      if (role.length > 0) {
        roleDetails.push(role[0]);
      }
    }

    // Remove password from response
    const userResponse = { ...user };
    delete userResponse.password;

    const userWithRoles = {
      ...userResponse,
      contact: userResponse.contact || null,
      roles: roleDetails,
    };

    return {
      status: 200,
      data: {
        user: userWithRoles,
      },
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    reply.code(500);
    return {
      status: 500,
      message: "Server error while fetching user",
    };
  }
};

// Update user by ID
export const updateUser = async (request, reply) => {
  try {
    const { id } = request.params;
    const { name, firstName, lastName, email, password, role, contact } =
      request.body;

    // Find user
    const userResult = await db.select().from(users).where(eq(users.id, id));

    if (userResult.length === 0) {
      reply.code(404);
      return {
        status: 404,
        message: "User not found",
      };
    }

    const user = userResult[0];

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (contact !== undefined) updateData.contact = contact;
    if (request.body.image !== undefined) updateData.image = request.body.image;

    // Hash password if it's being updated
    let hashedPassword = null;
    if (password !== undefined && password !== null && password !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      reply.code(400);
      return {
        status: 400,
        message: "No fields provided to update",
      };
    }

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    // Update user
    const updatedUserResult = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    const updatedUser = updatedUserResult[0];

    // Update account record if password was changed or if account doesn't exist
    if (hashedPassword !== null) {
      // Check if account exists
      const existingAccount = await db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, id))
        .limit(1);

      if (existingAccount.length > 0) {
        // Update existing account password
        await db
          .update(accounts)
          .set({
            password: hashedPassword,
            updatedAt: new Date(),
          })
          .where(eq(accounts.userId, id));
      } else {
        // Create account record if it doesn't exist
        const accountId = nanoid();
        await db.insert(accounts).values({
          id: accountId,
          userId: id,
          accountId: updatedUser.email,
          providerId: "credential",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Update role if provided
    if (role !== undefined) {
      // Remove all existing roles for this user
      await db.delete(user_has_roles).where(eq(user_has_roles.user_id, id));

      if (role !== null && role !== "") {
        // Assign new role
        let roleId = null;

        if (typeof role === "object" && role.id) {
          roleId = role.id;
        } else if (typeof role === "string") {
          // Find role by name
          const roleResult = await db
            .select()
            .from(roles)
            .where(eq(roles.name, role));
          if (roleResult.length > 0) {
            roleId = roleResult[0].id;
          }
        } else if (typeof role === "number") {
          roleId = role;
        }

        if (roleId) {
          // Associate user with role
          await db.insert(user_has_roles).values({
            user_id: id,
            role_id: roleId,
          });
        }
      }
    }

    // Fetch updated user with roles
    const userRoles = await db
      .select()
      .from(user_has_roles)
      .where(eq(user_has_roles.user_id, id));

    const roleDetails = [];
    for (const ur of userRoles) {
      const role = await db
        .select()
        .from(roles)
        .where(eq(roles.id, ur.role_id));
      if (role.length > 0) {
        roleDetails.push(role[0]);
      }
    }

    // Remove password from response
    const userResponse = { ...updatedUser };
    delete userResponse.password;

    const userWithRoles = {
      ...userResponse,
      contact: userResponse.contact || null,
      roles: roleDetails,
    };

    return {
      status: 200,
      message: "User updated successfully",
      data: {
        user: userWithRoles,
      },
    };
  } catch (error) {
    console.error("Error updating user:", error);
    reply.code(500);
    return {
      status: 500,
      message: "Server error while updating user",
    };
  }
};

// Delete user by ID
export const deleteUser = async (request, reply) => {
  try {
    const { id } = request.params;

    // Find user
    const userResult = await db.select().from(users).where(eq(users.id, id));

    if (userResult.length === 0) {
      reply.code(404);
      return {
        status: 404,
        message: "User not found",
      };
    }

    // Delete user role associations first
    await db.delete(user_has_roles).where(eq(user_has_roles.user_id, id));

    // Delete user
    await db.delete(users).where(eq(users.id, id));

    return {
      status: 200,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    reply.code(500);
    return {
      status: 500,
      message: "Server error while deleting user",
    };
  }
};

// Note: Validation should be done using Fastify's schema validation in route definitions
// Example schema for user creation:
// {
//   schema: {
//     body: {
//       type: 'object',
//       required: ['firstName', 'lastName', 'email', 'password'],
//       properties: {
//         firstName: { type: 'string' },
//         lastName: { type: 'string' },
//         email: { type: 'string', format: 'email' },
//         password: { type: 'string', minLength: 6 },
//         name: { type: 'string' },
//         contact: { type: 'string' }
//       }
//     }
//   }
// }
export const userValidation = async (request, reply) => {
  // Placeholder - validation should be done via Fastify schema
  // This is kept for compatibility but does nothing
};

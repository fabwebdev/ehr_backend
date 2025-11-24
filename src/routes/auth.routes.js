// Auth routes are now handled by Better Auth
// This file is kept for backward compatibility and custom auth routes
// All standard /api/auth/* routes are handled by Better Auth via server.js

import crypto from "crypto";
import auth from "../config/betterAuth.js";
import { fromNodeHeaders } from "better-auth/node";
import {
  authenticate,
  optionalAuth,
} from "../middleware/betterAuth.middleware.js";
import {
  requireRole,
  requirePermission,
} from "../middleware/rbac.middleware.js";
import { ROLES, PERMISSIONS } from "../config/rbac.js";
import { db } from "../config/db.drizzle.js";
import { users, roles, user_has_roles, sessions } from "../db/schemas/index.js";
import { eq, and, gt, desc } from "drizzle-orm";

// Fastify plugin for auth routes
async function authRoutes(fastify, options) {
  // Sign up route
  fastify.post("/sign-up", async (request, reply) => {
    try {
      const response = await auth.api.signUpEmail({
        body: request.body,
        headers: fromNodeHeaders(request.headers),
        cookies: request.cookies,
      });

      console.log("Better Auth sign-up response:", response);

      // Forward headers from Better Auth response (including set-cookie headers)
      // Better Auth may return a Web API Response or a plain object
      if (response && response.headers) {
        // Handle Web API Headers object
        if (
          response.headers instanceof Headers ||
          typeof response.headers.forEach === "function"
        ) {
          response.headers.forEach((value, key) => {
            reply.header(key, value);
          });
        }
        // Handle plain object with headers
        else if (typeof response.headers === "object") {
          Object.entries(response.headers).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((val) => reply.header(key, val));
            } else {
              reply.header(key, value);
            }
          });
        }
      }

      // Instead of returning the token in the response body,
      // we'll rely on the cookies being set by Better Auth
      if (response && response.user) {
        const { token, headers, ...userData } = response;

        // Update user with firstName and lastName (required fields)
        try {
          const { firstName, lastName } = request.body;

          // Validate firstName and lastName are provided
          if (!firstName || !lastName) {
            return reply.code(400).send({
              status: 400,
              message: "Validation failed",
              errors: [
                ...(!firstName
                  ? [
                      {
                        type: "field",
                        msg: "First name is required",
                        path: "firstName",
                        location: "body",
                      },
                    ]
                  : []),
                ...(!lastName
                  ? [
                      {
                        type: "field",
                        msg: "Last name is required",
                        path: "lastName",
                        location: "body",
                      },
                    ]
                  : []),
              ],
            });
          }

          // Update user with firstName and lastName
          const updateData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          };

          await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, response.user.id));

          console.log(
            `Updated user ${response.user.id} with firstName/lastName`
          );
        } catch (nameUpdateError) {
          console.error("Error updating firstName/lastName:", nameUpdateError);
          return reply.code(500).send({
            status: 500,
            message: "Error saving user details",
          });
        }

        // Assign default role to the user
        try {
          // Get the "patient" role from the database
          const patientRole = await db
            .select()
            .from(roles)
            .where(eq(roles.name, "patient"))
            .limit(1);

          if (patientRole.length > 0) {
            // Insert the user-role association
            await db.insert(user_has_roles).values({
              user_id: response.user.id,
              role_id: parseInt(patientRole[0].id), // Convert to integer
            });

            console.log(
              `Assigned default 'patient' role to user ${response.user.id}`
            );
          } else {
            console.warn(
              "Patient role not found in database. Skipping role assignment."
            );
          }
        } catch (roleError) {
          console.error("Error assigning default role:", roleError);
          // Don't fail the signup if role assignment fails, just log it
        }

        // Fetch updated user with firstName and lastName
        const updatedUser = await db
          .select()
          .from(users)
          .where(eq(users.id, response.user.id))
          .limit(1);

        const userResponse =
          updatedUser.length > 0 ? updatedUser[0] : userData.user;
        const { password, ...userWithoutPassword } = userResponse;

        return {
          status: 200,
          message: "User registered successfully",
          data: {
            user: userWithoutPassword,
          },
        };
      } else {
        // Handle case where response structure is different
        return {
          status: 200,
          message: "User registered successfully",
          data: {
            user: response,
          },
        };
      }
    } catch (error) {
      console.error("Sign up error:", error);
      reply.code(500);
      return {
        status: 500,
        message: "Server error during sign up",
      };
    }
  });

  // Sign in route
  fastify.post("/sign-in", async (request, reply) => {
    try {
      // Authenticate with Better Auth
      const response = await auth.api.signInEmail({
        body: request.body,
        headers: fromNodeHeaders(request.headers),
        cookies: request.cookies,
      });

      if (!response || !response.user) {
        return reply.code(401).send({
          status: 401,
          message: "Invalid email or password",
          code: "INVALID_EMAIL_OR_PASSWORD",
        });
      }

      // Forward headers from Better Auth response (including set-cookie headers)
      // Better Auth may return a Web API Response or a plain object
      if (response && response.headers) {
        // Handle Web API Headers object
        if (
          response.headers instanceof Headers ||
          typeof response.headers.forEach === "function"
        ) {
          response.headers.forEach((value, key) => {
            reply.header(key, value);
          });
        }
        // Handle plain object with headers
        else if (typeof response.headers === "object") {
          Object.entries(response.headers).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((val) => reply.header(key, val));
            } else {
              reply.header(key, value);
            }
          });
        }
      }

      // Check if Better Auth created a session automatically
      // With autoSignIn: true, it should create a session
      let session = null;
      try {
        session = await auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
          cookies: request.cookies,
        });

        if (session) {
          console.log("✅ Better Auth created session automatically");
        } else {
          console.log("⚠️ Better Auth didn't create session, checking DB...");

          // Check if session exists in DB but Better Auth can't read it
          const dbSessions = await db
            .select()
            .from(sessions)
            .where(
              and(
                eq(sessions.userId, response.user.id),
                gt(sessions.expiresAt, new Date())
              )
            )
            .orderBy(desc(sessions.createdAt))
            .limit(1);

          if (dbSessions.length > 0) {
            console.log(
              "📦 Session exists in DB but Better Auth can't read it"
            );
            console.log(
              "   Token format might be wrong. Token preview:",
              dbSessions[0].token.substring(0, 20)
            );
          } else {
            console.log("❌ No session found in DB either");
          }
        }
      } catch (sessionError) {
        console.error("Error checking session:", sessionError);
      }

      // Get user's full details from database (including firstName, lastName, and role)
      let userRole = ROLES.PATIENT;

      // Preserve original email case from request body
      const originalEmail = request.body?.email || response.user.email;

      let fullUser = {
        ...response.user,
        email: originalEmail, // Always use original email case from request
      };

      try {
        // Fetch complete user record from database to get firstName and lastName
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.id, response.user.id))
          .limit(1);

        if (dbUser.length > 0) {
          // Update email in database to preserve original case (if different)
          if (dbUser[0].email.toLowerCase() !== originalEmail.toLowerCase()) {
            // Email case is different, update it in database
            await db
              .update(users)
              .set({ email: originalEmail })
              .where(eq(users.id, response.user.id));
            console.log(
              `📧 Updated email case in database: ${dbUser[0].email} → ${originalEmail}`
            );
          }

          fullUser = {
            ...response.user,
            email: originalEmail, // Keep original email case from request, not from database
            firstName: dbUser[0].firstName || null,
            lastName: dbUser[0].lastName || null,
          };
        }

        // Get user's role from database
        const userRoles = await db
          .select()
          .from(user_has_roles)
          .where(eq(user_has_roles.user_id, response.user.id))
          .limit(1);

        if (userRoles.length > 0) {
          const roleRecords = await db
            .select()
            .from(roles)
            .where(eq(roles.id, userRoles[0].role_id))
            .limit(1);

          if (roleRecords.length > 0) {
            userRole = roleRecords[0].name;
          }
        }
      } catch (error) {
        console.error("Error loading user details during sign-in:", error);
        // Continue with response.user if database fetch fails
      }

      // Remove password from response if present
      const { password, ...userWithoutPassword } = fullUser;

      return {
        status: 200,
        message: "User logged in successfully",
        data: {
          user: {
            ...userWithoutPassword,
            role: userRole,
          },
        },
      };
    } catch (error) {
      console.error("Sign in error:", error);

      // Handle Better Auth specific errors
      if (error.statusCode === 401 || error.status === "UNAUTHORIZED") {
        return reply.code(401).send({
          status: 401,
          message: error.body?.message || "Invalid email or password",
          code: error.body?.code || "INVALID_EMAIL_OR_PASSWORD",
        });
      }

      reply.code(500);
      return {
        status: 500,
        message: "Server error during sign in",
      };
    }
  });

  // Sign out route
  fastify.post("/sign-out", async (request, reply) => {
    try {
      const response = await auth.api.signOut({
        headers: fromNodeHeaders(request.headers),
        cookies: request.cookies,
      });

      // Forward headers from Better Auth response (including set-cookie headers to clear cookies)
      // Better Auth may return a Web API Response or a plain object
      if (response && response.headers) {
        // Handle Web API Headers object
        if (
          response.headers instanceof Headers ||
          typeof response.headers.forEach === "function"
        ) {
          response.headers.forEach((value, key) => {
            reply.header(key, value);
          });
        }
        // Handle plain object with headers
        else if (typeof response.headers === "object") {
          Object.entries(response.headers).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((val) => reply.header(key, val));
            } else {
              reply.header(key, value);
            }
          });
        }
      }

      return {
        status: 200,
        message: "User logged out successfully",
      };
    } catch (error) {
      console.error("Sign out error:", error);
      reply.code(500);
      return {
        status: 500,
        message: "Server error during sign out",
      };
    }
  });

  // Test RBAC - Admin only route
  fastify.get(
    "/admin-only",
    {
      preHandler: [authenticate, requireRole(ROLES.ADMIN)],
    },
    async (request, reply) => {
      return {
        status: 200,
        message: "Welcome, Admin!",
        data: {
          user: request.user,
          role: request.user.role,
        },
      };
    }
  );

  // Test RBAC - Healthcare staff only route
  fastify.get(
    "/medical-staff",
    {
      preHandler: [
        authenticate,
        requireRole(ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE),
      ],
    },
    async (request, reply) => {
      return {
        status: 200,
        message: "Welcome, Medical Staff!",
        data: {
          user: request.user,
          role: request.user.role,
        },
      };
    }
  );

  // Test RBAC - Permission based route
  fastify.get(
    "/view-patients",
    {
      preHandler: [authenticate, requirePermission(PERMISSIONS.VIEW_PATIENT)],
    },
    async (request, reply) => {
      return {
        status: 200,
        message: "You have permission to view patients!",
        data: {
          user: request.user,
          role: request.user.role,
        },
      };
    }
  );

  // Get current user profile with role and permissions
  fastify.get(
    "/me",
    {
      preHandler: [authenticate],
    },
    async (request, reply) => {
      try {
        const { ROLE_PERMISSIONS } = await import("../config/rbac.js");
        const userRole = request.user.role || ROLES.PATIENT;
        const permissions = ROLE_PERMISSIONS[userRole] || [];

        // Ensure we're using the email from request.user (which comes from database via middleware)
        // The middleware already fetches from database and preserves email case
        const userData = {
          ...request.user,
          role: userRole,
          permissions: permissions,
        };

        console.log("📧 /api/auth/me - Returning user email:", userData.email);
        console.log("📧 /api/auth/me - User ID:", userData.id);

        return {
          status: 200,
          message: "User profile retrieved successfully",
          data: {
            user: userData,
          },
        };
      } catch (error) {
        console.error("Error fetching user profile:", error);
        reply.code(500);
        return {
          status: 500,
          message: "Server error while fetching user profile",
        };
      }
    }
  );

  // Special endpoint to create admin users (TEMPORARILY without secret key for testing)
  fastify.post("/create-admin", async (request, reply) => {
    try {
      // Note: This endpoint should have authentication in production!
      console.warn(
        "WARNING: Admin creation endpoint is temporarily unprotected!"
      );

      const { email, password, name, firstName, lastName } = request.body;

      // Import the createAdminUser function
      const createAdminUser = (await import("../utils/createAdminUser.js"))
        .default;

      // Create the admin user
      const result = await createAdminUser(
        email,
        password,
        name,
        firstName,
        lastName
      );

      return {
        status: 200,
        message: "Admin user created successfully",
        data: result,
      };
    } catch (error) {
      console.error("Error creating admin user:", error);
      reply.code(500);
      return {
        status: 500,
        message: "Server error while creating admin user",
      };
    }
  });
}

export default authRoutes;

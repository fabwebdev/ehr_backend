import auth from "../config/betterAuth.js";
import { fromNodeHeaders } from "better-auth/node";
import { ROLES } from "../config/rbac.js";
import { db } from "../config/db.drizzle.js";
import { users, user_has_roles, roles } from "../db/schemas/index.js";
import { eq } from "drizzle-orm";

/**
 * Middleware to protect routes with Better Auth session validation
 * Replaces the old JWT authentication middleware
 */
export const authenticate = async (request, reply) => {
  try {
    // Debug: Log cookies received
    const sessionToken = request.cookies?.["better-auth.session_token"];
    console.log("🔍 Authentication attempt:", {
      hasCookie: !!sessionToken,
      tokenPreview: sessionToken
        ? sessionToken.substring(0, 20) + "..."
        : "none",
      allCookies: Object.keys(request.cookies || {}),
    });

    // Get session from Better Auth
    let session;
    try {
      session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
        cookies: request.cookies,
      });
    } catch (error) {
      console.error("❌ Better Auth getSession error:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
        detail: error.detail,
        hint: error.hint,
      });

      // If it's a table not found error, provide helpful message
      if (error.message?.includes("does not exist") || error.code === "42P01") {
        console.error(
          "⚠️  Database table error detected. Check if sessions table exists in public schema."
        );
      }

      return reply.code(500).send({
        status: 500,
        message: "Server error during session validation.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }

    if (!session) {
      // Debug: Check if session exists in database
      if (sessionToken) {
        try {
          const { db } = await import("../config/db.drizzle.js");
          const { sessions } = await import("../db/schemas/index.js");
          const { eq } = await import("drizzle-orm");

          const dbSession = await db
            .select()
            .from(sessions)
            .where(eq(sessions.token, sessionToken))
            .limit(1);

          console.log("❌ Better Auth can't read session, but DB has:", {
            foundInDB: dbSession.length > 0,
            sessionId: dbSession[0]?.id,
            userId: dbSession[0]?.userId,
            expiresAt: dbSession[0]?.expiresAt,
            tokenMatch: dbSession[0]?.token === sessionToken,
          });
        } catch (dbError) {
          console.error("❌ Error checking database session:", dbError.message);
        }
      }

      return reply.code(401).send({
        status: 401,
        message: "Access denied. No valid session found.",
      });
    }

    console.log("✅ Session found for user:", session.user?.id);
    console.log("📧 Session user email:", session.user?.email);
    console.log(
      "🔍 Session token from cookie:",
      sessionToken ? sessionToken.substring(0, 30) + "..." : "none"
    );

    // Check if this is the correct session by comparing user IDs
    if (session.user?.id) {
      console.log("✅ Authenticated user ID:", session.user.id);
    }

    // Fetch full user record from database to get firstName and lastName
    let fullUser = session.user;
    try {
      const dbUser = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

      if (dbUser.length > 0) {
        console.log("📧 Database user email:", dbUser[0].email);
        // Merge Better Auth user data with database user data (including firstName and lastName)
        // Use database email as-is (it should have original case if stored correctly)
        // Better Auth stores lowercase, but we'll use what's in database
        fullUser = {
          ...session.user,
          email: dbUser[0].email, // Use email from database (may have original case)
          firstName: dbUser[0].firstName || null,
          lastName: dbUser[0].lastName || null,
        };
      }
    } catch (userFetchError) {
      console.error(
        "Error fetching user details from database:",
        userFetchError
      );
      // Continue with session.user if database fetch fails
    }

    // Add user info to request object
    request.user = fullUser;
    request.betterAuthSession = session; // Use a different property name to avoid conflicts

    // Load user's role from database
    try {
      // Get user roles from user_has_roles table
      const userRoles = await db
        .select()
        .from(user_has_roles)
        .where(eq(user_has_roles.user_id, session.user.id))
        .limit(1);

      if (userRoles.length > 0) {
        // Get the role name from roles table
        const roleRecords = await db
          .select()
          .from(roles)
          .where(eq(roles.id, userRoles[0].role_id))
          .limit(1);

        if (roleRecords.length > 0) {
          request.user.role = roleRecords[0].name; // Set actual role from database
        } else {
          request.user.role = ROLES.PATIENT; // Default if role not found
        }
      } else {
        request.user.role = ROLES.PATIENT; // Default if no role assigned
      }
    } catch (roleError) {
      console.error("Error loading user role:", roleError);
      request.user.role = ROLES.PATIENT; // Default on error
    }
  } catch (error) {
    console.error("Authentication error:", error);
    console.error("Authentication error stack:", error.stack);
    console.error("Request details:", {
      method: request.method,
      path: request.url,
      headers: request.headers,
      cookies: request.cookies,
    });
    return reply.code(500).send({
      status: 500,
      message: "Server error during authentication.",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// For compatibility with Laravel's verifyToken
export const verifyToken = authenticate;

// Middleware to get optional session (for routes that can be accessed by both authenticated and unauthenticated users)
export const optionalAuth = async (request, reply) => {
  try {
    // Get session from Better Auth (if exists)
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
      cookies: request.cookies,
    });

    // Add user info to request object if session exists
    if (session) {
      request.user = session.user;
      request.betterAuthSession = session; // Use a different property name to avoid conflicts

      // Load user's role from database
      try {
        // Get user roles from user_has_roles table
        const userRoles = await db
          .select()
          .from(user_has_roles)
          .where(eq(user_has_roles.user_id, session.user.id))
          .limit(1);

        if (userRoles.length > 0) {
          // Get the role name from roles table
          const roleRecords = await db
            .select()
            .from(roles)
            .where(eq(roles.id, userRoles[0].role_id))
            .limit(1);

          if (roleRecords.length > 0) {
            request.user.role = roleRecords[0].name; // Set actual role from database
          } else {
            request.user.role = ROLES.PATIENT; // Default if role not found
          }
        } else {
          request.user.role = ROLES.PATIENT; // Default if no role assigned
        }
      } catch (roleError) {
        console.error("Error loading user role:", roleError);
        request.user.role = ROLES.PATIENT; // Default on error
      }
    }
  } catch (error) {
    console.error("Optional authentication error:", error);
    // Still continue even if there's an error, as this is optional auth
  }
};

export default authenticate;

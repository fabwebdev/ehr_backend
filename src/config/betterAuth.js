import dotenv from "dotenv";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "./db.drizzle.js";
import * as schema from "../db/schemas/index.js";
import config from "./config.js";

dotenv.config();

// Get database configuration
const dbConfig = config.get("database");

// Map schema to Better Auth expected names
const betterAuthSchema = {
  user: schema.users,
  account: schema.accounts,
  session: schema.sessions,
  verification: schema.verifications,
  role: schema.roles,
  permission: schema.permissions,
  userRole: schema.user_has_roles,
  rolePermission: schema.role_has_permissions,
};

// Drizzle ORM is already initialized in db.drizzle.js

// Initialize Better Auth with RBAC support and Drizzle adapter
const auth = betterAuth({
  appName: "Charts Backend",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "your-super-secret-better-auth-key-change-this-in-production",

  // Database configuration using Drizzle with custom schema mapping
  database: drizzleAdapter(db, {
    provider: "postgresql",
    schema: betterAuthSchema,
  }),

  // Email/Password authentication
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 6,
  },

  // Social providers configuration
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled:
        !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      enabled:
        !!process.env.GITHUB_CLIENT_ID && !!process.env.GITHUB_CLIENT_SECRET,
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  // Cookies configuration for cross-origin support
  // For cross-origin requests (frontend on different domain), use sameSite: 'none' with secure: true
  // IMPORTANT: Always use 'none' when backend and frontend are on different domains
  cookies: {
    secure: true, // Required when sameSite is 'none' - MUST be true for HTTPS
    sameSite: "none", // Always 'none' to support cross-origin cookies (local frontend → production backend)
    domain: process.env.COOKIE_DOMAIN || undefined, // Don't set domain for cross-origin
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/", // Ensure cookie is available for all paths
  },

  // RBAC configuration
  account: {
    accountLinking: {
      enabled: true,
    },
  },

  // Advanced settings
  advanced: {
    crossSubdomainCookies: {
      enabled: false,
    },
    // Cookie settings for better security
    // Use 'none' for cross-origin cookies (required when frontend and backend are on different domains)
    cookiePrefix: "better-auth",
    cookieSameSite: "none", // Always 'none' for cross-origin support
  },

  // Trusted origins for CORS (frontend URLs)
  trustedOrigins: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(",").map(origin => origin.trim())
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://ehr-frontend-by-samad.vercel.app/",
        "https://ehr-frontend-by-samad-wpyl.vercel.app"
      ],
});

export default auth;

import dotenv from "dotenv";

dotenv.config();

const corsConfig = {
  // Paths that should be allowed for CORS
  paths: ["api/*", "sanctum/csrf-cookie"],

  // Allowed HTTP methods
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],

  // Allowed origins - must whitelist both local and production frontends
  allowedOrigins: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map(origin => origin.trim())
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://ehr-frontend-by-samad.vercel.app",
        "https://ehr-frontend-by-samad-wpyl.vercel.app",
      ],

  // Allowed origin patterns
  allowedOriginsPatterns: [],

  // Allowed headers
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "X-CSRF-TOKEN",
    "X-XSRF-TOKEN",
  ],

  // Exposed headers
  exposedHeaders: ["Authorization", "X-Requested-With"],

  // Max age for preflight requests
  maxAge: 86400, // 24 hours

  // Support credentials
  supportsCredentials: true,
};

export default corsConfig;

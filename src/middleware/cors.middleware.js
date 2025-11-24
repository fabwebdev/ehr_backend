import corsConfig from "../config/cors.config.js";

/**
 * CORS middleware that matches Laravel's CORS configuration for Fastify
 */
const corsMiddleware = async (request, reply) => {
  // Set CORS headers
  const origin = request.headers.origin;

  // Check if origin is allowed
  let isAllowed = false;

  if (corsConfig.allowedOrigins.includes("*")) {
    isAllowed = true;
  } else if (corsConfig.allowedOrigins.includes(origin)) {
    isAllowed = true;
  } else {
    // Check origin patterns
    for (const pattern of corsConfig.allowedOriginsPatterns) {
      const regex = new RegExp(pattern);
      if (regex.test(origin)) {
        isAllowed = true;
        break;
      }
    }
  }

  if (isAllowed) {
    reply.header("Access-Control-Allow-Origin", origin);
  } else if (corsConfig.allowedOrigins.includes("*")) {
    // If wildcard is allowed and credentials are required, use the specific origin
    // Wildcard (*) cannot be used with credentials: true
    if (corsConfig.supportsCredentials && origin) {
      reply.header("Access-Control-Allow-Origin", origin);
    } else {
      reply.header("Access-Control-Allow-Origin", origin || "*");
    }
  }

  // Set other CORS headers
  reply.header(
    "Access-Control-Allow-Credentials",
    corsConfig.supportsCredentials.toString()
  );
  reply.header(
    "Access-Control-Expose-Headers",
    corsConfig.exposedHeaders.join(", ")
  );

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    if (isAllowed) {
      reply.header("Access-Control-Allow-Origin", origin);
    } else if (corsConfig.allowedOrigins.includes("*")) {
      // If wildcard is allowed and credentials are required, use the specific origin
      if (corsConfig.supportsCredentials && origin) {
        reply.header("Access-Control-Allow-Origin", origin);
      } else {
        reply.header("Access-Control-Allow-Origin", origin || "*");
      }
    }
    reply.header(
      "Access-Control-Allow-Methods",
      corsConfig.allowedMethods.join(", ")
    );
    reply.header(
      "Access-Control-Allow-Headers",
      corsConfig.allowedHeaders.join(", ")
    );
    reply.header("Access-Control-Max-Age", corsConfig.maxAge.toString());
    reply.header(
      "Access-Control-Allow-Credentials",
      corsConfig.supportsCredentials.toString()
    );

    return reply.code(204).send();
  }
};

export default corsMiddleware;

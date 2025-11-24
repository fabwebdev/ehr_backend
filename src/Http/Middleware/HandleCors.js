import corsMiddleware from "../../middleware/cors.middleware.js";

/**
 * Handle CORS middleware (Fastify compatible)
 * This is a wrapper to make the custom corsMiddleware compatible with the HTTP Kernel
 */
const HandleCors = async (request, reply) => {
  // corsMiddleware is already a Fastify hook, so we can call it directly
  return corsMiddleware(request, reply, () => {});
};

export default HandleCors;
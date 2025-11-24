/**
 * Middleware to add Origin header if missing
 * Better Auth requires Origin header, but Postman/API clients don't send it by default
 * This adds a default Origin header for testing purposes
 */
const originMiddleware = async (request, reply) => {
  // Only add Origin if it's missing (for Postman/testing)
  if (!request.headers.origin) {
    // Use the baseURL from Better Auth config or request host
    const baseURL = process.env.BETTER_AUTH_URL || `https://${request.headers.host}`;
    const url = new URL(baseURL);
    request.headers.origin = url.origin;
    console.log(`⚠️  Added default Origin header for testing: ${request.headers.origin}`);
  }
};

export default originMiddleware;


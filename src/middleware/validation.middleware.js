// Note: express-validator is replaced with Fastify's built-in validation
// This middleware is kept for compatibility but should use Fastify's schema validation instead
const validate = async (request, reply) => {
  // Fastify uses schema validation instead of express-validator
  // If you need validation, use Fastify's schema validation in route definitions
  // This is a placeholder for compatibility
};

export default validate;
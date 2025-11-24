import Handler from "../exceptions/Handler.js";

/**
 * Global error handling middleware for Fastify
 * @param {Error} error
 * @param {Object} request
 * @param {Object} reply
 */
const errorHandler = (error, request, reply) => {
  // Use our exception handler to render the error
  Handler.render(request, reply, error);
};

export default errorHandler;

// Note: SessionService is now using Better Auth for session management
// This service is kept for compatibility but Better Auth handles sessions automatically
import sessionConfig from "../config/session.config.js";

class SessionService {
  constructor() {
    this.config = sessionConfig;
  }

  /**
   * Get the session middleware (Fastify compatible)
   * Note: In Fastify with Better Auth, sessions are handled automatically
   * @returns {Function} Fastify hook function
   */
  getMiddleware() {
    // Return a Fastify hook that does nothing (Better Auth handles sessions)
    return async (request, reply) => {
      // Better Auth handles sessions automatically via cookies
      // This is a no-op for compatibility
    };
  }

  /**
   * Start a new session (Fastify compatible)
   * Note: Better Auth handles sessions automatically
   * @param {Object} request - Fastify request object
   * @param {Object} reply - Fastify reply object
   */
  async start(request, reply) {
    // Better Auth handles sessions automatically
    // This is a no-op for compatibility
  }
}

export default new SessionService();

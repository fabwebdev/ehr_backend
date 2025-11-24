import SessionService from '../services/SessionService.js';

class Session {
    /**
     * Get the session middleware (Fastify compatible)
     * @returns {Function} Fastify hook function
     */
    static getMiddleware() {
        return SessionService.getMiddleware();
    }
    
    /**
     * Start a new session (Fastify compatible)
     * @param {Object} request - Fastify request object
     * @param {Object} reply - Fastify reply object
     */
    static async start(request, reply) {
        return SessionService.start(request, reply);
    }
}

export default Session;
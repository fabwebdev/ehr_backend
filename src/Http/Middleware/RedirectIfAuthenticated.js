// Note: Converted to Fastify compatible middleware
class RedirectIfAuthenticated {
  /**
   * Handle an incoming request (Fastify compatible).
   *
   * @param {Object} request - Fastify request object
   * @param {Object} reply - Fastify reply object
   * @param {...string} guards
   * @return {Object|void}
   */
  async handle(request, reply, ...guards) {
    const guardsArray = guards.length === 0 ? [null] : guards;

    // Check if user is authenticated
    // If authenticated, redirect to home page
    if (request.user) {
      reply.redirect('/home');
      return;
    }
    
    // User is not authenticated, continue
  }
}

export default RedirectIfAuthenticated;
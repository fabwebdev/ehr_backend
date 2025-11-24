import passport from "passport";
import auth from "../config/betterAuth.js";

class AuthServiceProvider {
  /**
   * Register any authentication / authorization services.
   */
  boot(app) {
    // Register any authentication / authorization services
    // In Fastify, this would typically be handled by Better Auth or similar
    // For now, we're just providing the structure
  }
}

export default new AuthServiceProvider();
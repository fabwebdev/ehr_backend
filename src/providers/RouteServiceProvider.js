import AppServiceProvider from "./AppServiceProvider.js";
import AuthServiceProvider from "./AuthServiceProvider.js";
import EventServiceProvider from "./EventServiceProvider.js";
import BroadcastServiceProvider from "./BroadcastServiceProvider.js";

class RouteServiceProvider {
  /**
   * The path to the "home" route for your application.
   *
   * This is used by Laravel authentication to redirect users after login.
   *
   * @var string
   */
  static HOME = '/home';

  /**
   * Define your route model bindings, pattern filters, etc.
   */
  async boot(app) {
    // Boot all service providers
    AppServiceProvider.boot(app);
    AuthServiceProvider.boot(app);
    EventServiceProvider.boot(app);
    BroadcastServiceProvider.boot(app);
    
    await this.configureRateLimiting(app);
    
    // Register routes
    this.routes(app);
  }

  /**
   * Configure the rate limiters for the application.
   */
  async configureRateLimiting(app) {
    // Register Fastify rate limiting plugin
    await app.register(import("@fastify/rate-limit"), {
      max: 60, // limit each IP to 60 requests
      timeWindow: '15 minutes', // 15 minutes
      errorResponseBuilder: (request, context) => {
        return {
          status: 429,
          message: "Too many requests from this IP, please try again later.",
        };
      },
    });

    // Store rate limit config for reference
    this.rateLimitConfig = {
      max: 60,
      timeWindow: '15 minutes',
    };
  }

  /**
   * Register routes
   */
  routes(app) {
    // In Fastify, routes are registered as plugins
    // This is a placeholder to match Laravel's structure
  }

  /**
   * Get the API rate limiter config.
   * @return {Object}
   */
  getApiLimiter() {
    return this.rateLimitConfig;
  }
}

export default new RouteServiceProvider();
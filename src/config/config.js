import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config();

class Config {
  constructor() {
    this.items = new Map();
    this.loadEnvironmentConfig();
  }

  /**
   * Load configuration from environment variables
   */
  loadEnvironmentConfig() {
    // Database configuration
    this.set("database", {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      name: process.env.DB_NAME || "travel_db", // Changed default to match .env
      user: process.env.DB_USER || "api_user", // Changed default to match .env
      password: process.env.DB_PASSWORD || "api_pass_123", // Changed default to match .env
      dialect: process.env.DB_DIALECT || "postgres",
    });

    // JWT configuration
    this.set("jwt", {
      secret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
      issuer: process.env.JWT_ISSUER || "charts-backend-fastify",
      audience: process.env.JWT_AUDIENCE || "charts-frontend",
    });

    // CORS configuration
    this.set("cors", {
      origin: process.env.CORS_ORIGIN || "*",
      credentials: process.env.CORS_CREDENTIALS === "true",
      methods: (
        process.env.CORS_METHODS || "GET,POST,PUT,DELETE,OPTIONS"
      ).split(","),
      allowedHeaders: (
        process.env.CORS_HEADERS ||
        "Content-Type,Authorization,X-Requested-With"
      ).split(","),
    });

    // Application configuration
    this.set("app", {
      name: process.env.APP_NAME || "Charts Backend",
      env: process.env.NODE_ENV || "development",
      debug: process.env.APP_DEBUG === "true",
      url: process.env.APP_URL || "http://localhost:3000",
      port: process.env.PORT || 3000,
      timezone: process.env.APP_TIMEZONE || "UTC",
      locale: process.env.APP_LOCALE || "en",
      fallback_locale: process.env.APP_FALLBACK_LOCALE || "en",
      key: process.env.APP_KEY,
      cipher: process.env.APP_CIPHER || "AES-256-CBC",
    });

    // Logging configuration
    this.set("logging", {
      level: process.env.LOG_LEVEL || "info",
      format: process.env.LOG_FORMAT || "combined",
    });
  }

  /**
   * Get a configuration value
   * @param {String} key - Configuration key
   * @param {any} defaultValue - Default value if key not found
   * @return {any} - Configuration value
   */
  get(key, defaultValue = null) {
    return this.items.has(key) ? this.items.get(key) : defaultValue;
  }

  /**
   * Set a configuration value
   * @param {String} key - Configuration key
   * @param {any} value - Configuration value
   */
  set(key, value) {
    this.items.set(key, value);
  }

  /**
   * Check if a configuration key exists
   * @param {String} key - Configuration key
   * @return {Boolean}
   */
  has(key) {
    return this.items.has(key);
  }

  /**
   * Remove a configuration key
   * @param {String} key - Configuration key
   */
  remove(key) {
    this.items.delete(key);
  }

  /**
   * Get all configuration items
   * @return {Object}
   */
  all() {
    const config = {};
    for (const [key, value] of this.items) {
      config[key] = value;
    }
    return config;
  }

  /**
   * Merge configuration from an object
   * @param {Object} config - Configuration object
   */
  merge(config) {
    for (const [key, value] of Object.entries(config)) {
      this.set(key, value);
    }
  }
}

// Export singleton instance
export default new Config();

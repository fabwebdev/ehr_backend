/**
 * Logging Configuration
 *
 * This file defines the log channels for your application.
 */

const loggingConfig = {
  /**
   * Default Log Channel
   *
   * This option defines the default log channel that gets used when writing
   * messages to the logs.
   */
  default: process.env.LOG_CHANNEL || "stack",

  /**
   * Deprecations Log Channel
   *
   * This option controls the log channel that should be used to log warnings
   * regarding deprecated PHP and library features.
   */
  deprecations: process.env.LOG_DEPRECATIONS_CHANNEL || "null",

  /**
   * Log Channels
   *
   * Here you may configure the log channels for your application.
   *
   * Available Drivers: "single", "daily", "console", "file", "null", "stack"
   */
  channels: {
    stack: {
      driver: "stack",
      channels: ["single"],
      ignore_exceptions: false,
    },

    single: {
      driver: "single",
      path: "./storage/logs/app.log",
      level: process.env.LOG_LEVEL || "debug",
    },

    daily: {
      driver: "daily",
      path: "./storage/logs/app.log",
      level: process.env.LOG_LEVEL || "debug",
      days: 14,
    },

    console: {
      driver: "console",
      level: process.env.LOG_LEVEL || "debug",
    },

    file: {
      driver: "file",
      path: "./storage/logs/app.log",
      level: process.env.LOG_LEVEL || "debug",
    },

    stderr: {
      driver: "stderr",
      level: process.env.LOG_LEVEL || "debug",
    },

    syslog: {
      driver: "syslog",
      level: process.env.LOG_LEVEL || "debug",
    },

    null: {
      driver: "null",
    },

    emergency: {
      path: "./storage/logs/app.log",
    },
  },
};

export default loggingConfig;

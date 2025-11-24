import LoggerService from '../services/LoggerService.js';

class Logger {
    /**
     * Log an error message
     * @param {String} message - Log message
     * @param {Object} meta - Additional metadata
     */
    static error(message, meta = {}) {
        LoggerService.error(message, meta);
    }
    
    /**
     * Log a warning message
     * @param {String} message - Log message
     * @param {Object} meta - Additional metadata
     */
    static warn(message, meta = {}) {
        LoggerService.warn(message, meta);
    }
    
    /**
     * Log an info message
     * @param {String} message - Log message
     * @param {Object} meta - Additional metadata
     */
    static info(message, meta = {}) {
        LoggerService.info(message, meta);
    }
    
    /**
     * Log a debug message
     * @param {String} message - Log message
     * @param {Object} meta - Additional metadata
     */
    static debug(message, meta = {}) {
        LoggerService.debug(message, meta);
    }
    
    /**
     * Log a verbose message
     * @param {String} message - Log message
     * @param {Object} meta - Additional metadata
     */
    static verbose(message, meta = {}) {
        LoggerService.verbose(message, meta);
    }
    
    /**
     * Log an HTTP request
     * @param {Object} request - Fastify request object
     * @param {Object} reply - Fastify reply object
     * @param {Number} duration - Request duration in ms
     */
    static http(request, reply, duration) {
        LoggerService.http(request, reply, duration);
    }
}

export default Logger;
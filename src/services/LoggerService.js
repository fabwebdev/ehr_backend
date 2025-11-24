import winston from 'winston';
import loggingConfig from '../config/logging.config.js';
import path from 'path';
import fs from 'fs';

class LoggerService {
    constructor() {
        this.logger = null;
        this.config = loggingConfig;
        this.initializeLogger();
    }
    
    /**
     * Initialize the logger
     */
    initializeLogger() {
        const defaultChannel = this.config.default;
        const channelConfig = this.config.channels[defaultChannel] || this.config.channels.single;
        
        const logFormat = winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json()
        );
        
        const transports = [];
        
        // Create logs directory if it doesn't exist
        const logsDir = './storage/logs';
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
        
        // Configure transports based on channel config
        if (channelConfig.channels) {
            // Stack driver - combine multiple channels
            for (const channelName of channelConfig.channels) {
                const subChannel = this.config.channels[channelName];
                if (subChannel) {
                    transports.push(...this.createTransport(subChannel));
                }
            }
        } else {
            // Single channel
            transports.push(...this.createTransport(channelConfig));
        }
        
        this.logger = winston.createLogger({
            level: channelConfig.level || 'debug',
            format: logFormat,
            transports: transports
        });
    }
    
    /**
     * Create a transport based on configuration
     * @param {Object} config - Channel configuration
     * @returns {Array} Array of winston transports
     */
    createTransport(config) {
        const transports = [];
        
        switch (config.driver) {
            case 'console':
                transports.push(
                    new winston.transports.Console({
                        format: winston.format.combine(
                            winston.format.colorize(),
                            winston.format.simple()
                        ),
                        level: config.level
                    })
                );
                break;
                
            case 'single':
            case 'file':
                transports.push(
                    new winston.transports.File({
                        filename: config.path || './storage/logs/app.log',
                        level: config.level,
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.errors({ stack: true }),
                            winston.format.splat(),
                            winston.format.json()
                        )
                    })
                );
                break;
                
            case 'daily':
                // For daily rotation, we would need winston-daily-rotate-file
                transports.push(
                    new winston.transports.File({
                        filename: config.path || './storage/logs/app.log',
                        level: config.level,
                        format: winston.format.combine(
                            winston.format.timestamp(),
                            winston.format.errors({ stack: true }),
                            winston.format.splat(),
                            winston.format.json()
                        )
                    })
                );
                break;
                
            case 'stderr':
                transports.push(
                    new winston.transports.Stream({
                        stream: process.stderr,
                        level: config.level
                    })
                );
                break;
                
            case 'null':
                transports.push(
                    new winston.transports.Null()
                );
                break;
                
            default:
                // Default to console
                transports.push(
                    new winston.transports.Console({
                        format: winston.format.combine(
                            winston.format.colorize(),
                            winston.format.simple()
                        )
                    })
                );
                break;
        }
        
        return transports;
    }
    
    /**
     * Log an error message
     * @param {String} message - Log message
     * @param {Object} meta - Additional metadata
     */
    error(message, meta = {}) {
        this.logger.error(message, meta);
    }
    
    /**
     * Log a warning message
     * @param {String} message - Log message
     * @param {Object} meta - Additional metadata
     */
    warn(message, meta = {}) {
        this.logger.warn(message, meta);
    }
    
    /**
     * Log an info message
     * @param {String} message - Log message
     * @param {Object} meta - Additional metadata
     */
    info(message, meta = {}) {
        this.logger.info(message, meta);
    }
    
    /**
     * Log a debug message
     * @param {String} message - Log message
     * @param {Object} meta - Additional metadata
     */
    debug(message, meta = {}) {
        this.logger.debug(message, meta);
    }
    
    /**
     * Log a verbose message
     * @param {String} message - Log message
     * @param {Object} meta - Additional metadata
     */
    verbose(message, meta = {}) {
        this.logger.verbose(message, meta);
    }
    
    /**
     * Log an HTTP request
     * @param {Object} request - Fastify request object
     * @param {Object} reply - Fastify reply object
     * @param {Number} duration - Request duration in ms
     */
    http(request, reply, duration) {
        const statusCode = reply.statusCode || reply.raw.statusCode || 200;
        const level = statusCode >= 500 ? 'error' : 
                     statusCode >= 400 ? 'warn' : 
                     statusCode >= 300 ? 'info' : 'info';
        
        this.logger.log({
            level: level,
            message: `${request.method} ${request.url} ${statusCode} ${duration}ms`,
            meta: {
                method: request.method,
                url: request.url,
                statusCode: statusCode,
                duration: duration,
                userAgent: request.headers['user-agent'],
                ip: request.ip
            }
        });
    }
}

export default new LoggerService();
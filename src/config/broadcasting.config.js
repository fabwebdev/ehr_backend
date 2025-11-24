/**
 * Broadcasting Configuration
 * 
 * This file defines the broadcast connections that will be used
 * to broadcast events to other systems or over websockets.
 */

const broadcastingConfig = {
    /**
     * Default Broadcaster
     * 
     * This option controls the default broadcaster that will be used by the
     * framework when an event needs to be broadcast.
     * 
     * Supported: "socket.io", "redis", "log", "null"
     */
    default: process.env.BROADCAST_DRIVER || 'null',

    /**
     * Broadcast Connections
     * 
     * Here you may define all of the broadcast connections that will be used
     * to broadcast events to other systems or over websockets.
     */
    connections: {
        'socket.io': {
            driver: 'socket.io',
            host: process.env.SOCKET_IO_HOST || 'localhost',
            port: process.env.SOCKET_IO_PORT || 6001,
            options: {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"]
                }
            }
        },

        redis: {
            driver: 'redis',
            connection: 'default',
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || null,
            database: process.env.REDIS_DB || 0
        },

        log: {
            driver: 'log'
        },

        null: {
            driver: 'null'
        }
    }
};

export default broadcastingConfig;
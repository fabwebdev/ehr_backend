/**
 * Cache Configuration
 * 
 * This file defines the cache stores for your application as
 * well as their drivers.
 */

const cacheConfig = {
    /**
     * Default Cache Store
     * 
     * This option controls the default cache connection that gets used while
     * using this caching library.
     */
    default: process.env.CACHE_DRIVER || 'memory',

    /**
     * Cache Stores
     * 
     * Here you may define all of the cache "stores" for your application as
     * well as their drivers.
     * 
     * Supported drivers: "memory", "redis", "database", "file", "null"
     */
    stores: {
        memory: {
            driver: 'memory',
            max: 100,
            ttl: 600 // 10 minutes
        },

        redis: {
            driver: 'redis',
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: process.env.REDIS_PORT || 6379,
            password: process.env.REDIS_PASSWORD || null,
            database: process.env.REDIS_CACHE_DB || 1
        },

        database: {
            driver: 'database',
            table: 'cache',
            connection: null
        },

        file: {
            driver: 'file',
            path: './storage/cache/data'
        },

        null: {
            driver: 'null'
        }
    },

    /**
     * Cache Key Prefix
     * 
     * When utilizing a RAM based store such as memory or Redis, there might
     * be other applications utilizing the same cache. So, we'll specify a
     * value to get prefixed to all our keys so we can avoid collisions.
     */
    prefix: process.env.CACHE_PREFIX || 'charts_backend_express_cache'
};

export default cacheConfig;
import NodeCache from 'node-cache';
import cacheConfig from '../config/cache.config.js';

class CacheService {
    constructor() {
        this.cache = null;
        this.driver = cacheConfig.default;
        this.config = cacheConfig.stores[this.driver];
        this.prefix = cacheConfig.prefix;
        
        this.init();
    }
    
    /**
     * Initialize the cache based on the configured driver
     */
    init() {
        switch (this.driver) {
            case 'memory':
                this.cache = new NodeCache({
                    stdTTL: this.config.ttl,
                    maxKeys: this.config.max
                });
                break;
                
            case 'file':
                // File-based caching would require additional implementation
                console.warn('File-based caching not yet implemented');
                this.cache = new NodeCache();
                break;
                
            case 'redis':
                // Redis caching would require redis package
                console.warn('Redis caching not yet implemented');
                this.cache = new NodeCache();
                break;
                
            case 'null':
            default:
                // No caching
                this.cache = {
                    set: () => false,
                    get: () => undefined,
                    del: () => false,
                    flushAll: () => {}
                };
                break;
        }
    }
    
    /**
     * Generate a prefixed cache key
     * @param {string} key - The cache key
     * @returns {string} The prefixed cache key
     */
    generateKey(key) {
        return `${this.prefix}:${key}`;
    }
    
    /**
     * Store an item in the cache
     * @param {string} key - The cache key
     * @param {*} value - The value to cache
     * @param {number} ttl - Time to live in seconds (optional)
     * @returns {boolean} Success status
     */
    set(key, value, ttl) {
        const cacheKey = this.generateKey(key);
        return this.cache.set(cacheKey, value, ttl);
    }
    
    /**
     * Retrieve an item from the cache
     * @param {string} key - The cache key
     * @returns {*} The cached value or undefined
     */
    get(key) {
        const cacheKey = this.generateKey(key);
        return this.cache.get(cacheKey);
    }
    
    /**
     * Delete an item from the cache
     * @param {string} key - The cache key
     * @returns {number} Number of deleted keys
     */
    del(key) {
        const cacheKey = this.generateKey(key);
        return this.cache.del(cacheKey);
    }
    
    /**
     * Flush all cached items
     * @returns {boolean} Success status
     */
    flush() {
        return this.cache.flushAll();
    }
    
    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    stats() {
        if (this.cache.getStats) {
            return this.cache.getStats();
        }
        return {};
    }
}

export default new CacheService();
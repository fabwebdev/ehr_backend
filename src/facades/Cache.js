import CacheService from '../services/CacheService.js';

class Cache {
    /**
     * Store an item in the cache
     * @param {string} key - The cache key
     * @param {*} value - The value to cache
     * @param {number} ttl - Time to live in seconds (optional)
     * @returns {boolean} Success status
     */
    static set(key, value, ttl) {
        return CacheService.set(key, value, ttl);
    }
    
    /**
     * Retrieve an item from the cache
     * @param {string} key - The cache key
     * @param {*} defaultValue - Default value if key not found
     * @returns {*} The cached value or default value
     */
    static get(key, defaultValue = null) {
        const value = CacheService.get(key);
        return value !== undefined ? value : defaultValue;
    }
    
    /**
     * Delete an item from the cache
     * @param {string} key - The cache key
     * @returns {number} Number of deleted keys
     */
    static del(key) {
        return CacheService.del(key);
    }
    
    /**
     * Flush all cached items
     * @returns {boolean} Success status
     */
    static flush() {
        return CacheService.flush();
    }
    
    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    static stats() {
        return CacheService.stats();
    }
}

export default Cache;
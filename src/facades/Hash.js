import HashService from '../services/HashService.js';

class Hash {
    /**
     * Hash a value
     * @param {string} value - The value to hash
     * @returns {Promise<string>} The hashed value
     */
    static async make(value) {
        return await HashService.make(value);
    }
    
    /**
     * Check if a value matches a hash
     * @param {string} value - The value to check
     * @param {string} hash - The hash to compare against
     * @returns {Promise<boolean>} True if the value matches the hash
     */
    static async check(value, hash) {
        return await HashService.check(value, hash);
    }
    
    /**
     * Check if a hash needs to be rehashed
     * @param {string} hash - The hash to check
     * @returns {boolean} True if the hash needs to be rehashed
     */
    static needsRehash(hash) {
        return HashService.needsRehash(hash);
    }
}

export default Hash;
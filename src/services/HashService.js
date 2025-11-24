import bcrypt from 'bcryptjs';
import argon2 from 'argon2';
import hashingConfig from '../config/hashing.config.js';

class HashService {
    constructor() {
        this.config = hashingConfig;
    }
    
    /**
     * Hash a value
     * @param {string} value - The value to hash
     * @returns {Promise<string>} The hashed value
     */
    async make(value) {
        switch (this.config.driver) {
            case 'bcrypt':
                return await bcrypt.hash(value, this.config.bcrypt.rounds);
                
            case 'argon2':
                return await argon2.hash(value, {
                    memoryCost: this.config.argon2.memory,
                    parallelism: this.config.argon2.parallelism,
                    timeCost: this.config.argon2.time
                });
                
            default:
                throw new Error(`Unsupported hash driver: ${this.config.driver}`);
        }
    }
    
    /**
     * Check if a value matches a hash
     * @param {string} value - The value to check
     * @param {string} hash - The hash to compare against
     * @returns {Promise<boolean>} True if the value matches the hash
     */
    async check(value, hash) {
        switch (this.config.driver) {
            case 'bcrypt':
                return await bcrypt.compare(value, hash);
                
            case 'argon2':
                return await argon2.verify(hash, value);
                
            default:
                throw new Error(`Unsupported hash driver: ${this.config.driver}`);
        }
    }
    
    /**
     * Check if a hash needs to be rehashed
     * @param {string} hash - The hash to check
     * @returns {boolean} True if the hash needs to be rehashed
     */
    needsRehash(hash) {
        // This is a simplified implementation
        // In practice, you would check the hash parameters
        return false;
    }
}

export default new HashService();
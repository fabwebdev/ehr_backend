import config from '../config/config.js';

/**
 * Get a configuration value
 * @param {String} key - Configuration key
 * @param {any} defaultValue - Default value if key not found
 * @return {any} - Configuration value
 */
export function getConfig(key, defaultValue = null) {
    return config.get(key, defaultValue);
}

/**
 * Set a configuration value
 * @param {String} key - Configuration key
 * @param {any} value - Configuration value
 */
export function setConfig(key, value) {
    config.set(key, value);
}

/**
 * Check if a configuration key exists
 * @param {String} key - Configuration key
 * @return {Boolean}
 */
export function hasConfig(key) {
    return config.has(key);
}

/**
 * Get all configuration items
 * @return {Object}
 */
export function getAllConfig() {
    return config.all();
}

// Export config helpers
export default config;
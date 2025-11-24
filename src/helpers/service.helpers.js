import ServiceContainer from '../services/ServiceContainer.js';

/**
 * Get a service instance
 * @param {String} abstract - Service identifier
 * @return {Object} - Service instance
 */
export function service(abstract) {
    return ServiceContainer.make(abstract);
}

/**
 * Check if a service is registered
 * @param {String} abstract - Service identifier
 * @return {Boolean}
 */
export function hasService(abstract) {
    return ServiceContainer.has(abstract);
}

/**
 * Register a service
 * @param {String} abstract - Service identifier
 * @param {Function|Object} concrete - Service implementation
 * @param {Boolean} shared - Whether the service should be shared (singleton)
 */
export function bindService(abstract, concrete, shared = true) {
    ServiceContainer.bind(abstract, concrete, shared);
}

/**
 * Remove a service
 * @param {String} abstract - Service identifier
 */
export function removeService(abstract) {
    ServiceContainer.remove(abstract);
}

// Export service helpers
export const pdf = () => service('pdf');
export const excel = () => service('excel');
export const browser = () => service('browser');
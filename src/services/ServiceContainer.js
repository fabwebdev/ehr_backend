import PdfService from './PdfService.js';
import ExcelService from './ExcelService.js';
import BrowserService from './BrowserService.js';
import LoggerService from './LoggerService.js';

class ServiceContainer {
    constructor() {
        this.services = new Map();
        this.resolved = new Map();
        this.aliases = new Map();
        
        // Register default services
        this.registerDefaultServices();
    }
    
    /**
     * Register default services
     */
    registerDefaultServices() {
        this.bind('pdf', PdfService);
        this.bind('excel', ExcelService);
        this.bind('browser', BrowserService);
        this.bind('logger', LoggerService);
    }
    
    /**
     * Register a service
     * @param {String} abstract - Service identifier
     * @param {Function|Object} concrete - Service implementation
     * @param {Boolean} shared - Whether the service should be shared (singleton)
     */
    bind(abstract, concrete, shared = true) {
        this.services.set(abstract, {
            concrete: concrete,
            shared: shared
        });
    }
    
    /**
     * Register an alias for a service
     * @param {String} alias - Alias name
     * @param {String} abstract - Service identifier
     */
    alias(alias, abstract) {
        this.aliases.set(alias, abstract);
    }
    
    /**
     * Resolve a service
     * @param {String} abstract - Service identifier
     * @return {Object} - Service instance
     */
    make(abstract) {
        // Check if it's an alias
        if (this.aliases.has(abstract)) {
            abstract = this.aliases.get(abstract);
        }
        
        // Check if we have a resolved instance
        if (this.resolved.has(abstract)) {
            return this.resolved.get(abstract);
        }
        
        // Get service definition
        const service = this.services.get(abstract);
        if (!service) {
            throw new Error(`Service [${abstract}] is not registered.`);
        }
        
        let instance;
        
        // Resolve the service
        if (typeof service.concrete === 'function') {
            // If it's a constructor function, instantiate it
            instance = new service.concrete();
        } else {
            // If it's already an object, use it directly
            instance = service.concrete;
        }
        
        // Store resolved instance if it's shared
        if (service.shared) {
            this.resolved.set(abstract, instance);
        }
        
        return instance;
    }
    
    /**
     * Check if a service is registered
     * @param {String} abstract - Service identifier
     * @return {Boolean}
     */
    has(abstract) {
        return this.services.has(abstract) || this.aliases.has(abstract);
    }
    
    /**
     * Remove a service
     * @param {String} abstract - Service identifier
     */
    remove(abstract) {
        this.services.delete(abstract);
        this.resolved.delete(abstract);
        this.aliases.delete(abstract);
    }
    
    /**
     * Get all registered services
     * @return {Array} - List of service identifiers
     */
    getServices() {
        return Array.from(this.services.keys());
    }
    
    /**
     * Get all resolved services
     * @return {Array} - List of resolved service identifiers
     */
    getResolvedServices() {
        return Array.from(this.resolved.keys());
    }
}

// Export singleton instance
export default new ServiceContainer();
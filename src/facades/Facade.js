import ServiceContainer from '../services/ServiceContainer.js';

class Facade {
    static resolvedInstance = {};
    
    /**
     * Get the root object behind the facade
     * @return {Object}
     */
    static getFacadeRoot() {
        return ServiceContainer.make(this.getFacadeAccessor());
    }
    
    /**
     * Get the registered name of the component
     * @return {String}
     */
    static getFacadeAccessor() {
        throw new Error('Facade does not implement getFacadeAccessor method.');
    }
    
    /**
     * Handle dynamic, static calls to the object
     * @param {String} method - Method name
     * @param {Array} args - Method arguments
     * @return {any}
     */
    static __callStatic(method, args) {
        const instance = this.getFacadeRoot();
        
        if (!instance) {
            throw new Error(`A facade root has not been set for [${this.getFacadeAccessor()}].`);
        }
        
        return instance[method](...args);
    }
}

export default Facade;
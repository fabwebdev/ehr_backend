import Facade from './Facade.js';

class Excel extends Facade {
    /**
     * Get the registered name of the component
     * @return {String}
     */
    static getFacadeAccessor() {
        return 'excel';
    }
}

export default Excel;
import Facade from './Facade.js';

class Browser extends Facade {
    /**
     * Get the registered name of the component
     * @return {String}
     */
    static getFacadeAccessor() {
        return 'browser';
    }
}

export default Browser;
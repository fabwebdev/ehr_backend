import Facade from './Facade.js';

class Log extends Facade {
    /**
     * Get the registered name of the component
     * @return {String}
     */
    static getFacadeAccessor() {
        return 'logger';
    }
}

export default Log;
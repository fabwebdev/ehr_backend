import Facade from './Facade.js';

class Pdf extends Facade {
    /**
     * Get the registered name of the component
     * @return {String}
     */
    static getFacadeAccessor() {
        return 'pdf';
    }
}

export default Pdf;
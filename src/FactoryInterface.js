namespace('Sy');

/**
 * Interface to standardize the factories of the framework
 *
 * @package Sy
 * @interface
 */
Sy.FactoryInterface = function () {};

Sy.FactoryInterface.prototype = Object.create(Object.prototype, {

    /**
     * Method to generate a new instance of the object handle by the factory
     *
     * @return {mixed}
     */
    make: {
        value: function () {}
    }

});
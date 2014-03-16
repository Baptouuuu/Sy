namespace('Sy.Kernel');

/**
 * Framework heart
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.Core = function () {
    this.config = new Sy.Configurator();
    this.container = new Sy.ServiceContainer('sy::core');
};
Sy.Kernel.Core.prototype = Object.create(Object.prototype, {

    /**
     * Return the framework config object
     *
     * @return {Sy.Configurator}
     */

    getConfig: {
        value: function () {
            return this.config;
        }
    },

    /**
     * Return the service container object
     *
     * @return {Sy.ServiceContainer}
     */

    getServiceContainer: {
        value: function () {
            return this.container;
        }
    }

});

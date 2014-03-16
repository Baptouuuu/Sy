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
    },

    /**
     * Initiate the kernel that will inspect the app and build necessary data
     *
     * @return {Sy.Kernel.Core}
     */

    init: {
        value: function () {

            var parser = new Sy.Kernel.AppParser();

            this.config.set('parameters.app.meta', {
                bundles: parser.getBundles(),
                controllers: parser.getControllers(),
                entities: parser.getEntities(),
                viewscreens: parser.getViewScreens()
            });

            this.registerServices(parser.getServices());

        }
    },

    /**
     * Register the app services in the global container
     *
     * @param {Array} services
     *
     * @return {Sy.Kernel.Core}
     */

    registerServices: {
        value: function (services) {

            for (var i = 0, l = services.length; i < l; i++) {
                if (services[i].creator) {
                    this.container.set(
                        services[i].name,
                        services[i].creator
                    );
                } else if (typeof services[i].constructor === 'string') {
                    var name = services[i].name;
                    delete services[i].name;

                    this.container.set(
                        name,
                        services[i]
                    );
                }
            }

            return this;

        }
    }

});

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
    this.controllerManager = new Sy.Kernel.ControllerManager();
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

    boot: {
        value: function () {

            var tester = new Sy.Kernel.FeatureTester(),
                parser = new Sy.Kernel.AppParser();

            tester.testBrowser();

            this.config.set('parameters.app.meta', {
                bundles: parser.getBundles(),
                controllers: parser.getControllers(),
                entities: parser.getEntities(),
                viewscreens: parser.getViewScreens()
            });

            this
                .registerServices(parser.getServices())
                .registerControllers(parser.getControllers())
                .configureLogger();

        }
    },

    /**
     * Register the app services in the global container
     *
     * @private
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
                    var def = {},
                        name = services[i].name;
                    delete services[i].name;

                    def[name] = services[i];
                    this.container.set(def);
                }
            }

            return this;

        }
    },

    /**
     * Register all app controllers into the manager
     *
     * @private
     * @param {Array} controllers
     *
     * @return {Sy.Kernel.Core}
     */

    registerControllers: {
        value: function (controllers) {

            var registryFactory = this.container.get('sy::core::registry::factory');

            this.controllerManager
                .setMetaRegistry(registryFactory.make())
                .setLoadedControllersRegistry(registryFactory.make())
                .setMediator(this.container.get('sy::core::mediator'))
                .setServiceContainer(this.container)
                .setCache(this.config.get('controllers.cache'))
                .setCacheLength(this.config.get('controllers.cacheLength'));

            for (var i = 0, l = controllers.length; i < l; i++) {
                ctrlManager.registerController(
                    controllers[i].name,
                    controllers[i].creator
                );
            }

            this.controllerManager.boot();

            return this;

        }
    },

    /**
     * Adapt the handlers available in the logger depending on the app env
     * If env set to 'prod' remove all of them except for 'error'
     *
     * @return {Sy.Kernel.Core}
     */

    configureLogger: {
        value: function () {

            var env = this.config.get('env'),
                logger = this.container.get('sy::core::logger');

            if (env === 'prod') {
                logger
                    .removeHandler(logger.LOG)
                    .removeHandler(logger.DEBUG)
                    .removeHandler(logger.INFO);
            }

            return this;

        }
    }

});

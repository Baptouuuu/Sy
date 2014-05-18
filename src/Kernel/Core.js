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
    this.actionBinder = new Sy.Kernel.ActionBinder();
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

            parser
                .buildServices(this.container)
                .buildConfig(this.config);

            this
                .registerControllers(parser.getControllers())
                .configureLogger()
                .registerShutdownListener();

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

            var registryFactory = this.container.get('sy::core::registry::factory'),
                mediator = this.container.get('sy::core::mediator');

            this.actionBinder.setMediator(mediator);

            this.controllerManager
                .setMetaRegistry(registryFactory.make())
                .setLoadedControllersRegistry(registryFactory.make())
                .setMediator(mediator)
                .setServiceContainer(this.container)
                .setCache(this.config.get('controllers.cache'))
                .setCacheLength(this.config.get('controllers.cacheLength'))
                .setActionBinder(this.actionBinder);

            for (var i = 0, l = controllers.length; i < l; i++) {
                this.controllerManager.registerController(
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
    },

    /**
     * Add a `beforeunload` on the window to fire a channel to notify the app
     * it's being closed, so it can be properly shutdown
     *
     * @return {Sy.Kernel.Core}
     */

    registerShutdownListener: {
        value: function () {
            window.addEventListener('beforeunload', function (event) {
                try {
                    this.container.get('sy::core::mediator').publish(
                        'app::shutdown',
                        event
                    );
                } catch (error) {
                    return error.message;
                }
            }.bind(this), false);

            return this;
        }
    }

});

namespace('Sy.Kernel');

/**
 * Framework heart
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.Core = function (env, debug) {
    this.config = new Sy.Configurator();
    this.container = new Sy.ServiceContainer.Core();
    this.controllerManager = new Sy.Kernel.ControllerManager();
    this.actionDispatcher = new Sy.Kernel.ActionDispatcher();

    this.container.setCompiler(new Sy.ServiceContainer.Compiler());

    this.config
        .set('app.environment', env)
        .set('app.debug', !!debug);
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

    getContainer: {
        value: function () {
            return this.container;
        }
    },

    /**
     * Register all bundles needed for the app
     *
     * @return {Array}
     */

    registerBundles: {
        value: function () {
            return [];
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

            this.registerBundles().forEach(function (bundle) {
                parser.setBundle(bundle[0], bundle[1]);
            }.bind(this));

            this.config.set('app.meta', {
                controllers: parser.getControllers(),
                entities: parser.getEntities()
            });

            this.container.setParameters(this.config);

            parser
                .buildConfig(this.config)
                .buildServices(this.container);

            this.registerShutdownListener();

            this.container.compile();

            parser.registerValidationRules(this.container);

            this
                .registerControllers(parser.getControllers())
                .configureLogger();
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
                mediator = this.container.get('sy::core::mediator'),
                viewport = this.container.get('sy::core::viewport'),
                logger = this.container.get('sy::core::logger'),
                viewscreensManager = this.container.get('sy::core::view::manager');

            this.controllerManager
                .setMetaRegistry(registryFactory.make())
                .setLoadedControllersRegistry(registryFactory.make())
                .setMediator(mediator)
                .setServiceContainer(this.container)
                .setCache(this.config.get('controllers.cache'))
                .setCacheLength(this.config.get('controllers.cacheLength'));

            this.actionDispatcher
                .setViewPort(viewport)
                .setControllerManager(this.controllerManager)
                .setMediator(mediator)
                .setLogger(logger);

            for (var i = 0, l = controllers.length; i < l; i++) {
                this.controllerManager.registerController(
                    controllers[i].name,
                    controllers[i].creator
                );
            }

            this.controllerManager.boot();
            this.actionDispatcher.bindViewScreens(
                viewscreensManager.getViewScreens()
            );

            if (viewport.getCurrentViewScreen()) {
                this.controllerManager.buildController(
                    viewport.getCurrentViewScreen()
                );
            }

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

            var debug = this.config.get('app.debug'),
                logger = this.container.get('sy::core::logger');

            if (debug === false) {
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
                    var evt = new Sy.Event.AppShutdownEvent(event);

                    this.container.get('sy::core::mediator').publish(
                        evt.KEY,
                        evt
                    );
                } catch (error) {
                    return error.message;
                }
            }.bind(this), false);

            return this;
        }
    }

});

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
    this.container = new Sy.ServiceContainer.Core();
    this.controllerManager = new Sy.Kernel.ControllerManager();
    this.actionDispatcher = new Sy.Kernel.ActionDispatcher();
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
     * Initiate the kernel that will inspect the app and build necessary data
     *
     * @return {Sy.Kernel.Core}
     */

    boot: {
        value: function () {

            var tester = new Sy.Kernel.FeatureTester(),
                parser = new Sy.Kernel.AppParser();

            tester.testBrowser();

            if (this.config.get('env') !== 'prod') {
                parser.setLogger(this.container.get('sy::core::logger'));
            }

            this.config.set('parameters.app.meta', {
                bundles: parser.getBundles(),
                controllers: parser.getControllers(),
                entities: parser.getEntities(),
                viewscreens: parser.getViewScreens()
            });

            parser
                .buildServices(this.container)
                .buildConfig(this.config)
                .registerValidationRules(this.container);

            this
                .registerControllers(parser.getControllers())
                .configureLogger()
                .registerShutdownListener()
                .registerFormTypes()
                .registerEventSubscribers();

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
    },

    /**
     * Retrieve services tagged as form type and register them in the form builder
     *
     * @return {Sy.Kernel.Core} self
     */

    registerFormTypes: {
        value: function () {
            this.container
                .findTaggedServiceIds('form.type')
                .forEach(function (el) {
                    this.container
                        .get('sy::core::form')
                        .registerFormType(
                            this.container.get(el.id)
                        );
                }, this);

            return this;
        }
    },

    /**
     * Retrieve services tagged as event subscriber and register them
     * in the mediator
     *
     * @return {Sy.Kernel.Core} self
     */

    registerEventSubscribers: {
        value: function () {
            this.container
                .findTaggedServiceIds('event.subscriber')
                .forEach(function (el) {
                    var subscriber = this.container.get(el.id),
                        events;

                    if (!(subscriber instanceof Sy.EventSubscriberInterface)) {
                        throw new TypeError('Invalid event subscriber');
                    }

                    events = subscriber.getSubscribedEvents();

                    for (var evt in events) {
                        if (events.hasOwnProperty(evt)) {
                            this.container
                                .get('sy::core::mediator')
                                .subscribe({
                                    channel: evt,
                                    fn: subscriber[events[evt].method],
                                    context: subscriber,
                                    priority: subscriber[events[evt].priority],
                                    async: subscriber[events[evt].async]
                                });
                        }
                    }

                }, this);

            return this;
        }
    }

});

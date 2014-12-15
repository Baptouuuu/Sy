namespace('Sy.Kernel');

/**
 * Handles controller creation when viewscreen loaded and putting them to sleep when not used
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.ControllerManager = function () {
    this.meta = null;
    this.loaded = null;
    this.dispatcher = null;
    this.container = null;
    this.current = null;
    this.cache = null;
    this.cacheLength = null;
    this.cacheOrder = [];
};
Sy.Kernel.ControllerManager.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry to hold metadata on app controllers
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setMetaRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.meta = registry;

            return this;

        }
    },

    /**
     * Set a registry to hold loaded controllers
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setLoadedControllersRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.loaded = registry;

            return this;

        }
    },

    /**
     * Register a new controller
     *
     * @param {String} alias
     * @param {Function} constructor
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    registerController: {
        value: function (alias, constructor) {

            if (!(constructor.prototype instanceof Sy.ControllerInterface)) {
                throw new TypeError('Invalid controller constructor');
            }

            this.meta.set(alias, constructor);

            return this;

        }
    },

    /**
     * Sets the event dispatcher to subscribe to viewport events
     *
     * @param {Sy.EventDispatcher.EventDispatcherInterface} dispatcher
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setDispatcher: {
        value: function (dispatcher) {

            if (!(dispatcher instanceof Sy.EventDispatcher.EventDispatcherInterface)) {
                throw new TypeError('Invalid dispatcher');
            }

            this.dispatcher = dispatcher;

            return this;

        }
    },

    /**
     * Set the service container that will be injected in each controller
     *
     * @param {Sy.ServiceContainer.Core} container
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setServiceContainer: {
        value: function (container) {

            if (!(container instanceof Sy.ServiceContainer.Core)) {
                throw new TypeError('Invalid service container');
            }

            this.container = container;

            return this;

        }
    },

    /**
     * Set if the manager must keep a reference of each instanciated controllers
     * or rebuild them each time a viewscreen referencing it is loaded
     *
     * @param {Boolean} cache
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setCache: {
        value: function (cache) {

            this.cache = !!cache;

            return this;

        }
    },

    /**
     * Set the cache length
     * If null or undefined is passed, no controller will be destroyed
     *
     * @param {mixed} length
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setCacheLength: {
        value: function (length) {

            this.cacheLength = length;

            return this;

        }
    },

    /**
     * Listener to on viewscreen display
     * Used to load appropriate controller
     *
     * @private
     * @param {Sy.View.Event.ViewPortEvent} event
     *
     * @return {void}
     */

    onDisplayListener: {
        value: function (event) {

            var viewscreen = event.getViewScreen(),
                alias = viewscreen.getNode().dataset.syController;

            if (this.loaded.has(alias) && this.current !== alias) {
                this.loaded.get(this.current).sleep();
                this.loaded.get(alias).wakeup();
                this.current = alias;
            } else {
                this.buildController(viewscreen);
            }

        }
    },

    /**
     * Determine how (even if) a controller must be cached
     *
     * @private
     * @param {String} alias
     * @param {Sy.ControllerInterface} instance
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    cacheController: {
        value: function (alias, instance) {

            if (
                this.cache === false ||
                (
                    this.cache === true &&
                    typeof this.cacheLength === 'number' &&
                    this.loaded.length() > this.cacheLength
                )
            ) {
                this.loaded.get(this.cacheOrder[0]).destroy();
                this.loaded.remove(this.cacheOrder[0]);
                this.cacheOrder.splice(0, 1);
            }

            this.loaded.set(alias, instance);
            this.cacheOrder.push(alias);

            return this;

        }
    },

    /**
     * Build a controller instance for the specified viewscreen
     *
     * @param {Sy.View.ViewScreen} viewscreen
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    buildController: {
        value: function (viewscreen) {

            if (!(viewscreen instanceof Sy.View.ViewScreen)) {
                throw new TypeError('Invalid viewscreen');
            }

            var alias = viewscreen.getNode().dataset.syController,
                bundleName = alias.split('::')[0],
                instance;

            if (!this.meta.has(alias)) {
                throw new ReferenceError('The controller with the alias "' + alias + '" is undefined');
            }

            instance = new (this.meta.get(alias))();
            instance
                .setDispatcher(this.dispatcher)
                .setServiceContainer(this.container)
                .setViewScreen(viewscreen)
                .init();

            this.cacheController(alias, instance);
            this.current = alias;

            return this;

        }
    },

    /**
     * Check if a controller is built
     *
     * @param {String} alias Controller alias
     *
     * @return {Boolean}
     */

    isControllerBuilt: {
        value: function (alias) {

            return this.loaded.has(alias);

        }
    },

    /**
     * Get the instance of a controller
     *
     * @param {String} alias Controller alias
     *
     * @return {Sy.ControllerInterface}
     */

    getController: {
        value: function (alias) {

            return this.loaded.get(alias);

        }
    },

    /**
     * Bootstrap the manager
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    boot: {
        value: function () {

            this.dispatcher.addListener(
                Sy.View.Event.ViewPortEvent.prototype.PRE_DISPLAY,
                this.onDisplayListener.bind(this)
            );

        }
    }

});

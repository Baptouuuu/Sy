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
    this.mediator = null;
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
     * Sets the mediator to subscribe to viewport events
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setMediator: {
        value: function (mediator) {

            if (!(mediator instanceof Sy.Lib.Mediator)) {
                throw new TypeError('Invalid mediator');
            }

            this.mediator = mediator;

        }
    },

    /**
     * Set the service container that will be injected in each controller
     *
     * @param {Sy.ServiceContainerInterface} container
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setServiceContainer: {
        value: function (container) {

            if (!(container instanceof Sy.ServiceContainerInterface)) {
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
     * @param {Sy.View.ViewScreen} viewscreen
     *
     * @return {void}
     */

    onDisplayListener: {
        value: function (viewscreen) {

            var ctrl = viewscreen.getNode().dataset.syController,
                instance,
                bundleName;

            if (this.loaded.has(ctrl)) {

                if (this.current !== ctrl) {
                    this.loaded.get(this.current).sleep();
                    this.loaded.get(ctrl).wakeup();
                    this.current = ctrl;
                }

            } else if (this.meta.has(ctrl)) {

                bundleName = ctrl.split('::')[0];

                instance = new (this.meta.get(ctrl))();
                instance
                    .setBundle(bundleName)
                    .setMediator(this.mediator)
                    .setServiceContainer(this.container);

                this.cacheController(ctrl, instance);

                this.current = ctrl;

            } else {

                throw new ReferenceError('The controller with the alias "' + ctrl + '" is undefined');

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

            if (this.cache === false) {
                return this;
            }

            this.loaded.set(alias, instance);

            if (typeof this.cacheLength === 'number') {
                this.cacheOrder.push(alias);

                if (this.loaded.length() > this.cacheLength) {
                    this.loaded.get(this.cacheOrder[0]).destroy();
                    this.loaded.remove(this.cacheOrder[0]);
                    this.cacheOrder.splice(0, 1);
                }
            }

            return this;

        }
    },

    /**
     * Bootstrap the manager
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    boot: {
        value: function () {

            this.mediator.subscribe({
                channel: 'view::on::pre::display',
                fn: this.onDisplayListener,
                context: this
            });

        }
    }

});

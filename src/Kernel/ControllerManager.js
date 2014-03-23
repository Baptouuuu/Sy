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
        value: function (registry) {}
    },

    /**
     * Set a registry to hold loaded controllers
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setLoadedControllersRegistry: {
        value: function (registry) {}
    },

    /**
     * Sets the mediator to subscribe to viewport events
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setMediator: {
        value: function (mediator) {}
    },

    /**
     * Set the service container that will be injected in each controller
     *
     * @param {Sy.ServiceContainerInterface} container
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setServiceContainer: {
        value: function (container) {}
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
        value: function (viewscreen) {}
    },

    /**
     * Bootstrap the manager
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    boot: {
        value: function () {}
    }

});

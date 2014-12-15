namespace('Sy');

/**
 * Interface for controllers
 *
 * @package Sy
 * @interface
 */

Sy.ControllerInterface = function () {};
Sy.ControllerInterface.prototype = Object.create(Object.prototype, {

    /**
     * Shortcut to the event dispatcher subscribe method
     * It automatically register the listener with the controller as context
     *
     * @param {string} channel
     * @param {function} fn
     *
     * @return {Sy.ControllerInterface}
     */

    listen: {
        value: function (channel, fn) {}
    },

    /**
     * Shortcut to the event dispatcher publish method.
     * See the event dispatcher documentation to understand how to pass arguments
     *
     * @return {Sy.ControllerInterface}
     */

    broadcast: {
        value: function (name, event) {}
    },

    /**
     * Method called when the controller is not used by the framework,
     * like when the controller is not used for the current screen
     *
     * @return {void}
     */

    sleep: {
        value: function () {}
    },

    /**
     * Method called when the controller is reloaded by the framework,
     * happens if a previous viewscreen is displayed back in the viewport
     *
     * @return {void}
     */

    wakeup: {
        value: function () {}
    },

    /**
     * Method called when the controller is destroyed by the framework
     *
     * @return {void}
     */
    destroy: {
        value: function () {}
    },

    /**
     * Set the event dispatcher
     *
     * @param {Sy.EventDispatcher.EventDispatcherInterface} dispatcher
     *
     * @return {Sy.ControllerInterface}
     */

    setDispatcher: {
        value: function (dispatcher) {}
    },

    /**
     * Set the service container
     *
     * @param {Sy.ServiceContainer.Core} container
     *
     * @return {Sy.ControllerInterface}
     */

    setServiceContainer: {
        value: function (container) {}
    },

    /**
     * Set the viewscreen it's related to
     *
     * @param {Sy.View.ViewScreen} viewscreen
     *
     * @return {Sy.ControllerInterface}
     */

    setViewScreen: {
        value: function (viewscreen) {}
    },

    /**
     * Notify the controller it's fully loaded
     * Can be used to retrieve needed dependencies
     *
     * @return {Sy.ControllerInterface}
     */

    init: {
        value: function () {}
    }

});

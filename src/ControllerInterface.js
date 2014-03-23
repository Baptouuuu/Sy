namespace('Sy');

/**
 * Interface for controllers
 *
 * @package Sy
 * @interface
 */

Sy.ControllerInterface = function () {

    this.container = {};
    this.mediator = {};

};

Sy.ControllerInterface.prototype = Object.create(Object.prototype, {

    /**
     * Shortcut to the mediator subscribe method
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
     * Shortcut to the mediator publish method.
     * See the mediator documentation to understand how to pass arguments
     *
     * @return {Sy.ControllerInterface}
     */

    broadcast: {
        value: function () {}
    },

    /**
     * Create a new Entity object
     *
     * @param {string} entity Entity path like "BundleName::EntityName", you can pass only "EntityName" if it's in the current bundle
     * @param {object} attributes Attributes object to create your entity
     *
     * @return {Sy.EntityInterface}
     */

    new: {
        value: function (entity, attributes) {}
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
     * Set the mediator
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.ControllerInterface}
     */

    setMediator: {
        value: function (mediator) {}
    },

    /**
     * Set the service container
     *
     * @param {Sy.ServiceContainerInterface} container
     *
     * @return {Sy.ControllerInterface}
     */

    setServiceContainer: {
        value: function (container) {}
    }

});
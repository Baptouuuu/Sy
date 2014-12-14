namespace('Sy.EventDispatcher');

/**
 * Interface for any event dispatcher
 *
 * @package Sy
 * @subpackage EventDispatcher
 * @class
 */

Sy.EventDispatcher.EventDispatcherInterface = function () {};
Sy.EventDispatcher.EventDispatcherInterface.prototype = Object.create(Object.prototype, {

    /**
     * Dispatch en event
     *
     * @param {String} name
     * @param {Event} event
     *
     * @return {Event}
     */

    dispatch: {
        value: function (name, event) {}
    },

    /**
     * Add a listener
     *
     * @param {String} name Event name
     * @param {Function} listener
     * @param {Integer} priority
     *
     * @return {EventDispatcherInterface} self
     */

    addListener: {
        value: function (name, listener, priority) {}
    },

    /**
     * Adds an event subsriber
     *
     * @param {EventSubscriberInterface} subscriber
     *
     * @return {EventDispatcherInterface} self
     */

    addSubscriber: {
        value: function (subscriber) {}
    },

    /**
     * Remove the given listener
     *
     * @param {String} name Event name
     * @param {Function} listener
     *
     * @return {EventDispatcherInterface} self
     */

    removeListener: {
        value: function (name, listener) {}
    },

    /**
     * Remove a subscriber
     *
     * @param {EventSubscriberInterface} subscriber
     *
     * @return {EventDispatcherInterface} self
     */

    removeSubsriber: {
        value: function (subscriber) {}
    },

    /**
     * Return all the listeners for the given event name
     *
     * @param {String} name
     *
     * @return {Array}
     */

    getListeners: {
        value: function (name) {}
    },

    /**
     * Check if an event name has listeners
     *
     * @param {String} name
     *
     * @return {Boolean}
     */

    hasListeners: {
        value: function (name) {}
    }

});

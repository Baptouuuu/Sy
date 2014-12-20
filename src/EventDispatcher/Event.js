namespace('Sy.EventDispatcher');

/**
 * Base class to hold event data
 *
 * @package Sy
 * @subpackage EventDispatcher
 * @class
 */

Sy.EventDispatcher.Event = function () {
    this.propagationStopped = false;
    this.dispatcher = null;
    this.name = null;
};
Sy.EventDispatcher.Event.prototype = Object.create(Object.prototype, {

    /**
     * Check if the propagation is stopped
     *
     * @return {Boolean}
     */

    isPropagationStopped: {
        value: function () {
            return this.propagationStopped;
        }
    },

    /**
     * Stop the event propagation
     */

    stopPropagation: {
        value: function () {
            this.propagationStopped = true;
        }
    },

    /**
     * Set the event dipatcher handling this event
     *
     * @param {EventDispatcherInterface} dispatcher
     */

    setDispatcher: {
        value: function (dispatcher) {
            if (!(dispatcher instanceof Sy.EventDispatcher.EventDispatcherInterface)) {
                throw new TypeError('Invalid event dispatcher');
            }

            this.dispatcher = dispatcher;
        }
    },

    /**
     * Return the event dispacther handling this event
     *
     * @return {EventDispatcherInterface}
     */

    getDispatcher: {
        value: function () {
            return this.dispatcher;
        }
    },

    /**
     * Set the event name
     *
     * @param {String} name
     */

    setName: {
        value: function (name) {
            this.name = name;
        }
    },

    /**
     * Return the event name
     *
     * @return {String}
     */

    getName: {
        value: function () {
            return this.name;
        }
    }
});

namespace('Sy.EventDispatcher');

/**
 * Generic event that an hold any data
 *
 * @package Sy
 * @subpackage EventDispatcher
 * @class
 * @extends {Sy.EventDispatcher.Event}
 */

Sy.EventDispatcher.GenericEvent = function (subject, args) {
    Sy.EventDispatcher.Event.call(this);

    if (args !== undefined && !(args instanceof Object)) {
        throw new TypeError('Event arguments must be an object');
    }

    this.subject = subject;
    this.args = args || {};
};
Sy.EventDispatcher.GenericEvent.prototype = Object.create(Sy.EventDispatcher.Event.prototype, {

    /**
     * Return the event subject
     *
     * @return {String}
     */

    getSubject: {
        value: function () {
            return this.subject;
        }
    },

    /**
     * Return an argument
     *
     * @param {String} key
     *
     * @return {mixed}
     */

    getArgument: {
        value: function (key) {
            return this.args[key];
        }
    },

    /**
     * Set an argument
     *
     * @param {String} key
     * @param {mixed} data
     *
     * @return {GenericEvent} self
     */

    setArgument: {
        value: function (key, data) {
            this.args[key] = data;

            return this;
        }
    },

    /**
     * Return all the arguments
     *
     * @return {Object}
     */

    getArguments: {
        value: function () {
            return this.args;
        }
    },

    /**
     * Set all arguments at once
     *
     * @param {Object} args
     *
     * @return {GenericEvent} self
     */

    setArguments: {
        value: function (args) {
            if (!(args instanceof Object)) {
                throw new TypeError('Event arguments must be an object');
            }

            this.args = args;

            return this;
        }
    }
});

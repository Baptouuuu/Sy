namespace('Sy.EventDispatcher');

/**
 * Disptacher fixed throughout the runtime
 *
 * @package Sy
 * @subpackage EventDispatcher
 * @class
 * @implements {Sy.EventDispatcher.EventDispatcherInterface}
 */

Sy.EventDispatcher.ImmutableEventDispatcher = function (dispatcher) {
    if (!(dispatcher instanceof Sy.EventDispatcher.EventDispatcherInterface)) {
        throw new TypeError('Invalid event dispatcher');
    }

    this.dispatcher = dispatcher;
}
Sy.EventDispatcher.ImmutableEventDispatcher.prototype = Object.create(Sy.EventDispatcher.EventDispatcherInterface.prototype, {

    /**
     * @inheritDoc
     */

    dispatch: {
        value: function (name, event) {
            return this.dispatcher.dispatch(name, event);
        }
    },

    /**
     * @inheritDoc
     */

    addListener: {
        value: function (name, listener, priority) {
            throw new Error('Unmodifiable event dispatchers must not be modified');
        }
    },

    /**
     * @inheritDoc
     */

    addSubscriber: {
        value: function (subscriber) {
            throw new Error('Unmodifiable event dispatchers must not be modified');
        }
    },

    /**
     * @inheritDoc
     */

    removeListener: {
        value: function (name, listener) {
            throw new Error('Unmodifiable event dispatchers must not be modified');
        }
    },

    /**
     * @inheritDoc
     */

    removeSubscriber: {
        value: function (subscriber) {
            throw new Error('Unmodifiable event dispatchers must not be modified');
        }
    },

    /**
     * @inheritDoc
     */

    getListeners: {
        value: function (name) {
            return this.dispatcher.getListeners(name);
        }
    },

    /**
     * @inheritDoc
     */

    hasListeners: {
        value: function (name) {
            return this.dispatcher.hasListeners(name);
        }
    }

});

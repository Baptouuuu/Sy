namespace('Sy.EventDispatcher');

/**
 * Default implementation of the dispatcher interface
 *
 * @package Sy
 * @subpackage EventDispatcher
 * @class
 * @implements {Sy.EventDispatcher.EventDispatcherInterface}
 */

Sy.EventDispatcher.EventDispatcher = function () {
    this.listeners = {};
    this.sorted = {};
};
Sy.EventDispatcher.EventDispatcher.prototype = Object.create(Sy.EventDispatcher.EventDispatcherInterface.prototype, {

    /**
     * @inheritDoc
     */

    dispatch: {
        value: function (name, event) {
            if (!event) {
                event = new Sy.EventDispatcher.Event();
            }

            if (!(event instanceof Sy.EventDispatcher.Event)) {
                throw new TypeError('Invalid event object');
            }

            event.setDispatcher(this);
            event.setName(name);

            if (!this.hasListeners(name)) {
                return event;
            }

            this.doDispatch(this.getListeners(name), name, event);

            return event;
        }
    },

    /**
     * Call all the listeners with the given event
     *
     * @private
     * @param {Array} listeners
     * @param {String} name Event name
     * @param {Event} event
     */

    doDispatch: {
        value: function (listeners, name, event) {
            for (var i = 0, l = listeners.length; i < l; i++) {
                listeners[i](event, name, this);

                if (event.isPropagationStopped()) {
                    break;
                }
            }
        }
    },

    /**
     * @inheritDoc
     */

    addListener: {
        value: function (name, listener, priority) {
            if (
                !(listener instanceof Function) &&
                (
                    !(listener instanceof Array) &&
                    !(listener[0] instanceof Object) &&
                    !(listener[1] instanceof Function)
                )
            ) {
                throw new TypeError('A listener must be a function');
            }

            if (!(this.listeners[name] instanceof Array)) {
                this.listeners[name] = [];
            }

            if (this.sorted[name]) {
                this.sorted[name] = undefined;
            }

            this.listeners[name].push({
                listener: listener,
                priority: priority || 0
            });

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    addSubscriber: {
        value: function (subscriber) {
            if (!(subscriber instanceof Sy.EventDispatcher.EventSubscriberInterface)) {
                throw new TypeError('Invalid event subscriber');
            }

            var subscribed = subscriber.getSubscribedEvents();

            for (var name in subscribed) {
                if (subscribed.hasOwnProperty(name)) {
                    if (subscribed[name] instanceof Array) {
                        for (var i = 0, l = subscribed[name].length; i < l; i++) {
                            this.addListener(
                                name,
                                [subscriber, subscriber[subscribed[name][i].method]],
                                subscribed[name][i].priority
                            );
                        }
                    } else if (subscribed[name] instanceof Object) {
                        this.addListener(
                            name,
                            [subscriber, subscriber[subscribed[name].method]],
                            subscribed[name].priority
                        );
                    } else {
                        this.addListener(
                            name,
                            subscriber[subscribed[name]]
                        );
                    }
                }
            }

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    removeListener: {
        value: function (name, listener) {
            if (
                !(listener instanceof Function) &&
                (
                    !(listener instanceof Array) &&
                    !(listener[0] instanceof Object) &&
                    !(listener[1] instanceof Function)
                )
            ) {
                throw new TypeError('Invalid event listener');
            }

            if (!this.listeners.hasOwnProperty(name)) {
                return this;
            }

            if (this.sorted[name]) {
                this.sorted[name] = undefined;
            }

            for (var i = 0, l = this.listeners[name].length; i < l; i++) {
                if (
                    (
                        listener instanceof Array &&
                        this.listeners[name][i].listener[0] === listener[0] &&
                        this.listeners[name][i].listener[1] === listener[1]
                    ) ||
                    this.listeners[name][i].listener === listener
                ) {
                    this.listeners[name].splice(i, 1);
                    break;
                }
            }

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    removeSubscriber: {
        value: function (subscriber) {
            if (!(subscriber instanceof Sy.EventDispatcher.EventSubscriberInterface)) {
                throw new TypeError('Invalid event subscriber');
            }

            var subscribed = subscriber.getSubscribedEvents();

            for (var name in subscribed) {
                if (subscribed.hasOwnProperty(name)) {
                    if (subscribed[name] instanceof Array) {
                        for (var i = 0, l = subscribed[name].length; i < l; i++) {
                            this.removeListener(
                                name,
                                [subscriber, subscriber[subscribed[name][i].method]]
                            );
                        }
                    } else if (subscribed[name] instanceof Object) {
                        this.removeListener(
                            name,
                            [subscriber, subscriber[subscribed[name].method]]
                        );
                    } else {
                        this.removeListener(
                            name,
                            subscriber[subscribed[name]]
                        );
                    }
                }
            }

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    getListeners: {
        value: function (name) {
            if (!this.hasListeners(name)) {
                return [];
            }

            if (!this.sorted[name]) {
                this.sortListeners(name);
            }

            return this.sorted[name];
        }
    },

    /**
     * @inheritDoc
     */

    hasListeners: {
        value: function (name) {
            return !!this.listeners[name] && !!this.listeners[name].length;
        }
    },

    /**
     * Reorder listeners by their priority
     *
     * @private
     * @param {String} name Event name
     */

    sortListeners: {
        value: function (name) {
            this.listeners[name].sort(function (a, b) {
                return a.priority < b.priority;
            });
            this.sorted[name] = this.listeners[name].map(function (element) {
                if (element.listener instanceof Array) {
                    return element.listener[1].bind(element.listener[0]);
                }

                return element.listener;
            });
        }
    }

});

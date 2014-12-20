/*! sy#1.1.0 - 2014-12-20 */
/**
 * Transform a dotted string to a multi level object.
 * String like "Foo.Bar.Baz" is like doing window.Foo = {Bar: {Baz: {}}}.
 * If object exists it is not transformed.
 * You can modify the root object by doing namespace.call(rootObject, nsString).
 *
 * @param {string} ns
 *
 * @return {object} Last object created
 */

function namespace (ns) {

    var namespaces = null,
        referer = this;

    if (typeof ns === 'string') {
        namespaces = ns.split('.');
    } else if (ns instanceof Array && ns.length > 0) {
        namespaces = ns;
    } else {
        return referer;
    }

    referer[namespaces[0]] = referer[namespaces[0]] || {};

    ns = namespaces.shift();

    return namespace.call(referer[ns], namespaces);

}

/**
 * Set a value into objects, where the chain of object is defined as a dotted string.
 * The last element of the string represent the attribute.
 * The root object can be changed by doing objectSetter.call(rootObject, nsString, value).
 *
 * @param {string} ns
 * @param {mixed} value
 */

function objectSetter (ns, value) {

    var namespaces = '',
        attr = '',
        referer = this,
        idx = ns.lastIndexOf('.');

    if (idx >= 0) {

        attr = ns.substr(idx + 1);
        namespaces = ns.substr(0, idx);

        referer = namespace.call(referer, namespaces);

    } else {

        attr = ns;

    }

    referer[attr] = value;

}

/**
 * Retrieve the attribute in objects, where the chain of object is defined as a dotted string.
 * The last element of the string represent the attribute.
 * The root object can be changed by doing objectGetter.call(rootObject, nsString).
 *
 * @param {string} ns
 *
 * @return {mixed}
 */

function objectGetter (ns) {

    var namespaces = null,
        referer = this;

    if (typeof ns === 'string') {
        namespaces = ns.split('.');

        if (namespaces.length === 1) {
            return referer[ns];
        }

    } else if (ns instanceof Array && ns.length > 1) {
        namespaces = ns;
    } else if (ns instanceof Array && ns.length === 1) {
        return referer[ns[0]];
    } else {
        return undefined;
    }

    ns = namespaces.shift();

    return objectGetter.call(referer[ns], namespaces);

}

/**
 * Capitalize the first letter of a string
 *
 * @param {String} string
 *
 * @return {String}
 */

function capitalize (string) {
    return string.substr(0, 1).toUpperCase() + string.substr(1);
}

/**
 * Use reflection to discover nested objects
 * For an element of the object path (ie: 'foo')
 * the reflection will look in this exact order:
 *     .getFoo()
 *     .get() //and 'foo' will be passed to this method
 *     .foo
 *
 * @param {String} ns
 *
 * @return {mixed}
 */

function reflectedObjectGetter (ns) {

    var namespaces = null,
        referer = this;

    if (typeof ns === 'string') {
        namespaces = ns.split('.');

        if (namespaces.length === 1) {
            return getReflectedValue.call(referer, ns);
        }

    } else if (ns instanceof Array && ns.length > 1) {
        namespaces = ns;
    } else if (ns instanceof Array && ns.length === 1) {
        return getReflectedValue.call(referer, ns[0]);
    } else {
        return undefined;
    }

    ns = namespaces.shift();

    return reflectedObjectGetter.call(getReflectedValue.call(referer, ns), namespaces);

}

function getReflectedValue (property) {
    var referer = new ReflectionObject(this);

    if (referer.hasMethod('get' + capitalize(property))) {
        return referer.getMethod('get' + capitalize(property)).call();
    } else if (referer.hasMethod('get')) {
        return referer.getMethod('get').call(property);
    } else if (referer.hasProperty(property)) {
        return referer.getProperty(property).getValue();
    } else {
        return undefined;
    }
};
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

namespace('Sy.EventDispatcher');

/**
 * Interface to define required method for event subscribers
 *
 * @package Sy
 * @interface
 */

Sy.EventDispatcher.EventSubscriberInterface = function () {};
Sy.EventDispatcher.EventSubscriberInterface.prototype = Object.create(Object.prototype, {

    /**
     * Return an object of events that the object subscribed to
     * <code>
     * {
     *     'event name': 'method name',
     *     'event name': {
     *         method: 'function name in the object', //required
     *         priority: 'integer' //optional
     *     },
     *     'event name': [
     *         {method: 'method', priority: 'integer'},
     *         {method: 'method', priority: 'integer'},
     *     ]
     * }
     * </code>
     *
     * @return {Object}
     */

    getSubscribedEvents: {
        value: function () {}
    }

});

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

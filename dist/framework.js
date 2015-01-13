/*! sy#1.2.0 - 2015-01-13 */
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
                            [subscriber, subscriber[subscribed[name]]]
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
                            [subscriber, subscriber[subscribed[name]]]
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
     * @param {string} event
     * @param {function} fn
     *
     * @return {Sy.ControllerInterface}
     */

    listen: {
        value: function (event, fn) {}
    },

    /**
     * Shortcut to the event dispatcher dispatch method.
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

namespace('Sy.Kernel');

/**
 * Bind itself to referenced viewscreen actions and
 * re-route handling to the appropriate controller
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.ActionDispatcher = function () {
    this.viewport = null;
    this.controllerManager = null;
    this.dispatcher = null;
    this.logger = null;
};
Sy.Kernel.ActionDispatcher.prototype = Object.create(Object.prototype, {

    /**
     * Set the viewport wrapper
     *
     * @param {Sy.View.ViewPort} viewport
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    setViewPort: {
        value: function (viewport) {

            if (!(viewport instanceof Sy.View.ViewPort)) {
                throw new TypeError('Invalid viewport');
            }

            this.viewport = viewport;

            return this;

        }
    },

    /**
     * Set the controller manager
     *
     * @param {Sy.Kernel.ControllerManager} manager
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    setControllerManager: {
        value: function (manager) {

            if (!(manager instanceof Sy.Kernel.ControllerManager)) {
                throw new TypeError('Invalid controller manager');
            }

            this.controllerManager = manager;

            return this;

        }
    },

    /**
     * Set the event dispatcher
     *
     * @param {Sy.EventDispatcher.EventDispatcherInterface} dispatcher
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    setDispatcher: {
        value: function (dispatcher) {

            if (!(dispatcher instanceof Sy.EventDispatcher.EventDispatcherInterface)) {
                throw new TypeError('Invalid event dispatcher');
            }

            this.dispatcher = dispatcher;

            return this;

        }
    },

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    setLogger: {
        value: function (logger) {

            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;

        }
    },

    /**
     * Bind viewscreens actions to the dispatcher
     *
     * @param {Array} viewscreens Array of all viewscreens
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    bindViewScreens: {
        value: function (viewscreens) {

            for (var i = 0, l = viewscreens.length; i < l; i++) {
                this.bindViewScreen(viewscreens[i]);
            }

            return this;

        }
    },

    /**
     * Bind registered actions of a viewscreen to this dispatcher
     *
     * @param {Sy.View.ViewScreen} viewscreen
     *
     * @return {Sy.Kernel.ActionDispatcher}
     */

    bindViewScreen: {
        value: function (viewscreen) {

            if (!(viewscreen instanceof Sy.View.ViewScreen)) {
                throw new TypeError('Invalid viewscreen');
            }

            var node = viewscreen.getNode(),
                actions = node.querySelectorAll('[data-sy-action]'),
                actionNode,
                events;

            if (this.logger) {
                this.logger.info('Binding the viewscreen "' + node.dataset.syView + '" actions to the dispatcher...', viewscreen);
            }

            for (var i = 0, l = actions.length; i < l; i++) {
                actionNode = actions[i];

                events = actionNode.dataset.syAction.split('|');
                events.splice(0, 1);

                for (var j = 0, jl = events.length; j < jl; j++) {
                    actionNode.addEventListener(events[j], this.eventCallback.bind(this), false);
                }
            }

        }
    },

    /**
     * Event callback used to re-route action to the wished controller
     *
     * @param {Event} event
     */

    eventCallback: {
        value: function (event) {

            var target = event.currentTarget,
                alias = this.viewport
                    .getCurrentViewScreen()
                    .getNode()
                    .dataset
                    .syController,
                action = target.dataset.syAction.split('|')[0] + 'Action',
                controller,
                evt;

            if (!this.controllerManager.isControllerBuilt(alias)) {
                this.controllerManager.buildController(
                    this.viewport.getCurrentViewScreen()
                );
            }

            controller = this.controllerManager.getController(alias);
            evt = new Sy.Event.ControllerEvent(controller, action, event);

            if (this.logger) {
                this.logger.info('Firing a controller\'s method...', [controller, action]);
            }

            this.dispatcher.dispatch(evt.PRE_ACTION, evt);

            controller[action].call(controller, event);

            evt = new Sy.Event.ControllerEvent(controller, action, event);
            this.dispatcher.dispatch(evt.POST_ACTION, evt);

        }
    }

});

namespace('Sy.Kernel');

/**
 * Class used to inspect app object tree and extract meta informations
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.AppParser = function () {
    this.bundles = {};
    this.controllers = [];
    this.entities = [];
};
Sy.Kernel.AppParser.prototype = Object.create(Object.prototype, {

    /**
     * Set a new bundle
     *
     * @param {String} name Bundle name
     * @param {Object} object Object containing the whole bundle code
     *
     * @return {Sy.Kernel.AppParser}
     */

    setBundle: {
        value: function (name, object) {
            if (this.bundles.hasOwnProperty(name)) {
                throw new ReferenceError('Bundle "' + name + '" already defined');
            }

            this.bundles[name] = object;

            return this;
        }
    },

    /**
     * Return an object with a correspondance controller alias => controller constructor
     *
     * @return {Object}
     */

    getControllers: {
        value: function () {

            if (this.controllers.length > 0) {
                return this.controllers;
            }

            var bundleCtrl;

            for (var name in this.bundles) {
                if (this.bundles.hasOwnProperty(name)) {
                    bundleCtrl = this.bundles[name].Controller;

                    if (!bundleCtrl) {
                        continue;
                    }

                    for (var ctrl in bundleCtrl) {
                        if (bundleCtrl.hasOwnProperty(ctrl)) {
                            this.controllers.push({
                                name: name + '::' + ctrl,
                                creator: bundleCtrl[ctrl]
                            });
                        }
                    }
                }
            }

            return this.controllers;

        }
    },

    /**
     * Return the array of all defined entities
     *
     * @return {Array}
     */

    getEntities: {
        value: function () {

            if (this.entities.length > 0) {
                return this.entities;
            }

            var bundleEntities,
                bundleRepositories,
                alias,
                entity;

            for (var bundleName in this.bundles) {
                if (this.bundles.hasOwnProperty(bundleName)) {
                    bundleEntities = this.bundles[bundleName].Entity;
                    bundleRepositories = this.bundles[bundleName].Repository || {};

                    if (!bundleEntities) {
                        continue;
                    }

                    for (var name in bundleEntities) {
                        if (bundleEntities.hasOwnProperty(name)) {
                            alias = bundleName + '::' + name;
                            entity = bundleEntities[name];

                            this.entities.push({
                                alias: alias,
                                bundle: bundleName,
                                name: name,
                                repository: bundleRepositories[name],
                                entity: entity,
                                indexes: entity.prototype.INDEXES,
                                uuid: entity.prototype.UUID
                            });
                        }
                    }
                }
            }

            return this.entities;

        }
    },

    /**
     * Walk through the app services definitions object
     * and call them to register them
     *
     * @param {Sy.ServiceContainer.Core} $container
     *
     * @return {Sy.Kernel.AppParser}
     */

    buildServices: {
        value: function (container) {

            if (!(container instanceof Sy.ServiceContainer.Core)) {
                throw new TypeError('Invalid service container');
            }

            var bundleConfig;

            for (var bundleName in this.bundles) {
                if (this.bundles.hasOwnProperty(bundleName)) {
                    bundleConfig = this.bundles[bundleName].Config;

                    if (!bundleConfig || !bundleConfig.Service) {
                        continue;
                    }

                    bundleConfig = new bundleConfig.Service();
                    bundleConfig.define(container);
                }
            }

            return this;

        }
    },

    /**
     * Walk through the app config definitions object
     * and call them to register them
     *
     * @param {Sy.ConfiguratorInterface} $config
     *
     * @return {Sy.Kernel.AppParser}
     */

    buildConfig: {
        value: function (config) {

            if (!(config instanceof Sy.ConfiguratorInterface)) {
                throw new TypeError('Invalid configurator');
            }

            var bundleConfig;

            for (var bundleName in this.bundles) {
                if (this.bundles.hasOwnProperty(bundleName)) {
                    bundleConfig = this.bundles[bundleName].Config;

                    if (!bundleConfig || !bundleConfig.Configuration) {
                        continue;
                    }

                    bundleConfig = new bundleConfig.Configuration();
                    bundleConfig.define(config);
                }
            }

            return this;

        }
    },

    /**
     * Walk through the app validation rules definitions object
     * and call them to register them in the validator
     *
     * @param {Sy.ServiceContainer.Core} container
     *
     * @return {Sy.Kernel.AppParser}
     */

    registerValidationRules: {
        value: function (container) {
            if (!(container instanceof Sy.ServiceContainer.Core)) {
                throw new TypeError('Invalid service container');
            }

            var validator = container.get('sy::core::validator'),
                bundleConfig;

            if (!(validator instanceof Sy.Validator.Core)) {
                throw new TypeError('Invalid validator');
            }

            for (var bundleName in this.bundles) {
                if (this.bundles.hasOwnProperty(bundleName)) {
                    bundleConfig = this.bundles[bundleName].Config;

                    if (!bundleConfig || !bundleConfig.Validation) {
                        continue;
                    }

                    bundleConfig = new bundleConfig.Validation();
                    bundleConfig.define(validator);
                }
            }

            return this;
        }
    }

});

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
    this.dispatcher = null;
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
     * Sets the event dispatcher to subscribe to viewport events
     *
     * @param {Sy.EventDispatcher.EventDispatcherInterface} dispatcher
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setDispatcher: {
        value: function (dispatcher) {

            if (!(dispatcher instanceof Sy.EventDispatcher.EventDispatcherInterface)) {
                throw new TypeError('Invalid event dispatcher');
            }

            this.dispatcher = dispatcher;

            return this;

        }
    },

    /**
     * Set the service container that will be injected in each controller
     *
     * @param {Sy.ServiceContainer.Core} container
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    setServiceContainer: {
        value: function (container) {

            if (!(container instanceof Sy.ServiceContainer.Core)) {
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
     * @private
     * @param {Sy.View.Event.ViewPortEvent} event
     *
     * @return {void}
     */

    onDisplayListener: {
        value: function (event) {

            var viewscreen = event.getViewScreen(),
                alias = viewscreen.getNode().dataset.syController;

            if (this.loaded.has(alias) && this.current !== alias) {
                this.loaded.get(this.current).sleep();
                this.loaded.get(alias).wakeup();
                this.current = alias;
            } else {
                this.buildController(viewscreen);
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

            if (
                this.cache === false ||
                (
                    this.cache === true &&
                    typeof this.cacheLength === 'number' &&
                    this.loaded.length() > this.cacheLength
                )
            ) {
                this.loaded.get(this.cacheOrder[0]).destroy();
                this.loaded.remove(this.cacheOrder[0]);
                this.cacheOrder.splice(0, 1);
            }

            this.loaded.set(alias, instance);
            this.cacheOrder.push(alias);

            return this;

        }
    },

    /**
     * Build a controller instance for the specified viewscreen
     *
     * @param {Sy.View.ViewScreen} viewscreen
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    buildController: {
        value: function (viewscreen) {

            if (!(viewscreen instanceof Sy.View.ViewScreen)) {
                throw new TypeError('Invalid viewscreen');
            }

            var alias = viewscreen.getNode().dataset.syController,
                bundleName = alias.split('::')[0],
                instance;

            if (!this.meta.has(alias)) {
                throw new ReferenceError('The controller with the alias "' + alias + '" is undefined');
            }

            instance = new (this.meta.get(alias))();
            instance
                .setDispatcher(this.dispatcher)
                .setServiceContainer(this.container)
                .setViewScreen(viewscreen)
                .init();

            this.cacheController(alias, instance);
            this.current = alias;

            return this;

        }
    },

    /**
     * Check if a controller is built
     *
     * @param {String} alias Controller alias
     *
     * @return {Boolean}
     */

    isControllerBuilt: {
        value: function (alias) {

            return this.loaded.has(alias);

        }
    },

    /**
     * Get the instance of a controller
     *
     * @param {String} alias Controller alias
     *
     * @return {Sy.ControllerInterface}
     */

    getController: {
        value: function (alias) {

            return this.loaded.get(alias);

        }
    },

    /**
     * Bootstrap the manager
     *
     * @return {Sy.Kernel.ControllerManager}
     */

    boot: {
        value: function () {

            this.dispatcher.addListener(
                Sy.View.Event.ViewPortEvent.prototype.PRE_DISPLAY,
                this.onDisplayListener.bind(this)
            );

        }
    }

});

namespace('Sy.Kernel');

/**
 * Framework heart
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.Core = function (env, debug) {
    this.config = new Sy.Configurator();
    this.container = new Sy.ServiceContainer.Core();
    this.controllerManager = new Sy.Kernel.ControllerManager();
    this.actionDispatcher = new Sy.Kernel.ActionDispatcher();

    this.container.setCompiler(new Sy.ServiceContainer.Compiler());

    this.config
        .set('app.environment', env)
        .set('app.debug', !!debug);
};
Sy.Kernel.Core.prototype = Object.create(Object.prototype, {

    /**
     * Return the framework config object
     *
     * @return {Sy.Configurator}
     */

    getConfig: {
        value: function () {
            return this.config;
        }
    },

    /**
     * Return the service container object
     *
     * @return {Sy.ServiceContainer}
     */

    getContainer: {
        value: function () {
            return this.container;
        }
    },

    /**
     * Register all bundles needed for the app
     *
     * @return {Array}
     */

    registerBundles: {
        value: function () {
            return [];
        }
    },

    /**
     * Initiate the kernel that will inspect the app and build necessary data
     *
     * @return {Sy.Kernel.Core}
     */

    boot: {
        value: function () {

            var tester = new Sy.Kernel.FeatureTester(),
                parser = new Sy.Kernel.AppParser();

            tester.testBrowser();

            this.registerBundles().forEach(function (bundle) {
                parser.setBundle(bundle[0], bundle[1]);
            }.bind(this));

            this.config.set('app.meta', {
                controllers: parser.getControllers(),
                entities: parser.getEntities()
            });

            this.container.setParameters(this.config);

            parser
                .buildConfig(this.config)
                .buildServices(this.container);

            this.registerShutdownListener();

            this.container.compile();

            parser.registerValidationRules(this.container);

            this
                .registerControllers(parser.getControllers())
                .configureLogger();

            if (this.container.hasParameter('routes')) {
                this.container
                    .get('sy::core::appstate')
                    .boot();
            }
        }
    },

    /**
     * Register all app controllers into the manager
     *
     * @private
     * @param {Array} controllers
     *
     * @return {Sy.Kernel.Core}
     */

    registerControllers: {
        value: function (controllers) {

            var registryFactory = this.container.get('sy::core::registry::factory'),
                dispatcher = this.container.get('sy::core::event_dispatcher'),
                viewport = this.container.get('sy::core::viewport'),
                logger = this.container.get('sy::core::logger'),
                viewscreensManager = this.container.get('sy::core::view::manager');

            this.controllerManager
                .setMetaRegistry(registryFactory.make())
                .setLoadedControllersRegistry(registryFactory.make())
                .setDispatcher(dispatcher)
                .setServiceContainer(this.container)
                .setCache(this.config.get('controllers.cache'))
                .setCacheLength(this.config.get('controllers.cacheLength'));

            this.actionDispatcher
                .setViewPort(viewport)
                .setControllerManager(this.controllerManager)
                .setDispatcher(dispatcher)
                .setLogger(logger);

            for (var i = 0, l = controllers.length; i < l; i++) {
                this.controllerManager.registerController(
                    controllers[i].name,
                    controllers[i].creator
                );
            }

            this.controllerManager.boot();
            this.actionDispatcher.bindViewScreens(
                viewscreensManager.getViewScreens()
            );

            if (viewport.getCurrentViewScreen()) {
                this.controllerManager.buildController(
                    viewport.getCurrentViewScreen()
                );
            }

            return this;

        }
    },

    /**
     * Adapt the handlers available in the logger depending on the app env
     * If env set to 'prod' remove all of them except for 'error'
     *
     * @return {Sy.Kernel.Core}
     */

    configureLogger: {
        value: function () {

            var debug = this.config.get('app.debug'),
                logger = this.container.get('sy::core::logger');

            if (debug === false) {
                logger
                    .removeHandler(logger.LOG)
                    .removeHandler(logger.DEBUG)
                    .removeHandler(logger.INFO);
            }

            return this;

        }
    },

    /**
     * Add a `beforeunload` on the window to fire an event to notify the app
     * it's being closed, so it can be properly shutdown
     *
     * @return {Sy.Kernel.Core}
     */

    registerShutdownListener: {
        value: function () {
            window.addEventListener('beforeunload', function (event) {
                try {
                    var evt = new Sy.Event.AppShutdownEvent(event);

                    this.container.get('sy::core::event_dispatcher').dispatch(
                        evt.KEY,
                        evt
                    );
                } catch (error) {
                    return error.message;
                }
            }.bind(this), false);

            return this;
        }
    }

});

namespace('Sy.Kernel');

/**
 * Helper to ensure the browser is compatible with each
 * of the framework components
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 */

Sy.Kernel.FeatureTester = function () {};
Sy.Kernel.FeatureTester.prototype = Object.create(Object.prototype, {

    /**
     * Test for XMLHttpRequest and FormData support
     *
     * @private
     * @throws {ReferenceError} If XMLHttpRequest or FormData is not defined
     */

    testXHR: {
        value: function () {

            if (typeof XMLHttpRequest === 'undefined') {
                throw new ReferenceError('XMLHttpRequest is not defined');
            }

            if (typeof FormData === 'undefined') {
                throw new ReferenceError('FormData is not defined');
            }

        }
    },

    /**
     * Test the support for Function.prototype.bind
     *
     * @private
     * @throws {ReferenceError} If Function.prototype.bind is not defined
     */

    testBind: {
        value: function () {

            if (typeof Function.prototype.bind !== 'function') {
                throw new ReferenceError('The Function.bind method is not defined');
            }

        }
    },

    /**
     * Test for required node attributes (to check support for view engine)
     *
     * @private
     * @throws {ReferenceError} If HTMLElement.dataset is not defined or HTMLElement.attributes is not defined
     */

    testHTMLAttributes: {
        value: function () {

            if (!(document.body.dataset instanceof DOMStringMap)) {
                throw new ReferenceError('Element dataset not supported');
            }

            if (typeof document.body.attributes !== 'object') {
                throw new ReferenceError('Element.attributes not defined');
            }

        }
    },

    /**
     * Test if the browser support the Element.addEventListener
     *
     * @throws {ReferenceError} If Element.addEventListener is not defined
     */

    testEventListener: {
        value: function () {

            if (typeof document.body.addEventListener !== 'function') {
                throw new ReferenceError('Element.addEventListener is not defined');
            }

        }
    },

    /**
     * Initiate the test suite
     *
     * @return {void}
     */

    testBrowser: {
        value: function () {

            this.testXHR();
            this.testHTMLAttributes();
            this.testBind();
            this.testEventListener();

        }
    }

});

namespace('Sy.Event');

/**
 * Event fired when the window is closed, used to properly shutdown the app
 *
 * @package Sy
 * @subpackage Event
 * @class
 * @extends {Sy.EventDispatcher.Event}
 */
Sy.Event.AppShutdownEvent = function (originalEvent) {
    if (!(originalEvent instanceof BeforeUnloadEvent)) {
        throw new TypeError('Invalid unload event');
    }

    this.originalEvent = originalEvent;
};
Sy.Event.AppShutdownEvent.prototype = Object.create(Sy.EventDispatcher.Event.prototype, {

    KEY: {
        value: 'app::shutdown',
        writable: false
    },

    /**
     * Return the original event
     *
     * @return {BeforeUnloadEvent}
     */

    getOriginalEvent: {
        value: function () {
            return this.originalEvent;
        }
    }

});

namespace('Sy.Event');

/**
 * Event fired before and after an action is fired on a controller
 *
 * @package Sy
 * @subpackage Event
 * @class
 * @extends {Sy.EventDispatcher.Event}
 */
Sy.Event.ControllerEvent = function (controller, action, event) {
    if (!(controller instanceof Sy.ControllerInterface)) {
        throw new TypeError('Invalid controller');
    }

    if (typeof action !== 'string') {
        throw new TypeError('Invalid action');
    }

    this.controller = controller;
    this.action = action;
    this.event = event;
};
Sy.Event.ControllerEvent.prototype = Object.create(Sy.EventDispatcher.Event.prototype, {

    PRE_ACTION: {
        value: 'controller::on::pre::action',
        writable: false
    },

    POST_ACTION: {
        value: 'controller::on::post::action',
        writable: false
    },

    /**
     * Return the controller instance
     *
     * @return {Sy.ControllerInterface}
     */

    getController: {
        value: function () {
            return this.controller;
        }
    },

    /**
     * Return the action method called on the controller
     *
     * @return {String}
     */

    getAction: {
        value: function () {
            return this.action;
        }
    },

    /**
     * Return original DOM event
     *
     * @return {Event}
     */

    getOriginalEvent: {
        value: function () {
            return this.event;
        }
    }

});

namespace('Sy');

/**
 * Default implementation of a controller
 *
 * @package Sy
 * @class
 * @implements {Sy.ControllerInterface}
 */

Sy.Controller = function () {

    this.container = null;
    this.dispatcher = null;
    this.dispatcherListeners = {};
    this.viewscreen = null;

};

Sy.Controller.prototype = Object.create(Sy.ControllerInterface.prototype, {

    /**
     * @inheritDoc
     */

    listen: {
        value: function (event, fn) {

            var fn = [this, fn];

            this.dispatcher.addListener(
                event,
                fn
            );

            if (!this.dispatcherListeners[event]) {
                this.dispatcherListeners[event] = [];
            }

            this.dispatcherListeners[event].push(fn);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    broadcast: {
        value: function (name, event) {

            this.dispatcher.dispatch(name, event);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setDispatcher: {
        value: function (dispatcher) {

            if (!(dispatcher instanceof Sy.EventDispatcher.EventDispatcherInterface)) {
                throw new TypeError('Invalid event dispatcher');
            }

            this.dispatcher = dispatcher;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setServiceContainer: {
        value: function (container) {

            if (!(container instanceof Sy.ServiceContainer.Core)) {
                throw new TypeError('Invalid service container');
            }

            this.container = container;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    sleep: {
        value: function () {

            for (var event in this.dispatcherListeners) {
                if (this.dispatcherListeners.hasOwnProperty(event)) {
                    for (var i = 0, l = this.dispatcherListeners[event].length; i < l; i++) {
                        this.dispatcher.removeListener(event, this.dispatcherListeners[event][i]);
                    }
                }
            }

        }
    },

    /**
     * @inheritDoc
     */

    wakeup: {
        value: function () {

            for (var event in this.dispatcherListeners) {
                if (this.dispatcherListeners.hasOwnProperty(event)) {
                    for (var i = 0, l = this.dispatcherListeners[event].length; i < l; i++) {
                        this.dispatcher.addListener(event, this.dispatcherListeners[event][i]);
                    }
                }
            }

        }
    },

    /**
     * @inheritDoc
     */
    destroy: {
        value: function () {

            for (var event in this.dispatcherListeners) {
                if (this.dispatcherListeners.hasOwnProperty(event)) {
                    for (var i = 0, l = this.dispatcherListeners[event].length; i < l; i++) {
                        this.dispatcher.removeListener(event, this.dispatcherListeners[event][i]);
                    }
                }
            }

        }
    },

    /**
     * @inheritDoc
     */

    setViewScreen: {
        value: function (viewscreen) {

            if (!(viewscreen instanceof Sy.View.ViewScreen)) {
                throw new TypeError('Invalid viewscreen');
            }

            this.viewscreen = viewscreen;

            return this;

        }
    },

    /**
     * Shortcut to create a form builder
     *
     * @param {Object} object Object that will hold form data
     * @param {Object} options
     *
     * @return {Sy.Form.FormBuilderInterface}
     */

    createFormBuilder: {
        value: function (object, options) {
            return this.container
                .get('sy::core::form')
                .createFormBuilder(object, options);
        }
    },

    /**
     * Shortcut to create a form from a form type
     *
     * @param {Sy.Form.FormTypeInterface|String} formType
     * @param {Object} object Optional
     * @param {Object} options
     *
     * @return {Sy.Form.FormInterface}
     */

    createForm: {
        value: function (formType, object, options) {
            return this.container
                .get('sy::core::form')
                .createForm(formType, object, options);
        }
    },

    /**
     * Shortcut to retrieve the storage engine
     *
     * @return {Sy.Storage.Core}
     */

    getStorage: {
        value: function () {
            return this.container.get('sy::core::storage');
        }
    },

    /**
     * Redirect to the specified route name
     *
     * @param {String} route
     * @param {Object} params
     *
     * @return {Sy.Controller} self
     */

    redirect: {
        value: function (route, params) {
            location.hash = this.container
                .get('sy::core::appstate::router')
                .generate(route, params);

            return this;
        }
    }

});

namespace('Sy.FrameworkBundle.Config');

/**
 * Basic configuration needed by the framework
 *
 * @package Sy
 * @subpackage FrameworkBundle
 * @class
 */

Sy.FrameworkBundle.Config.Configuration = function () {};
Sy.FrameworkBundle.Config.Configuration.prototype = Object.create(Object.prototype, {
    define: {
        value: function (config) {
            config.set({
                controllers: {
                    cache: true
                },
                logger: {
                    level: {
                        info: Sy.Lib.Logger.CoreLogger.prototype.INFO,
                        debug: Sy.Lib.Logger.CoreLogger.prototype.DEBUG,
                        error: Sy.Lib.Logger.CoreLogger.prototype.ERROR,
                        log: Sy.Lib.Logger.CoreLogger.prototype.LOG,
                    }
                }
            });
        }
    }
});
namespace('Sy.FrameworkBundle.Config');

/**
 * Basic service needed throughout the framework
 *
 * @package Sy
 * @subpackage FrameworkBundle
 * @class
 */

Sy.FrameworkBundle.Config.Service = function () {};
Sy.FrameworkBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                'sy::core::generator::uuid': {
                    constructor: 'Sy.Lib.Generator.UUID'
                },
                mediator: '@sy::core::mediator',
                'sy::core::mediator': {
                    constructor: 'Sy.Lib.Mediator',
                    calls: [
                        ['setGenerator', ['@sy::core::generator::uuid']],
                        ['setLogger', ['@sy::core::logger']]
                    ]
                },
                'sy::core::registry::factory': {
                    constructor: 'Sy.RegistryFactory'
                },
                registry: '@sy::core::registry',
                'sy::core::registry': {
                    constructor: 'Sy.Registry',
                    factory: ['sy::core::registry::factory', 'make'],
                    prototype: true
                },
                'sy::core::stateregistry::factory': {
                    constructor: 'Sy.StateRegistryFactory',
                    calls: [
                        ['setRegistryFactory', ['@sy::core::registry::factory']]
                    ]
                },
                stateregistry: '@sy::core::stateregistry',
                'sy::core::stateregistry': {
                    constructor: 'Sy.StateRegistry',
                    fatory: ['sy::core::stateregistry::factory', 'make'],
                    prototype: true
                },
                logger: '@sy::core::logger',
                'sy::core::logger': {
                    constructor: 'Sy.Lib.Logger.CoreLogger',
                    calls: [
                        ['setName', ['core']],
                        ['setHandler', ['@sy::core::logger::handler::info', '%logger.level.info%']],
                        ['setHandler', ['@sy::core::logger::handler::debug', '%logger.level.debug%']],
                        ['setHandler', ['@sy::core::logger::handler::error', '%logger.level.error%']],
                        ['setHandler', ['@sy::core::logger::handler::log', '%logger.level.log%']],
                    ]
                },
                'sy::core::logger::handler::info': {
                    constructor: 'Sy.Lib.Logger.Handler.Console',
                    calls: [
                        ['setLevel', ['%logger.level.info%']]
                    ],
                    private: true
                },
                'sy::core::logger::handler::debug': {
                    constructor: 'Sy.Lib.Logger.Handler.Console',
                    calls: [
                        ['setLevel', ['%logger.level.debug%']]
                    ],
                    private: true
                },
                'sy::core::logger::handler::error': {
                    constructor: 'Sy.Lib.Logger.Handler.Console',
                    calls: [
                        ['setLevel', ['%logger.level.error%']]
                    ],
                    private: true
                },
                'sy::core::logger::handler::log': {
                    constructor: 'Sy.Lib.Logger.Handler.Console',
                    calls: [
                        ['setLevel', ['%logger.level.log%']]
                    ],
                    private: true
                },
                'sy::core::propertyaccessor': {
                    constructor: 'Sy.PropertyAccessor',
                    prototype: true
                }
            });
        }
    }
});

namespace('Sy.FormBundle.Config');

/**
 * Register form service
 *
 * @package Sy
 * @package FormBundle
 * @class
 */

Sy.FormBundle.Config.Service = function () {};
Sy.FormBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                'sy::core::form': {
                    constructor: 'Sy.Form.Builder',
                    calls: [
                        ['setValidator', ['@sy::core::validator']]
                    ]
                }
            });

            container.addPass(
                new Sy.FormBundle.CompilerPass.FormTypePass()
            );
        }
    }
});
namespace('Sy.HttpBundle.Config');

/**
 * Register the http services
 *
 * @package Sy
 * @subpackage HttpBundle
 * @class
 */

Sy.HttpBundle.Config.Service = function () {};
Sy.HttpBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                rest: '@sy::core::http::rest',
                'sy::core::http::rest': {
                    constructor: 'Sy.HTTP.REST',
                    calls: [
                        ['setManager', ['@sy::core::http']]
                    ]
                },
                http: '@sy::core::http',
                'sy::core::http': {
                    constructor: 'Sy.HTTP.Manager',
                    calls: [
                        ['setParser', ['@sy::core::http::parser']],
                        ['setGenerator', ['@sy::core::generator::uuid']],
                        ['setRegistry', ['@sy::core::registry']],
                        ['setLogger', ['@sy::core::logger']]
                    ]
                },
                'sy::core::http::parser': {
                    constructor: 'Sy.HTTP.HeaderParser',
                    private: true
                }
            });
        }
    }
});
namespace('Sy.StorageBundle.Config');

/**
 * Register storage services
 *
 * @package Sy
 * @subpackage StorageBundle
 * @class
 */

Sy.StorageBundle.Config.Service = function () {};
Sy.StorageBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                'sy::core::storage::dbal::factory': {
                    constructor: 'Sy.Storage.Dbal.Factory',
                    calls: [
                        ['setFactoriesRegistry', ['@sy::core::registry']],
                        ['setDefaultConnectionName', ['%storage.dbal.defaultConnection%']],
                        ['setConnections', ['%storage.dbal.connections%']]
                    ]
                },
                'sy::core::storage::dbal::driver_factory::indexeddb': {
                    constructor: 'Sy.Storage.Dbal.IndexedDBFactory',
                    private: true,
                    calls: [
                        ['setEntitiesMeta', ['%app.meta.entities%']],
                        ['setLogger', ['@sy::core::logger']]
                    ],
                    tags: [
                        {name: 'storage.driver_factory', alias: 'indexeddb'}
                    ]
                },
                'sy::core::storage::dbal::driver_factory::localstorage': {
                    constructor: 'Sy.Storage.Dbal.LocalstorageFactory',
                    private: true,
                    calls: [
                        ['setEntitiesMeta', ['%app.meta.entities%']]
                    ],
                    tags: [
                        {name: 'storage.driver_factory', alias: 'localstorage'}
                    ]
                },
                'sy::core::storage::dbal::driver_factory::rest': {
                    constructor: 'Sy.Storage.Dbal.RestFactory',
                    private: true,
                    calls: [
                        ['setEntitiesMeta', ['%app.meta.entities%']],
                        ['setREST', ['@sy::core::http::rest']]
                    ],
                    tags: [
                        {name: 'storage.driver_factory', alias: 'rest'}
                    ]
                },
                storage: '@sy::core::storage',
                'sy::core::storage': {
                    constructor: 'Sy.Storage.Core',
                    calls: [
                        ['setManagersRegistry', ['@sy::core::registry']],
                        ['setDefaultManager', ['%storage.orm.defaultManager%']],
                        ['setManagerFactory', ['@sy::core::storage::factory::manager']]
                    ]
                },
                'sy::core::storage::factory::manager': {
                    constructor: 'Sy.Storage.ManagerFactory',
                    private: true,
                    calls: [
                        ['setDefinitions', ['%storage.orm.managers%']],
                        ['setDbalFactory', ['@sy::core::storage::dbal::factory']],
                        ['setRepositoryFactory', ['@sy::core::storage::factory::repository']],
                        ['setUnitOfWorkFactory', ['@sy::core::storage::factory::unitofwork']]
                    ]
                },
                'sy::core::storage::factory::repository': {
                    constructor: 'Sy.Storage.RepositoryFactory',
                    private: true,
                    configurator: ['sy::core::storage::repofactconfigurator', 'configure'],
                    calls: [
                        ['setMetadataRegistry', ['@sy::core::registry']],
                        ['setRepositoriesRegistry', ['@sy::core::registry']]
                    ]
                },
                'sy::core::storage::repofactconfigurator': {
                    constructor: 'Sy.Storage.RepositoryFactoryConfigurator',
                    private: true,
                    calls: [
                        ['setMetadata', ['%app.meta.entities%']]
                    ]
                },
                'sy::core::storage::factory::unitofwork': {
                    constructor: 'Sy.Storage.UnitOfWorkFactory',
                    private: true,
                    calls: [
                        ['setStateRegistryFactory', ['@sy::core::stateregistry::factory']],
                        ['setGenerator', ['@sy::core::generator::uuid']],
                        ['setLogger', ['@sy::core::logger']],
                        ['setDispatcher', ['@sy::core::event_dispatcher']],
                        ['setPropertyAccessor', ['@sy::core::propertyaccessor']],
                        ['setEntitiesMetadata', ['%app.meta.entities%']]
                    ]
                }
            });

            container.addPass(
                new Sy.StorageBundle.CompilerPass.RegisterDriverFactoryPass()
            );
        }
    }
});

namespace('Sy.TranslatorBundle.Config');

/**
 * Register translator config
 *
 * @package Sy
 * @subpackage TranslatorBundle
 * @class
 */

Sy.TranslatorBundle.Config.Service = function () {};
Sy.TranslatorBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                translator: '@sy::core::translator',
                'sy::core::translator': {
                    constructor: 'Sy.Translator',
                    calls: [
                        ['setRegistry', ['@sy::core::registry']],
                        ['setStateRegistryFactory', ['@sy::core::stateregistry::factory']]
                    ]
                }
            });
        }
    }
});
namespace('Sy.ValidatorBundle.Config');

/**
 * Register validator services
 *
 * @package Sy
 * @subpackage ValidatorBundle
 * @class
 */

Sy.ValidatorBundle.Config.Service = function () {};
Sy.ValidatorBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                validator: '@sy::core::validator',
                'sy::core::validator': {
                    constructor: 'Sy.Validator.Core',
                    calls: [
                        ['setRulesRegistry', ['@sy::core::registry']],
                        ['setContextFactory', ['@sy::core::validator::executioncontextfactory']],
                        ['setConstraintFactory', ['@sy::core::validator::constraintfactory']]
                    ]
                },
                'sy::core::validator::executioncontextfactory': {
                    constructor: 'Sy.Validator.ExecutionContextFactory',
                    calls: [
                        ['setConstraintValidatorFactory', ['@sy::core::validator::constraintvalidatorfactory']]
                    ],
                    private: true
                },
                'sy::core::validator::constraintvalidatorfactory': {
                    constructor: 'Sy.Validator.ConstraintValidatorFactory',
                    private: true
                },
                'sy::core::validator::constraintfactory': {
                    constructor: 'Sy.Validator.ConstraintFactory',
                    private: true
                }
            });
        }
    }
});
namespace('Sy.ViewBundle.Config');

/**
 * Register view engine services
 *
 * @package Sy
 * @subpackage ViewBundle
 * @class
 */

Sy.ViewBundle.Config.Service = function () {};
Sy.ViewBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            var vs = new Sy.ViewBundle.CompilerPass.RegisterViewScreenWrapperPass(),
                layout = new Sy.ViewBundle.CompilerPass.RegisterLayoutWrapperPass(),
                list = new Sy.ViewBundle.CompilerPass.RegisterListWrapperPass()
                subscriber = new Sy.ViewBundle.CompilerPass.RegisterSubscriberPass();

            container.set({
                'sy::core::view::parser': {
                    constructor: 'Sy.View.Parser'
                },
                'sy::core::view::factory::list': {
                    constructor: 'Sy.View.ListFactory',
                    calls: [
                        ['setTemplateEngine', ['@sy::core::view::template::engine']],
                        ['setRegistry', ['@sy::core::registry']]
                    ]
                },
                'sy::core::view::factory::layout': {
                    constructor: 'Sy.View.LayoutFactory',
                    calls: [
                        ['setParser', ['@sy::core::view::parser']],
                        ['setTemplateEngine', ['@sy::core::view::template::engine']],
                        ['setRegistryFactory', ['@sy::core::registry::factory']],
                        ['setListFactory', ['@sy::core::view::factory::list']]
                    ]
                },
                'sy::core::view::factory::viewscreen': {
                    constructor: 'Sy.View.ViewScreenFactory',
                    calls: [
                        ['setParser', ['@sy::core::view::parser']],
                        ['setTemplateEngine', ['@sy::core::view::template::engine']],
                        ['setRegistryFactory', ['@sy::core::registry::factory']],
                        ['setLayoutFactory', ['@sy::core::view::factory::layout']],
                    ]
                },
                'sy::core::view::template::engine': {
                    constructor: 'Sy.View.TemplateEngine',
                    calls: [
                        ['setRegistry', ['@sy::core::registry']],
                        ['setGenerator', ['@sy::core::generator::uuid']]
                    ]
                },
                'sy::core::viewport': {
                    constructor: 'Sy.View.ViewPort',
                    calls: [
                        ['setNode', [document.querySelector('.viewport')]],
                        ['setViewManager', ['@sy::core::view::manager']],
                        ['setDispatcher', ['@sy::core::event_dispatcher']]
                    ]
                },
                'sy::core::view::manager': {
                    constructor: 'Sy.View.Manager',
                    configurator: ['sy::core::view::managerconfigurator', 'configure'],
                    calls: [
                        ['setViewsRegistry', ['@sy::core::registry']],
                        ['setViewScreenFactory', ['@sy::core::view::factory::viewscreen']]
                    ],
                },
                'sy::core::view::managerconfigurator': {
                    constructor: 'Sy.View.ManagerConfigurator',
                    calls: [
                        ['setParser', ['@sy::core::view::parser']]
                    ]
                },
                'sy::core::view::subscriber::appstate': {
                    constructor: 'Sy.ViewBundle.Subscriber.AppStateSubscriber',
                    calls: [
                        ['setViewPort', ['@sy::core::viewport']],
                        ['setLogger', ['@sy::core::logger']]
                    ]
                }
            });

            container
                .addPass(vs)
                .addPass(layout)
                .addPass(list)
                .addPass(subscriber);
        }
    }
});

namespace('Sy.ViewBundle.Subscriber');

/**
 * Listen for app state change to display appropriate viewscreen if available
 *
 * @package Sy
 * @subpackage ViewBundle
 * @class
 * @implements {Sy.EventDispatcher.EventSubscriberInterface}
 */

Sy.ViewBundle.Subscriber.AppStateSubscriber = function () {
    this.viewport = null;
    this.logger = null;
};
Sy.ViewBundle.Subscriber.AppStateSubscriber.prototype = Object.create(Sy.EventDispatcher.EventSubscriberInterface.prototype, {

    /**
     * Set the viewport manager
     *
     * @param {Sy.View.ViewPort} viewport
     *
     * @return {Sy.ViewBundle.Subscriber.AppStateSubscriber} self
     */

    setViewPort: {
        value: function (viewport) {
            if (!(viewport instanceof Sy.View.ViewPort)) {
                throw new TypeError('Invalid viewport manager');
            }

            this.viewport = viewport;

            return this;
        }
    },

    /**
     * Set logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.ViewBundle.Subscriber.AppStateSubscriber} self
     */

    setLogger: {
        value: function (logger) {
            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    getSubscribedEvents: {
        value: function () {
            return {
                'appstate.change': {
                    method: 'onChange'
                }
            };
        }
    },

    /**
     * Called when the appstate.change event is fired
     *
     * @param {Sy.AppState.AppStateEvent} event
     */

    onChange: {
        value: function (event) {
            if (event.getRoute().hasParameter('_viewscreen')) {
                this.logger && this.logger.info(
                    'App state changed, displaying appropriate viewscreen',
                    {route: event.getRoute()}
                );
                this.viewport.display(
                    event.getRoute().getParameter('_viewscreen')
                );
            }
        }
    }

});

namespace('Sy.AppStateBundle.Config');

/**
 * Register appstate services
 *
 * @package Sy
 * @subpackage AppStateBundle
 * @class
 */

Sy.AppStateBundle.Config.Service = function () {};
Sy.AppStateBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                'sy::core::appstate::routeprovider': {
                    constructor: 'Sy.AppState.RouteProvider',
                    calls: [
                        ['setRegistry', ['@sy::core::registry']]
                    ]
                },
                router: '@sy::core::appstate::router',
                'sy::core::appstate::router': {
                    constructor: 'Sy.AppState.Router',
                    calls: [
                        ['setRouteProvider', ['@sy::core::appstate::routeprovider']]
                    ]
                },
                'sy::core::appstate::urlmatcher': {
                    constructor: 'Sy.AppState.UrlMatcher',
                    calls: [
                        ['setRouteProvider', ['@sy::core::appstate::routeprovider']]
                    ]
                },
                appstate: '@sy::core::appstate',
                'sy::core::appstate': {
                    constructor: 'Sy.AppState.Core',
                    calls: [
                        ['setUrlMatcher', ['@sy::core::appstate::urlmatcher']],
                        ['setRouteProvider', ['@sy::core::appstate::routeprovider']],
                        ['setGenerator', ['@sy::core::generator::uuid']],
                        ['setDispatcher', ['@sy::core::event_dispatcher']],
                        ['setStateHandler', ['@sy::core::appstate::statehandler']]
                    ]
                },
                'sy::core::appstate::statehandler': {
                    constructor: 'Sy.AppState.StateHandler'
                }
            });

            container.addPass(
                new Sy.AppStateBundle.CompilerPass.RegisterRoutesPass()
            );
        }
    }
});

namespace('Sy.EventDispatcherBundle');

/**
 * Dispatcher that leverage service container to lazy load listeners
 *
 * @package Sy
 * @subpackage EventDispatcherBundle
 * @class
 * @extends {Sy.EventDispatcher.EventDispatcher}
 */

Sy.EventDispatcherBundle.ContainerAwareEventDispatcher = function (container) {
    Sy.EventDispatcher.EventDispatcher.call(this);

    this.container = null;
    this.listenersIds = {};
    this.loaded = [];
};
Sy.EventDispatcherBundle.ContainerAwareEventDispatcher.prototype = Object.create(Sy.EventDispatcher.EventDispatcher.prototype, {

    /**
     * Set the service container
     *
     * @param {Sy.ServiceContainer.Core} container
     */

    setServiceContainer: {
        value: function (container) {
            if (!(container instanceof Sy.ServiceContainer.Core)) {
                throw new TypeError('Invalid service container');
            }

            this.container = container;
        }
    },

    /**
     * Add a service as event listener
     *
     * @param {String} name Event name
     * @param {String} service Service id
     * @param {String} method Method name
     * @param {Integer} priority
     *
     * @return {ContainerAwareEventDispatcher} self
     */

    addListenerService: {
        value: function (name, service, method, priority) {
            if (!this.listenersIds[name]) {
                this.listenersIds[name] = [];
            }

            this.listenersIds[name].push({
                service: service,
                method: method,
                priority: priority
            });

            return this;
        }
    },

    /**
     * Add a service as event subscriber
     *
     * @param {String} service Service id
     * @param {Function} constructor
     *
     * @return {ContainerAwareEventDispatcher} self
     */

    addSubscriberService: {
        value: function (service, constructor) {
            if (!(constructor instanceof Function)) {
                throw new TypeError('Invalid subscriber service constructor');
            }

            var subscribed = constructor.prototype.getSubscribedEvents();

            for (var name in subscribed) {
                if (subscribed.hasOwnProperty(name)) {
                    if (subscribed[name] instanceof Array) {
                        for (var i = 0, l = subscribed[name].length; i < l; i++) {
                            this.addListenerService(
                                name,
                                service,
                                subscribed[name][i].method,
                                subscribed[name][i].priority
                            );
                        }
                    } else if (subscribed[name] instanceof Object) {
                        this.addListenerService(
                            name,
                            service,
                            subscribed[name].method,
                            subscribed[name].priority
                        );
                    } else {
                        this.addListenerService(
                            name,
                            service,
                            subscribed[name]
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

    hasListeners: {
        value: function (name) {
            if (!!this.listenersIds[name]) {
                return !!this.listenersIds[name].length;
            }

            return Sy.EventDispatcher.EventDispatcher.prototype.hasListeners.call(this, name);
        }
    },

    /**
     * @inheritDoc
     */

    getListeners: {
        value: function (name) {
            this.lazyLoad(name);

            return Sy.EventDispatcher
                .EventDispatcher
                .prototype
                .getListeners
                .call(this, name);
        }
    },

    /**
     * @inheritDoc
     */

    dispatch: {
        value: function (name, event) {
            this.lazyLoad(name);

            return Sy.EventDispatcher
                .EventDispatcher
                .prototype
                .dispatch
                .call(this, name, event);
        }
    },

    /**
     * Return the container attached to this event dispatcher
     *
     * @return {Sy.ServiceContainer.Core}
     */

    getContainer: {
        value: function () {
            return this.container;
        }
    },

    /**
     * Load all the services listening to the event
     *
     * @private
     * @param {String} name Event name
     */

    lazyLoad: {
        value: function (name) {
            if (this.loaded.indexOf(name) !== -1) {
                return;
            }

            if (!this.listenersIds[name]) {
                return;
            }

            var service;

            for (var i = 0, l = this.listenersIds[name].length; i < l; i++) {
                service = this.container.get(
                    this.listenersIds[name][i].service
                );

                this.addListener(
                    name,
                    [service, service[this.listenersIds[name][i].method]],
                    this.listenersIds[name][i].priority
                );
            }

            this.loaded.push(name);
        }
    }

});

namespace('Sy.EventDispatcherBundle.Config');

/**
 * Register the compiler pass to register listeners
 *
 * @package Sy
 * @subpackage EventDispatcherBundle
 * @class
 */

Sy.EventDispatcherBundle.Config.Service = function () {};
Sy.EventDispatcherBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            var pass = new Sy.EventDispatcherBundle.CompilerPass.RegisterListenersPass();

            container.set({
                'sy::core::event_dispatcher': {
                    constructor: 'Sy.EventDispatcherBundle.ContainerAwareEventDispatcher',
                    calls: [
                        ['setServiceContainer', ['@container']]
                    ]
                }
            });

            container.addPass(
                pass,
                pass.AFTER_REMOVING
            );
        }
    }
});

namespace('Sy.Lib.Generator');

/**
 * Interface for all generators
 *
 * @package Sy
 * @subpackage Lib.Generator
 * @interface
 */

Sy.Lib.Generator.Interface = function () {

};

Sy.Lib.Generator.Interface.prototype = Object.create(Object.prototype, {

    generate: {
        value: function () {}
    }

});
namespace('Sy.Lib.Generator');

/**
 * Generates unique identifier following the UUID pattern
 *
 * @package Sy
 * @subpackage Lib.Generator
 * @class
 * @implements {Sy.Lib.Generator.Interface}
 */

Sy.Lib.Generator.UUID = function () {

};

Sy.Lib.Generator.UUID.prototype = Object.create(Sy.Lib.Generator.Interface.prototype, {

    /**
     * Generates a random string of 4 characters long
     *
     * @return {string}
     */

    s4: {
        value: function () {

            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);

        }
    },

    /**
     * Generates a unique identifier of 36 characters long following the pattern [a-Z0-9]{8}-[a-Z0-9]{4}-[a-Z0-9]{4}-[a-Z0-9]{4}-[a-Z0-9]{12}
     *
     * @return {string}
     */

    generate: {
        value: function () {

            return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();

        }
    }

});
namespace('Sy.Lib.Logger');

/**
 * Interface for all loggers
 *
 * @package Sy
 * @subpackage Lib.Logger
 * @interface
 */

Sy.Lib.Logger.Interface = function (name) {

};

Sy.Lib.Logger.Interface.prototype = Object.create(Object.prototype, {

    /**
     * @constant
     */

    LOG: {
        value: 'log',
        writable: false
    },

    /**
     * @constant
     */

    DEBUG: {
        value: 'debug',
        writable: false
    },

    /**
     * @constant
     */

    ERROR: {
        value: 'error',
        writable: false
    },

    /**
     * @constant
     */

    INFO: {
        value: 'info',
        writable: false
    },

    /**
     * Set the name of the logger
     *
     * @param {string} name
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    setName: {
        value: function (name) {

            return this;

        }
    },

    /**
     * Log data without specific level
     *
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    log: {
        value: function (message, data) {

            return this;

        }
    },

    /**
     * Log data for development processes
     *
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    debug: {
        value: function (message, data) {

            return this;

        }
    },

    /**
     * Log level for errors in the app (like catched exceptions)
     *
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    error: {
        value: function (message, data) {

            return this;

        }
    },

    /**
     * Log level to information purpose (like telling the steps happening in the app)
     *
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    info: {
        value: function (message, data) {

            return this;

        }
    },

    /**
     * Set a handler for a specific level
     *
     * @param {Sy.Lib.Logger.Handler.Interface} object
     * @param {string} level
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    setHandler: {
        value: function (object, level) {

            return this;

        }
    },

    /**
     * Check if the logger as a handler for the specific level
     *
     * @param {String} level
     *
     * @return {Boolean}
     */

    isHandlingLevel: {
        value: function (level) {}
    },

    /**
     * Remove a handler for the specified level
     *
     * @param {String} level
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    removeHandler: {
        value: function (level) {}
    },

    /**
     * Prevents adding or removing handlers
     *
     * @return {Sy.Lib.Logger.Interface}
     */

    lock: {
        value: function () {}
    }

});
namespace('Sy.Lib.Logger.Handler');

/**
 * Interfaces for all loggers' handlers
 *
 * @package Sy
 * @subpackage Lib.Logger.Handler
 * @interface
 */

Sy.Lib.Logger.Handler.Interface = function (level) {

};

Sy.Lib.Logger.Handler.Interface.prototype = Object.create(Object.prototype, {

    /**
     * Log the message into the dev tools alongside possible extra data (and the time of the log message).
     * Output the information only if the level is handled by this handler
     *
     * @param {string} name Logger name
     * @param {string} level
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.Handler.Interface}
     */

    handle: {
        value: function (name, level, message, data) {}
    },

    /**
     * Check if the wished level is handled by this handler
     *
     * @param {string} level
     *
     * @return {boolean}
     */

    isHandling: {
        value: function (level) {}
    }

});
namespace('Sy.Lib.Logger.Handler');

/**
 * Handles the logging of the app into the browser developer console
 *
 * @package Sy
 * @subpackage Lib.Logger.Handler
 * @class
 * @implements {Sy.Lib.Logger.Handler.Interface}
 */

Sy.Lib.Logger.Handler.Console = function (level) {

    this.level = null;

    if (level !== undefined) {
        this.setLevel(level);
    }

};

Sy.Lib.Logger.Handler.Console.prototype = Object.create(Sy.Lib.Logger.Handler.Interface.prototype, {

    /**
     * Set the logging level for the current handler
     *
     * @param {string} level Must be "log", "debug", "error", "info"
     *
     * @return {Sy.Lib.Logger.Handler.Console}
     */

    setLevel: {
        value: function (level) {

            if (!this.checkLevel(level)) {
                throw new TypeError('Unknown logger level');
            }

            this.level = level;

            return this;

        }
    },

    /**
     * Check that the wished level exists in the logger object,
     * to ensure the user is not trying to set an unknown level
     *
     * @param {string} level
     *
     * @return {boolean}
     */

    checkLevel: {
        value: function (level) {

            if (level.toUpperCase() in Sy.Lib.Logger.Interface.prototype) {
                return true;
            }

            return false;

        }
    },

    /**
     * @inheritDoc
     */

    isHandling: {
        value: function (level) {

            if (level === this.level) {
                return true;
            }

            return false;

        }
    },

    /**
     * @inheritDoc
     */

    handle: {
        value: function (name, level, message, data) {

            if (this.isHandling(level) && 'console' in window) {

                var output = '[' + moment().format('YYYY-M-D hh:mm:ss') + ']',
                    extra = data || [];

                message = message || '';

                output += ' ' + name + '.' + level.toUpperCase();
                output += ' ' + message.toString();

                console[level](output, extra);

            }

            return this;

        }
    }

});
namespace('Sy.Lib.Logger');

/**
 * Default logger of the framework
 *
 * @package Sy
 * @subpackage Lib.Logger
 * @class
 * @implements {Sy.Lib.Logger.Interface}
 *
 * @param {string} name
 */

Sy.Lib.Logger.CoreLogger = function (name) {

    this.name = '';
    this.handlers = {};

    this.setName(name);

};

Sy.Lib.Logger.CoreLogger.prototype = Object.create(Sy.Lib.Logger.Interface.prototype, {

    /**
     * @inheritDoc
     */

    setName: {
        value: function (name) {

            this.name = name || 'null';

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setHandler: {
        value: function (handler, level) {

            if (handler instanceof Sy.Lib.Logger.Handler.Interface && level.toUpperCase() in this) {

                this.handlers[level] = handler;

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    isHandlingLevel: {
        value: function (level) {

            return !!this.handlers[level];

        }
    },

    /**
     * @inheritDoc
     */

    removeHandler: {
        value: function (level) {

            if (this.isHandlingLevel(level)) {
                delete this.handlers[level];
            }

            return this;

        }
    },

    /**
     * Transfer the log information to the appropriate handler depending on the level wished
     *
     * @param {string} level
     * @param {string} message
     * @param {mixed} data
     *
     * @return {Sy.Lib.Logger.CoreLogger}
     */

    handle: {
        value: function (level, message, data) {

            if (this.handlers[level]) {

                this.handlers[level].handle(this.name, level, message, data);

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    log: {
        value: function (message, data) {

            this.handle(this.LOG, message, data);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    debug: {
        value: function (message, data) {

            this.handle(this.DEBUG, message, data);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    error: {
        value: function (message, data) {

            this.handle(this.ERROR, message, data);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    info: {
        value: function (message, data) {

            this.handle(this.INFO, message, data);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    lock: {
        value: function () {

            Object.seal(this.handlers);

            return this;

        }
    }

});
namespace('Sy');

/**
 * Interface to standardize the factories of the framework
 *
 * @package Sy
 * @interface
 */
Sy.FactoryInterface = function () {};

Sy.FactoryInterface.prototype = Object.create(Object.prototype, {

    /**
     * Method to generate a new instance of the object handle by the factory
     *
     * @return {mixed}
     */
    make: {
        value: function () {}
    }

});
namespace('Sy.Lib');

/**
 * Allow to set a series of function that will be called when a channel is "published" via this object
 *
 * @package Sy
 * @subpackage Lib
 * @class
 */

Sy.Lib.Mediator = function () {

    this.channels = {};
    this.generator = null;
    this.logger = null;

};

Sy.Lib.Mediator.prototype = Object.create(Object.prototype, {

    /**
     * Add a subscriber to a channel
     *
     * @param {object} options Available properties: {channel: string, fn: function, context: object, priority: integer, async: boolean}
     *
     * @return {string} A unique identifier for this subscriber
     */

    subscribe: {
        value: function (options) {

            var options = options || {},
                channel = null;

            if (options.priority === undefined){
                options.priority = 1;
            }

            if (this.channels[options.channel] === undefined) {

                channel = new Sy.Lib.MediatorChannel(options.channel);
                channel.setGenerator(this.generator);

                if (this.logger) {
                    channel.setLogger(this.logger);
                }

                this.channels[options.channel] = channel;

            }

            return this.channels[options.channel].add(
                options.fn,
                options.context,
                options.priority,
                options.async,
                options.bubbles
            );

        }

    },

    /**
     * Remove an element of a channel subscribers list
     *
     * @param {string} channel
     * @param {string} id Identifier returned by the method subscribe
     *
     * @return {Sy.Lib.Mediator}
     */

    remove: {
        value: function (channel, id) {

            if (this.channels[channel] !== undefined) {

                this.channels[channel].remove(id);

            }

            return this;

        }

    },

    /**
     * Publish a channel, all arguments after the channel name will
     * be passed to the subscribers as arguments
     *
     * @param {string} channel Channel name
     *
     * @return {Sy.Lib.Mediator}
     */

    publish: {
        value: function () {

            if (arguments.length === 0) {
                return this;
            }

            var channel = Array.prototype.slice.call(arguments, 0, 1)[0],
                args = Array.prototype.slice.call(arguments, 1);

            if (this.channels[channel] !== undefined) {

                this.channels[channel].publish(args);

            }

            return this;

        }

    },

    /**
     * Pause a channel from being fired
     *
     * @param {string} channel
     * @param {string} subscriber Subscriber id, if you want to pause only one subscriber (optional)
     *
     * @return {Sy.Lib.Mediator}
     */

    pause: {
        value: function (channel, subscriber) {

            if (this.channels[channel] !== undefined) {

                this.channels[channel].stopped = true;

                if (subscriber) {
                    this.channels[channel].pause(subscriber);
                }

            }

            return this;

        }

    },

    /**
     * Unpause a channel from being fired
     *
     * @param {string} channel
     * @param {string} subscriber Subscriber id, if you want to unpause only one subscriber (optional)
     *
     * @return {Sy.Lib.Mediator}
     */

    unpause: {
        value: function (channel, subscriber) {

            if (this.channels[channel] !== undefined) {

                this.channels[channel].stopped = false;

                if (subscriber) {
                    this.channels[channel].unpause(subscriber);
                }

            }

            return this;

        }

    },

    /**
     * Say if a channel is paused or not
     *
     * @param {string} channel
     *
     * @return {boolean}
     */

    paused: {
        value: function (channel) {

            if (this.channels[channel] === undefined) {

                return;

            }

            return this.channels[channel].stopped;

        }

    },

    /**
     * Generator dependency setter
     *
     * @param {Sy.Lib.Generator.Interface} object
     *
     * @return {Sy.Lib.Mediator}
     */

    setGenerator: {
        value: function (object) {

            if (!(object instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = object;

            return this;

        }
    },

    /**
     * Logger dependency setter
     *
     * @param {Sy.Lib.Logger.Interface} object
     *
     * @return {Sy.Lib.Mediator}
     */

    setLogger: {
        value: function (object) {

            if (!(object instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = object;

            return this;

        }
    }

});

/**
 * Channel object to be instanciated every time a new channel is created
 *
 * @package Sy
 * @subpackage Lib
 * @class
 *
 * @param {string} name
 */

Sy.Lib.MediatorChannel = function (name) {

    this.name = name || '';
    this.stopped = false;
    this.subscribers = {};
    this.generator = null;
    this.logger = null;

};

Sy.Lib.MediatorChannel.prototype = Object.create(Object.prototype, {

    /**
     * Add a subscriber to the channel
     *
     * @param {function} fn
     * @param {object} context Callback context
     * @param {integer} priority
     * @param {boolean} async
     * @param {boolean} bubbles Set to true if you want errors to bubbles up (otherwise it's catched by the library)
     */

    add: {
        value: function (fn, context, priority, async, bubbles) {

            var guid = this.generator.generate();

            this.subscribers[guid] = {
                fn: fn,
                context: context || window,
                priority: priority || 1,
                async: !!async,
                bubbles: !!bubbles,
                stopped: false
            };

            return guid;

        }

    },

    /**
     * Remove an element of the subscribers list
     *
     * @param {string} id
     *
     * @return {Sy.Lib.MediatorChannel}
     */

    remove: {
        value: function (id) {

            delete this.subscribers[id];

            return this;

        }

    },

    /**
     * Call every subscribers function when a channel is published
     *
     * @param {Array} args Arguments to be passed to the subscribers
     *
     * @return {Sy.Lib.MediatorChannel}
     */

    publish: {
        value: function (args) {

            var args = args || [];

            if (this.stopped === false) {

                var fns = [];

                for (var s in this.subscribers) {

                    if (this.subscribers.hasOwnProperty(s) && this.subscribers[s].stopped === false) {

                        fns.push(this.subscribers[s]);

                    }

                }

                fns.sort(function (a, b) {
                    return a.priority - b.priority;
                });

                for (var i = 0, l = fns.length; i < l; i++) {

                    try {

                        var subscriber = fns[i];

                        if (subscriber.async === true) {
                            setTimeout(
                                this.subscriberCall,
                                0,
                                this,
                                subscriber.fn,
                                subscriber.context,
                                args
                            );
                        } else {
                            this.subscriberCall(
                                this,
                                subscriber.fn,
                                subscriber.context,
                                args
                            );
                        }

                    } catch (error) {

                        if (this.logger) {
                            this.logger.error(error.message, error);
                        }

                        if (subscriber.bubbles === true) {
                            throw error;
                        }

                    }

                }

            }

            return this;

        }

    },

    /**
     * Generator dependency setter
     *
     * @param {Sy.Lib.Generator.interface} object
     *
     * @return {Sy.Lib.MediatorChannel}
     */

    setGenerator: {
        value: function (object) {

            if (!(object instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = object;

            return this;

        }
    },

    /**
     * Logger dependency setter
     *
     * @param {Sy.Lib.Logger.Interface} object
     *
     * @return {Sy.Lib.MediatorChannel}
     */

    setLogger: {
        value: function (object) {

            if (!(object instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = object;

            return this;

        }
    },

    /**
     * Handle calling subscribers and catching exceptions it may throw
     *
     * @param {Sy.Lib.MediatorChannel} self Channel instance
     * @param {function} fn
     * @param {object} context Subscriber context
     * @param {Array} args Subscriber arguments
     *
     * @return {void}
     */

    subscriberCall: {
        value: function (self, fn, context, args) {

            fn.apply(context, args);

        }
    },

    /**
     * Prevent a subscriber from being fired when the channel is published
     *
     * @param {string} id Subscriber id
     *
     * @return {Sy.Lib.MediatorChannel}
     */

    pause: {
        value: function (id) {

            if (this.subscribers[id]) {
                this.subscribers[id].stopped = true;
            }

            return this;

        }
    },

    /**
     * Re-enable a subscriber from being fired if it has been paused before
     *
     * @param {string} id
     *
     * @return {Sy.Lib.MediatorChannel}
     */

    unpause: {
        value: function (id) {

            if (this.subscribers[id]) {
                this.subscribers[id].stopped = false;
            }

            return this;

        }
    }

});
namespace('Sy.HTTP');

/**
 * Interface for building HTTP requests
 *
 * @package Sy
 * @subpackage HTTP
 * @interface
 */

Sy.HTTP.RequestInterface = function () {};

Sy.HTTP.RequestInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set the uri of the request
     *
     * @param {string} uri
     *
     * @return {Sy.HTTP.RequestInterface}
     */

    setURI: {
        value: function (uri) {}
    },

    /**
     * Get the uri
     *
     * @return {string}
     */

    getURI: {
        value: function () {}
    },

    /**
     * Set the method for the request (GET, POST, ...)
     *
     * @param {string} method
     *
     * @return {Sy.HTTP.RequestInterface}
     */

    setMethod: {
        value: function (method) {}
    },

    /**
     * Get the method of the request
     *
     * @return {string}
     */

    getMethod: {
        value: function () {}
    },

    /**
     * Set the data to send in the request
     *
     * @param {object} data
     *
     * @return {Sy.HTTP.RequestInterface}
     */

    setData: {
        value: function (data) {}
    },

    /**
     * Get the request data
     *
     * @return {object}
     */

    getData: {
        value: function () {}
    },

    /**
     * Set a header value
     *
     * Multiple can be set at a time by passing an object like {headerName: value, ...}
     *
     * @param {string|object} header
     * @param {string} value
     *
     * @return {Sy.HTTP.RequestInterface}
     */

    setHeader: {
        value: function (header, value) {}
    },

    /**
     * Get the value of a header field
     *
     * If no header set, it return all of them
     *
     * @param {string} header
     *
     * @return {string|object}
     */

    getHeader: {
        value: function (header) {}
    },

    /**
     * Set a listener to the request to be executed when the response is received
     *
     * @param {function} fn
     * @param {object} context Context object for the listener
     *
     * @return {Sy.HHTP.RequestInterface}
     */

    setListener: {
        value: function (fn, context) {}
    },

    /**
     * Get the listener
     *
     * @return {object}
     */

    getListener: {
        value: function () {}
    },

    /**
     * Set the type of content requested (html/json)
     *
     * @param {string} type
     *
     * @return {Sy.HTTP.RequestInterface}
     */

    setType: {
        value: function (type) {}
    },

    /**
     * Get the request type
     *
     * @return {string}
     */

    getType: {
        value: function () {}
    }

});
namespace('Sy.HTTP');

/**
 * Interface for HTTP response
 *
 * @package Sy
 * @subpackage HTTP
 * @interface
 */

Sy.HTTP.ResponseInterface = function () {};

Sy.HTTP.ResponseInterface.prototype = Object.create(Object.prototype, {

    HTTP_CONTINUE: {
        value: 100,
        writable: false
    },

    HTTP_SWITCHING_PROTOCOLS: {
        value: 101,
        writable: false
    },

    HTTP_PROCESSING: {
        value: 102,
        writable: false
    },

    HTTP_OK: {
        value: 200,
        writable: false
    },

    HTTP_CREATED: {
        value: 201,
        writable: false
    },

    HTTP_ACCEPTED: {
        value: 202,
        writable: false
    },

    HTTP_NON_AUTHORITATIVE_INFORMATION: {
        value: 203,
        writable: false
    },

    HTTP_NO_CONTENT: {
        value: 204,
        writable: false
    },

    HTTP_RESET_CONTENT: {
        value: 205,
        writable: false
    },

    HTTP_PARTIAL_CONTENT: {
        value: 206,
        writable: false
    },

    HTTP_MULTI_STATUS: {
        value: 207,
        writable: false
    },

    HTTP_ALREADY_REPORTED: {
        value: 208,
        writable: false
    },

    HTTP_IM_USED: {
        value: 226,
        writable: false
    },

    HTTP_MULTIPLE_CHOICES: {
        value: 300,
        writable: false
    },

    HTTP_MOVED_PERMANENTLY: {
        value: 301,
        writable: false
    },

    HTTP_FOUND: {
        value: 302,
        writable: false
    },

    HTTP_SEE_OTHER: {
        value: 303,
        writable: false
    },

    HTTP_NOT_MODIFIED: {
        value: 304,
        writable: false
    },

    HTTP_USE_PROXY: {
        value: 305,
        writable: false
    },

    HTTP_RESERVED: {
        value: 306,
        writable: false
    },

    HTTP_TEMPORARY_REDIRECT: {
        value: 307,
        writable: false
    },

    HTTP_PERMANENTLY_REDIRECT: {
        value: 308,
        writable: false
    },

    HTTP_BAD_REQUEST: {
        value: 400,
        writable: false
    },

    HTTP_UNAUTHORIZED: {
        value: 401,
        writable: false
    },

    HTTP_PAYMENT_REQUIRED: {
        value: 402,
        writable: false
    },

    HTTP_FORBIDDEN: {
        value: 403,
        writable: false
    },

    HTTP_NOT_FOUND: {
        value: 404,
        writable: false
    },

    HTTP_METHOD_NOT_ALLOWED: {
        value: 405,
        writable: false
    },

    HTTP_NOT_ACCEPTABLE: {
        value: 406,
        writable: false
    },

    HTTP_PROXY_AUTHENTICATION_REQUIRED: {
        value: 407,
        writable: false
    },

    HTTP_REQUEST_TIMEOUT: {
        value: 408,
        writable: false
    },

    HTTP_CONFLICT: {
        value: 409,
        writable: false
    },

    HTTP_GONE: {
        value: 410,
        writable: false
    },

    HTTP_LENGTH_REQUIRED: {
        value: 411,
        writable: false
    },

    HTTP_PRECONDITION_FAILED: {
        value: 412,
        writable: false
    },

    HTTP_REQUEST_ENTITY_TOO_LARGE: {
        value: 413,
        writable: false
    },

    HTTP_REQUEST_URI_TOO_LONG: {
        value: 414,
        writable: false
    },

    HTTP_UNSUPPORTED_MEDIA_TYPE: {
        value: 415,
        writable: false
    },

    HTTP_REQUESTED_RANGE_NOT_SATISFIABLE: {
        value: 416,
        writable: false
    },

    HTTP_EXPECTATION_FAILED: {
        value: 417,
        writable: false
    },

    HTTP_I_AM_TEAPOT: {
        value: 418,
        writable: false
    },

    HTTP_UNPROCESSABLE_ENTITY: {
        value: 422,
        writable: false
    },

    HTTP_LOCKED: {
        value: 423,
        writable: false
    },

    HTTP_FAILED_DEPENDENCY: {
        value: 424,
        writable: false
    },

    HTTP_RESERVED_FOR_WEBDAV_ADVANCED_COLLECTIONS_EXPIRED_PROPOSAL: {
        value: 425,
        writable: false
    },

    HTTP_UPGRADE_REQUIRED: {
        value: 426,
        writable: false
    },

    HTTP_PRECONDITION_REQURED: {
        value: 428,
        writable: false
    },

    HTTP_TOO_MANY_REQUESTS: {
        value: 429,
        writable: false
    },

    HTTP_REQUEST_HEADER_FIELDS_TOO_LARGE: {
        value: 431,
        writable: false
    },

    HTTP_INTERNAL_SERVOR_ERROR: {
        value: 500,
        writable: false
    },

    HTTP_NOT_IMPLEMENTED: {
        value: 501,
        writable: false
    },

    HTTP_BAD_GATEWAY: {
        value: 502,
        writable: false
    },

    HTTP_SERVICE_UNAVAILABLE: {
        value: 503,
        writable: false
    },

    HTTP_GATEWAY_TIMEOUT: {
        value: 504,
        writable: false
    },

    HTTP_VERSION_NOT_SUPPORTED: {
        value: 505,
        writable: false
    },

    HTTP_VARIANT_ALSO_NEGOTIATES_EXPERIMENTAL: {
        value: 506,
        writable: false
    },

    HTTP_INSUFFICIENT_STORAGE: {
        value: 507,
        writable: false
    },

    HTTP_LOOP_DETECTED: {
        value: 508,
        writable: false
    },

    HTTP_NOT_EXTENDED: {
        value: 510,
        writable: false
    },

    HTTP_NETWORK_AUTHENTICATION_REQUIRED: {
        value: 511,
        writable: false
    },

    /**
     * Set the status code
     *
     * @param {int} code
     *
     * @return {Sy.HTTP.ResponseInterface}
     */

    setStatusCode: {
        value: function (code) {}
    },

    /**
     * Get the status code
     *
     * @return {int}
     */

    getStatusCode: {
        value: function () {}
    },

    /**
     * Set the status message
     *
     * @param {string} message
     *
     * @return {Sy.HTTP.ResponseInterface}
     */

    setStatusText: {
        value: function (message) {}
    },

    /**
     * Get status message
     *
     * @return {string}
     */

    getStatusText: {
        value: function () {}
    },

    /**
     * Set the list of headers
     *
     * @param {object} headers
     *
     * @return {Sy.HTTP.ResponseInterface}
     */

    setHeaders: {
        value: function (headers) {}
    },

    /**
     * Get the value of a header
     *
     * If no header specified it returns all of them
     *
     * @param {string} header
     *
     * @return {mixed}
     */

    getHeader: {
        value: function (header) {}
    },

    /**
     * Set the body data
     *
     * @param {mixed} body
     *
     * @return {Sy.HTTP.ResponseHeader}
     */

    setBody: {
        value: function (body) {}
    },

    /**
     * Get the body content
     *
     * @return {mixed}
     */

    getBody: {
        value: function () {}
    }

});
namespace('Sy.HTTP');

/**
 * Default implementation of the RequestInterface
 *
 * @package Sy
 * @subpackage HTTP
 * @implements {Sy.HTTP.RequestInterface}
 * @class
 */

Sy.HTTP.Request = function () {

    this.method = 'GET';
    this.data = new Sy.Registry();
    this.headers = new Sy.Registry();
    this.listener = null;
    this.type = '';
    this.uri = '';

};

Sy.HTTP.Request.prototype = Object.create(Sy.HTTP.RequestInterface.prototype, {

    /**
     * @inheritDoc
     */

    setURI: {
        value: function (uri) {

            this.uri = uri;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getURI: {
        value: function () {

            return this.uri;

        }
    },

    /**
     * @inheritDoc
     */

    setMethod: {
        value: function (method) {

            var m = method.toUpperCase();

            if (['OPTIONS', 'GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'].indexOf(m) !== -1) {

                this.method = m;

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getMethod: {
        value: function () {

            return this.method;

        }
    },

    /**
     * @inheritDoc
     */

    setData: {
        value: function (data) {

            for (var k in data) {
                if (data.hasOwnProperty(k)) {
                    this.data.set(k, data[k]);
                }
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getData: {
        value: function () {

            return this.data.getMapping();

        }
    },

    /**
     * @inheritDoc
     */

    setHeader: {
        value: function (header, value) {

            if (header instanceof Object) {
                for (var k in header) {
                    if (header.hasOwnProperty(k)) {
                        this.setHeader(k, header[k]);
                    }
                }
            } else if (typeof header === 'string' && typeof value === 'string') {

                this.headers.set(header, value);

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getHeader: {
        value: function (header) {

            if (header !== undefined) {
                if (this.headers.has(header)) {
                    return this.headers.get(header);
                }

                return undefined;
            }

            return this.headers.getMapping();

        }
    },

    /**
     * @inheritDoc
     */

    setListener: {
        value: function (fn) {

            this.listener = fn;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getListener: {
        value: function () {

            return this.listener;

        }
    },

    /**
     * @inheritDoc
     */

    setType: {
        value: function (type) {

            if (['html', 'json', 'blob'].indexOf(type) !== -1) {
                this.type = type;
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getType: {
        value: function () {

            return this.type;

        }
    }

});
namespace('Sy.HTTP');

/**
 * Default implementation of the ResponseInterface
 *
 * @package Sy
 * @subpackage HTTP
 * @implements {Sy.HTTP.ResponseInterface}
 * @class
 */

Sy.HTTP.Response = function () {

    this.statusCode = 0;
    this.statusText = null;
    this.headers = new Sy.Registry();
    this.body = null;

};

Sy.HTTP.Response.prototype = Object.create(Sy.HTTP.ResponseInterface.prototype, {

    /**
     * @inheritDoc
     */

    setStatusCode: {
        value: function (code) {

            this.statusCode = parseInt(code, 10);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getStatusCode: {
        value: function () {

            return this.statusCode;

        }
    },

    /**
     * @inheritDoc
     */

    setStatusText: {
        value: function (message) {

            this.statusText = message;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getStatusText: {
        value: function () {

            return this.statusText;

        }
    },

    /**
     * @inheritDoc
     */

    setHeaders: {
        value: function (headers) {

            for (var h in headers) {
                if (headers.hasOwnProperty(h)) {
                    this.headers.set(h, headers[h]);
                }
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getHeader: {
        value: function (header) {

            if (header === undefined) {

                return this.headers.getMapping();

            } else if (this.headers.has(header)) {

                return this.headers.get(header);

            }

            return undefined;

        }
    },

    /**
     * @inheritDoc
     */

    setBody: {
        value: function (body) {

            this.body = body;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getBody: {
        value: function () {

            return this.body;

        }
    }

});
namespace('Sy.HTTP');

/**
 * Object for requesting JSON documents via ajax
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Request}
 * @class
 */

Sy.HTTP.JSONRequest = function () {

    Sy.HTTP.Request.call(this);

    this.setType('json');
    this.setHeader('Accept', 'application/json');

};

Sy.HTTP.JSONRequest.prototype = Object.create(Sy.HTTP.Request.prototype);
namespace('Sy.HTTP');

/**
 * Response when JSON is returned
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Response}
 * @class
 */

Sy.HTTP.JSONResponse = function () {

    Sy.HTTP.Response.call(this);

};

Sy.HTTP.JSONResponse.prototype = Object.create(Sy.HTTP.Response.prototype);
namespace('Sy.HTTP');

/**
 * Tools to ease extraction of each header and its value
 * from the headers string
 *
 * @package Sy
 * @subpackage HTTP
 * @class
 */

Sy.HTTP.HeaderParser = function () {};

Sy.HTTP.HeaderParser.prototype = Object.create(Object.prototype, {

    /**
     * Take the string of all headers and return an object
     * as key/value pairs for each header
     *
     * @param {string} headers
     *
     * @return {object}
     */

    parse: {
        value: function (headers) {

            var obj = {},
                headersList = headers.split('\n'),
                header,
                value,
                index;

            for (var i = 0, l = headersList.length - 1; i < l; i++) {

                index = headersList[i].indexOf(':');
                header = headersList[i].substring(0, index);
                value = headersList[i].substring(index + 2);

                switch (header) {
                    case 'Date':
                    case 'Expires':
                    case 'Last-Modified':
                        value = new Date(value);
                        break;
                }

                obj[header] = value;

            }

            return obj;

        }
    }

});
namespace('Sy.HTTP');

/**
 * Object for requesting DOM elements via ajax
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Request}
 * @class
 */

Sy.HTTP.HTMLRequest = function () {

    Sy.HTTP.Request.call(this);

    this.setType('html');
    this.setHeader('Accept', 'text/html,application/xhtml+xml');

};

Sy.HTTP.HTMLRequest.prototype = Object.create(Sy.HTTP.Request.prototype);
namespace('Sy.HTTP');

/**
 * Response when HTML is returned
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Response}
 * @class
 */

Sy.HTTP.HTMLResponse = function () {

    Sy.HTTP.Response.call(this);

};

Sy.HTTP.HTMLResponse.prototype = Object.create(Sy.HTTP.Response.prototype);
namespace('Sy.HTTP');

/**
 * Object for requesting images via ajax
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Request}
 * @class
 */

Sy.HTTP.ImageRequest = function () {
    Sy.HTTP.Request.call(this);
    this.setType('blob');
    this.setHeader('Accept', 'image/*');
};
Sy.HTTP.ImageRequest.prototype = Object.create(Sy.HTTP.Request.prototype);

namespace('Sy.HTTP');

/**
 * Image request response as blob
 *
 * @package Sy
 * @subpackage HTTP
 * @extends {Sy.HTTP.Response}
 * @lass
 */

Sy.HTTP.ImageResponse = function () {
    Sy.HTTP.Response.call(this);
};
Sy.HTTP.ImageResponse.prototype = Object.create(Sy.HTTP.Response.prototype, {

    /**
     * Return the image blob
     *
     * @return {Blob}
     */

    getBlob: {
        value: function () {
            return this.getBody();
        }
    }

})
namespace('Sy.HTTP');

/**
 * Accept Request objects and handle launching them,
 * it's possible to cancel them as well
 *
 * @package Sy
 * @subpackage HTTP
 * @class
 */

Sy.HTTP.Manager = function () {

    this.requests = null;
    this.parser = null;
    this.generator = null;
    this.logger = null;

};

Sy.HTTP.Manager.prototype = Object.create(Object.prototype, {

    /**
     * Set the response headers parser
     *
     * @param {object} parser
     *
     * @return {Sy.HTTP.Manager}
     */

    setParser: {
        value: function (parser) {

            this.parser = parser;

            return this;

        }
    },

    /**
     * Set an identifier generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.HTTP.Manager}
     */

    setGenerator: {
        value: function (generator) {

            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator type');
            }

            this.generator = generator;

            return this;

        }
    },

    /**
     * Set a registry holding pending requests
     *
     * @param {Sy.Registry} registry
     *
     * @return {Sy.HTTP.Manager}
     */

    setRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.Registry)) {
                throw new TypeError('Invalid registry');
            }

            this.requests = registry;

            return this;

        }
    },

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.HTTP.Manager}
     */

    setLogger: {
        value: function (logger) {

            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;

        }
    },

    /**
     * Prepare a new HTTP request
     *
     * @param {Sy.HTTP.RequestInterface} request
     *
     * @return {string} Identifier of the request
     */

    prepare: {
        value: function (request) {

            if (!(request instanceof Sy.HTTP.RequestInterface)) {
                throw new TypeError('Invalid request type');
            }

            if (this.logger) {
                this.logger.info('Preparing a new HTTP request...', request);
            }

            var uuid = this.generator.generate(),
                req = {
                    xhr: null,
                    obj: request,
                    uuid: uuid
                },
                headers = request.getHeader(),
                data = request.getData(),
                requestData = new FormData();

            req.xhr = new XMLHttpRequest();

            req.xhr.open(
                request.getMethod(),
                request.getURI()
            );

            req.xhr.UUID = uuid;

            req.xhr.addEventListener('readystatechange', this.listener.bind(this), false);

            switch (request.getType()) {
                case 'html':
                    req.xhr.responseType = 'document';
                    break;
                case 'json':
                    req.xhr.responseType = 'json';
                    break;
            }

            for (var header in headers) {
                if (headers.hasOwnProperty(header)) {
                    req.xhr.setRequestHeader(header, headers[header]);
                }
            }

            for (var k in data) {
                if (data.hasOwnProperty(k)) {
                    requestData.append(k, data[k]);
                }
            }

            req.data = requestData;

            this.requests.set(uuid, req);

            if (this.logger) {
                this.logger.info('HTTP request prepared', req);
            }

            return uuid;

        }
    },

    /**
     * Return the XMLHttpRequest instance for the specified uuid
     *
     * @param {String} uuid
     *
     * @return {XMLHttpRequest}
     */

    getXHR: {
        value: function (uuid) {

            var req = this.requests.get(uuid);

            return req.xhr;

        }
    },

    /**
     * Launch the specified request
     * If it's a uuid, it will send the previously prepared request
     * If it's a request object, it will automatically prepare it
     *
     * @param {String|Sy.HTTP.RequestInterface} request
     *
     * @return {string} Identifier of the request
     */

    launch: {
        value: function (request) {

            if (typeof request === 'string') {
                var req = this.requests.get(request);

                if (this.logger) {
                    this.logger.info('Launching a HTTP request...', req);
                }

                req.xhr.send(req.data);

                return req.uuid;
            } else {
                return this.launch(this.prepare(request));
            }

        }
    },

    /**
     * Listener wrapper for xhr state change
     *
     * @private
     *
     * @param {XMLHttpRequestProgressEvent} event
     *
     * @return {void}
     */

    listener: {
        value: function (event) {

            if (
                event.target.readyState === event.target.DONE &&
                this.requests.has(event.target.UUID)
            ) {

                var request = this.requests.get(event.target.UUID),
                    lstn = request.obj.getListener(),
                    headers = this.parser.parse(event.target.getAllResponseHeaders()),
                    response;

                if (
                    headers['Content-Type'] !== undefined &&
                    headers['Content-Type'].indexOf('application/json') !== -1 &&
                    request.obj.getType() === 'json'
                ) {

                    response = new Sy.HTTP.JSONResponse();

                } else if (
                    headers['Content-Type'] !== undefined &&
                    headers['Content-Type'].indexOf('text/html') !== -1 &&
                    request.obj.getType() === 'html'
                ) {

                    response = new Sy.HTTP.HTMLResponse();

                } else if (
                    headers['Content-Type'] !== undefined &&
                    headers['Content-Type'].indexOf('image/') !== -1 &&
                    request.obj.getType() === 'blob'
                ) {

                    response = new Sy.HTTP.ImageResponse();

                } else {

                    response = new Sy.HTTP.Response();

                }

                response.setHeaders(headers);
                response.setStatusCode(event.target.status);
                response.setStatusText(event.target.statusText);

                response.setBody(event.target.response);

                this.requests.remove(event.target.UUID);

                if (lstn instanceof Function) {

                    if (this.logger) {
                        this.logger.info('Notifying the request is finished...', response);
                    }

                    lstn(response);

                }

            }

        }
    },

    /**
     * Abort a request
     *
     * @param {string} identifier
     *
     * @return {Sy.HTTP.Manager}
     */

    abort: {
        value: function (identifier) {

            var request = this.requests.get(identifier);

            request.xhr.abort();
            this.requests.remove(identifier);

            if (this.logger) {
                this.logger.info('HTTP request aborted', identifier);
            }

            return this;

        }
    },

    /**
     * Return an array of all pending xhrs
     *
     * @return {Array}
     */

    getStack: {
        value: function () {
            return this.requests.get();
        }
    }

});
namespace('Sy.HTTP');

/**
 * Wrapper to ease the process of constructing REST calls
 *
 * @package Sy
 * @subpackage HTTP
 * @class
 */

Sy.HTTP.REST = function () {

    this.manager = null;

};

Sy.HTTP.REST.prototype = Object.create(Object.prototype, {

    /**
     * Set the http manager
     *
     * @param {Sy.HTTP.Manager} manager
     *
     * @return {Sy.HTTP.REST}
     */

    setManager: {
        value: function (manager) {

            if (!(manager instanceof Sy.HTTP.Manager)) {
                throw new TypeError('Invalid manager');
            }

            this.manager = manager;

            return this;

        }
    },

    /**
     * Make a request to the server with as options an object as follows
     *
     * <code>
     *   {
     *       data: {
     *           input: 'input value'
     *       },
     *       headers: {
     *           headerName: 'header value'
     *       },
     *       uri: 'url/to/request',
     *       listener: 'function to call',
     *       method: 'get|post|put|delete'
     *   }
     * </code>
     *
     * Every REST response as to be a JSON document
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    request: {
        value: function (args) {

            var request = new Sy.HTTP.JSONRequest();

            args.data = args.data || {};
            args.headers = args.headers || {};

            request.setMethod(args.method);
            request.setURI(args.uri);
            request.setHeader(args.headers);
            request.setData(args.data);
            request.setListener(args.listener);

            this.manager.launch(request);

        }
    },

    /**
     * Create a GET request
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    get: {
        value: function (args) {

            args.method = 'get';

            this.request(args);

            return this;

        }
    },

    /**
     * Create a POST request
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    post: {
        value: function (args) {

            args.method = 'post';

            this.request(args);

            return this;

        }
    },

    /**
     * Create a PUT request
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    put: {
        value: function (args) {

            args.method = 'put';
            args.data = args.data || {_method: 'put'};

            this.request(args);

            return this;

        }
    },

    /**
     * Create a DELETE request
     *
     * @param {object} args
     *
     * @return {Sy.HTTP.REST}
     */

    remove: {
        value: function (args) {

            args.method = 'delete';
            args.data = args.data || {_method: 'delete'};

            this.request(args);

            return this;

        }
    }

});
namespace('Sy');

/**
 * Interface for registries
 *
 * @package Sy
 * @interface
 */
Sy.RegistryInterface = function () {};

Sy.RegistryInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set a new key/value pair in the registry
     *
     * @param {string} key
     * @param {mixed} value
     *
     * @return {Sy.RegistryInterface}
     */

    set: {
        value: function (key, value) {}
    },

    /**
     * Check if the key is set in the registry
     *
     * @param {string} key
     *
     * @return {boolean}
     */

    has: {
        value: function (key) {}
    },

    /**
     * Get the value associated of the passed key
     *
     * If the key is not referenced, it will throw a ReferenceError
     * If the key is not specified, it will return an array of all values
     *
     * @param {string} key
     *
     * @return {mixed}
     */

    get: {
        value: function (key) {}
    },

    /**
     * Return all the key/value pairs
     *
     * @return {object}
     */

    getMapping: {
        value: function () {}
    },

    /**
     * Remove elements from the registry
     *
     * If a key is specified it will removed only this one.
     * If an array of keys is specified it will removed only this set.
     *
     * @param {string|Array} keys Optionnal
     *
     * @return {Sy.RegistryInterface}
     */

    remove: {
        value: function (keys) {}
    },

    /**
     * Return the number of elements held by the registry
     *
     * @return {int}
     */

    length: {
        value: function () {}
    }

});
namespace('Sy');

/**
 * Default implementation of the RegistryInterface
 * It allows to handle key/value pairs
 *
 * @package Sy
 * @implements {Sy.RegistryInterface}
 * @class
 */

Sy.Registry = function () {

    this.data = {};
    this.registryLength = 0;

};

Sy.Registry.prototype = Object.create(Sy.RegistryInterface.prototype, {

    /**
     * @inheritDoc
     */

    set: {
        value: function (key, value) {

            if (typeof key === 'string') {

                this.data[key] = value;
                this.registryLength++;

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    has: {
        value: function (key) {

            if (this.data.hasOwnProperty(key)) {
                return true;
            }

            return false;

        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (key) {

            if (this.has(key)) {

                return this.data[key];

            } else if (key === undefined) {

                var data = [];

                for (var k in this.data) {
                    if (this.data.hasOwnProperty(k)) {
                        data.push(this.data[k]);
                    }
                }

                return data;

            }

            throw new ReferenceError('"' + key + '" is not defined');

        }
    },

    /**
     * @inheritDoc
     */

    getMapping: {
        value: function () {

            var data = {};

            for (var k in this.data) {
                if (this.data.hasOwnProperty(k)) {
                    data[k] = this.data[k];
                }
            }

            return data;

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (keys) {

            if (keys === undefined) {

                for (var key in this.data) {
                    if (this.data.hasOwnProperty(key)) {
                        this.remove(key);
                    }
                }

            } else if (keys instanceof Array) {

                for (var i = 0, l = keys.length; i < l; i++) {
                    this.remove(keys[i]);
                }

            } else if (typeof keys === 'string' && this.has(keys)) {

                delete this.data[keys];
                this.registryLength--;

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    length: {
        value: function () {
            return this.registryLength;
        }
    }

});
namespace('Sy');

/**
 * Factory generating basic registry
 *
 * @package Sy
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.RegistryFactory = function () {};
Sy.RegistryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function () {
            return new Sy.Registry();
        }
    }

});
namespace('Sy');

/**
 * Tool to easily retrieve/set data of a particular path in an object graph
 *
 * @package Sy
 * @class
 */

Sy.PropertyAccessor = function (disableGetterSetter) {
    this.disableGetterSetter = !!disableGetterSetter;
};

Sy.PropertyAccessor.prototype = Object.create(Object.prototype, {

    prefixes: {
        value: ['get', 'is', 'has'],
        writable: false,
        configurable: false
    },

    /**
     * Return the value for the given object path
     *
     * @param {Object} object Path root
     * @param {String|Array} path
     *
     * @throws {ReferenceError} If the path is not reachable
     *
     * @return {mixed}
     */

    getValue: {
        value: function (object, path) {
            var elements = this.transform(path),
                prop = elements.shift(),
                refl = new ReflectionObject(object),
                fromGetter = false,
                value,
                method;

            if (!this.disableGetterSetter) {
                for (var i = 0, l = this.prefixes.length; i < l; i++) {
                    method = this.prefixes[i] + this.camelize(prop);

                    if (refl.hasMethod(method)) {
                        value = refl.getMethod(method).call();
                        fromGetter = true;
                        break;
                    }
                }

                if (!fromGetter && refl.hasMethod('get')) {
                    value = refl.getMethod('get').call(prop);
                    fromGetter = true;
                }
            }

            if (!fromGetter && refl.hasProperty(prop)) {
                value = refl.getProperty(prop).getValue();
            } else if (!fromGetter) {
                return undefined;
            }

            if (elements.length === 0) {
                return value;
            }

            return this.getValue(value, elements);
        }
    },

    /**
     * Access the specified path in the object and change the value to the one specified
     *
     * @param {Object} object
     * @param {String} path
     * @param {mixed} value
     *
     * @return {Sy.PropertyAccessor} self
     */

    setValue: {
        value: function (object, path, value) {
            var elements = this.transform(path),
                prop = elements.pop(),
                refl,
                method;

            if (elements.length !== 0) {
                object = this.getValue(object, elements);
            }

            if (typeof object === 'undefined') {
                throw new ReferenceError('Path "' + path + '" not writable');
            }

            if (!this.disableGetterSetter) {
                method = 'set' + this.camelize(prop);
                refl = new ReflectionObject(object);

                if (refl.hasMethod(method)) {
                    refl.getMethod(method).call(value);
                    return this;
                }
            }

            object[prop] = value;

            return this;
        }
    },

    /**
     * Transform a path string into an array of its elements
     *
     * @param {String|Array} path
     *
     * @return {Array}
     */

    transform: {
        value: function (path) {
            if (path instanceof Array) {
                return path;
            }

            if (typeof path !== 'string' || path.trim() === '') {
                throw new TypeError('Invalid path');
            }

            return path.split('.');
        }
    },

    /**
     * Camelize a string
     *
     * @param {String} string
     *
     * @return {String}
     */

    camelize: {
        value: function (string) {
            var pieces = string.split('_');

            pieces.forEach(function (el, id) {
                this[id] = el.substr(0, 1).toUpperCase() + el.substr(1);
            }, pieces);

            return pieces.join('');
        }
    },

    /**
     * Activate the use of getters/setters
     *
     * @return {Sy.PropertyAccessor} self
     */

    enableSetterGetter: {
        value: function () {
            this.disableGetterSetter = false;

            return this;
        }
    },

    /**
     * Deactivate the use of getters/setters
     *
     * @return {Sy.PropertyAccessor} self
     */

    disableSetterGetter: {
        value: function () {
            this.disableGetterSetter = true;

            return this;
        }
    }

});

namespace('Sy');

/**
 * Interface to describe how to manipulate key/value pairs
 * in different states
 *
 * @package Sy
 * @interface
 */

Sy.StateRegistryInterface = function () {};

Sy.StateRegistryInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set a new element for a specific state
     *
     * @param {string} state
     * @param {string} key
     * @param {mixed} value
     *
     * @return {Sy.StateRegistryInterface}
     */

    set: {
        value: function (state, key, value) {}
    },

    /**
     * Check if the key exist in a state
     *
     * If the key is not specified, it check if any element has been set for the specified state
     *
     * @param {string} state
     * @param {string} key
     *
     * @return {boolean}
     */

    has: {
        value: function (state, key) {}
    },

    /**
     * Get an element for a specific state
     *
     * If the key is not specified, it return an array of all elements for the specific state.
     * If no parameters, it return a list of data arrays like {stateName: [data1, data2, ...], ...}
     *
     * @param {string} state
     * @param {string} key
     *
     * @return {mixed}
     */

    get: {
        value: function (state, key) {}
    },

    /**
     * Retrieve the state of a specific key
     *
     * @param {string} key
     *
     * @return {string|undefined}
     */

    state: {
        value: function (key) {}
    },

    /**
     * Remove an element in a state
     *
     * If no key specified it will remove all elements of the state
     * if no parameters it will remove all elements
     *
     * @param {string} state
     * @param {string} key
     *
     * @return {Sy.StateRegistryInterface}
     */

    remove: {
        value: function (state, key) {}
    },

    /**
     * Set the registry as strict, meaning a key can only exist in one state
     *
     * @return {Sy.StateRegistryInterface}
     */

    setStrict: {
        value: function () {}
    }

});
namespace('Sy');

/**
 * Default implementation of StateRegistryInterface
 *
 * @package Sy
 * @implements {Sy.StateRegistryInterface}
 * @class
 */

Sy.StateRegistry = function () {
    this.data = null;
    this.states = [];
    this.registryFactory = null;
    this.strict = false;
};

Sy.StateRegistry.prototype = Object.create(Sy.StateRegistryInterface.prototype, {

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.StateRegistry}
     */

    setRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.RegistryFactory)) {
                throw new TypeError('Invalid factory');
            }

            this.registryFactory = factory;
            this.data = factory.make();

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    set: {
        value: function (state, key, value) {

            if (!this.has(state)) {

                var r = this.registryFactory.make();

                this.data.set(state, r);
                this.states.push(state);

            }

            if (this.strict === true) {
                var oldState = this.state(key);

                if (oldState !== undefined) {
                    this.remove(oldState, key);
                }
            }

            this.data
                .get(state)
                .set(key, value);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    has: {
        value: function (state, key) {

            if (key === undefined && this.data.has(state)) {
                return true;
            }

            if (this.data.has(state) && this.data.get(state).has(key)) {
                return true;
            }

            return false;

        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (state, key) {

            switch (arguments.length) {
                case 2:
                    if (this.has(state, key)) {
                        return this.data.get(state).get(key);
                    }
                    break;
                case 1:
                    if (this.has(state)) {
                        return this.data.get(state).get();
                    }
                    break;
                case 0:
                    var data = {};

                    for (var s in this.states) {
                        if (this.states.hasOwnProperty(s)) {
                            data[this.states[s]] = this.data.get(this.states[s]).get();
                        }
                    }

                    return data;
            }

            throw new ReferenceError('"' + key + '" does not exist in "' + state + '" state');

        }
    },

    /**
     * @inheritDoc
     */

    state: {
        value: function (key) {

            var states = [];

            for (var s in this.states) {
                if (this.data.get(this.states[s]).has(key)) {
                    states.push(this.states[s]);
                }
            }

            switch (states.length) {
                case 0:
                    return undefined;
                case 1:
                    return states[0];
                default:
                    return states;
            }

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (state, key) {

            if (state === undefined) {
                for (var i = 0, l = this.states.length; i < l; i++) {
                    this.remove(this.states[i]);
                }
            } else {
                this.data.get(state).remove(key);
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setStrict: {
        value: function () {
            this.strict = true;

            return this;
        }
    },

    /**
     * Return all the states having at least one value
     *
     * @return {Array}
     */

    getStates: {
        value: function () {
            var states = [];

            for (var i = 0, l = this.states.length; i < l; i++) {
                if (this.data.get(this.states[i]).get().length > 0) {
                    states.push(this.states[i]);
                }
            }

            return states;
        }
    }

});
namespace('Sy');

/**
 * Factory generating state registry objects
 *
 * @package Sy
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.StateRegistryFactory = function () {

    this.registryFactory = null;

};
Sy.StateRegistryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.StateRegistryFactory}
     */

    setRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.RegistryFactory)) {
                throw new TypeError('Invalid factory');
            }

            this.registryFactory = factory;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function () {

            var q = new Sy.StateRegistry();

            q.setRegistryFactory(this.registryFactory);

            return q;

        }
    }

});
namespace('Sy');

/**
 * Entity interface
 *
 * @package Sy
 * @interface
 */

Sy.EntityInterface = function () {};
Sy.EntityInterface.prototype = Object.create(Object.prototype, {

    UUID: {
        value: 'uuid'
    },

    /**
     * Set an attribute value to the entity
     *
     * @param {string} attr
     * @param {mixed} value
     *
     * @return {Sy.EntityInterface}
     */

    set: {
        value: function (attr, value) {

            return this;

        }
    },

    /**
     * Return an attribute value
     *
     * @param {string} attr
     *
     * @return {mixed}
     */

    get: {
        value: function (attr) {}
    }

});
namespace('Sy');

/**
 * Default implementation of an entity
 *
 * @package Sy
 * @class
 * @implements {Sy.EntityInterface}
 */

Sy.Entity = function () {};
Sy.Entity.prototype = Object.create(Sy.EntityInterface.prototype, {

    INDEXES: {
        value: [],
        enumerable: false
    },

    /**
     * @inheritDoc
     */

    set: {
        value: function (attr, value) {
            if (attr instanceof Object) {
                for (var p in attr) {
                    if (attr.hasOwnProperty(p)) {
                        this.set(p, attr[p]);
                    }
                }
            } else {
                this[attr] = value;
            }

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (attr) {
            return this[attr];
        }
    }

});
namespace('Sy.Storage');

/**
 * Entry point to the storage mechanism
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.Core = function () {
    this.managers = null;
    this.defaultName = 'default';
    this.factory = null;
};
Sy.Storage.Core.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry to hold managers
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.Core} self
     */

    setManagersRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.managers = registry;

            return this;
        }
    },

    /**
     * Set the default manager name
     *
     * @param {String} defaultName
     *
     * @return {Sy.Storage.Core} self
     */

    setDefaultManager: {
        value: function (defaultName) {
            this.defaultName = defaultName || 'default';

            return this;
        }
    },

    /**
     * Set the manager factory
     *
     * @param {Sy.Storage.ManagerFactory} factory
     *
     * @return {Sy.Storage.Core} self
     */

    setManagerFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.ManagerFactory)) {
                throw new TypeError('Invalid manager factory');
            }

            this.factory = factory;

            return this;
        }
    },

    /**
     * Get an entity manager
     *
     * @param {String} name Manager name, optional
     *
     * @return {Sy.Storage.Manager}
     */

    getManager: {
        value: function (name) {
            name = name || this.defaultName;

            if (this.managers.has(name)) {
                return this.managers.get(name);
            }

            var manager = this.factory.make(name);

            this.managers.set(name, manager);

            return manager;
        }
    }

});

namespace('Sy.Storage');

/**
 * Hold the relation between an alias and an entity constructor
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.IdentityMap = function () {
    this.aliases = [];
    this.constructors = [];
    this.prototypes = [];
    this.keys = [];
};
Sy.Storage.IdentityMap.prototype = Object.create(Object.prototype, {

    /**
     * Set a new entity definition
     *
     * @param {String} alias
     * @param {Function} entity
     * @param {String} key
     *
     * @return {Sy.Storage.IdentityMap} self
     */

    set: {
        value: function (alias, entity, key) {
            if (Object.isFrozen(this.aliases)) {
                return this;
            }

            this.aliases.push(alias);
            this.constructors.push(entity);
            this.prototypes.push(entity.prototype);
            this.keys.push(key);

            return this;
        }
    },

    /**
     * Lock the definitions so indexes are preserved (no addition nor removal)
     *
     * @return {Sy.Storage.IdentityMap} self
     */

    lock: {
        value: function () {
            Object.freeze(this.aliases);
            Object.freeze(this.constructors);
            Object.freeze(this.prototypes);
            Object.freeze(this.keys);

            return this;
        }
    },

    /**
     * Check if the given alias is defined
     *
     * @param {String} alias
     *
     * @return {Boolean}
     */

    hasAlias: {
        value: function (alias) {
            return this.aliases.indexOf(alias) !== -1;
        }
    },

    /**
     * Check if the given entity is defined
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    hasEntity: {
        value: function (entity) {
            var refl = new ReflectionObject(entity);

            return this.prototypes.indexOf(refl.getPrototype()) !== -1;
        }
    },

    /**
     * Return the alias for the given entity
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {String}
     */

    getAlias: {
        value: function (entity) {
            var refl = new ReflectionObject(entity),
                idx = this.prototypes.indexOf(refl.getPrototype());

            return this.aliases[idx];
        }
    },

    /**
     * Return the entity constructor for the given alias
     *
     * @param {String} alias
     *
     * @return {Sy.EntityInterface}
     */

    getConstructor: {
        value: function (alias) {
            var idx = this.aliases.indexOf(alias);

            return this.constructors[idx];
        }
    },

    /**
     * Return the key for the specified alias
     *
     * @param {String} alias
     *
     * @return {String}
     */

    getKey: {
        value: function (alias) {
            var idx = this.aliases.indexOf(alias);

            return this.keys[idx];
        }
    }

});

namespace('Sy.Storage');

/**
 * Event fired before/after an entity is committed to the database
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @extends {Sy.EventDispatcher.Event}
 */

Sy.Storage.LifeCycleEvent = function (alias, entity) {
    this.alias = alias;
    this.entity = entity;
    this.aborted = false;
};
Sy.Storage.LifeCycleEvent.prototype = Object.create(Sy.EventDispatcher.Event.prototype, {

    PRE_CREATE: {
        value: 'storage.pre.create',
        writable: false
    },

    POST_CREATE: {
        value: 'storage.post.create',
        writable: false
    },

    PRE_UPDATE: {
        value: 'storage.pre.update',
        writable: false
    },

    POST_UPDATE: {
        value: 'storage.post.update',
        writable: false
    },

    PRE_REMOVE: {
        value: 'storage.pre.remove',
        writable: false
    },

    POST_REMOVE: {
        value: 'storage.post.remove',
        writable: false
    },

    /**
     * Return the alias of the entity being committed
     *
     * @return {String}
     */

    getAlias: {
        value: function () {
            return this.alias;
        }
    },

    /**
     * Return the entity being committed
     *
     * @return {Sy.EntityInterface}
     */

    getEntity: {
        value: function () {
            return this.entity;
        }
    },

    /**
     * Abort the commit to the database for this entity
     *
     * @return {Sy.Storage.LifeCycleEvent} self
     */

    abort: {
        value: function () {
            this.aborted = true;

            return this;
        }
    },

    /**
     * Check if the commit needs to be aborted
     *
     * @return {Boolean}
     */

    isAborted: {
        value: function () {
            return this.aborted;
        }
    }

});

namespace('Sy.Storage');

/**
 * Entity manager
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.Manager = function () {
    this.driver = null;
    this.uow = null;
    this.mappings = null;
    this.repoFactory = null;
};
Sy.Storage.Manager.prototype = Object.create(Object.prototype, {

    /**
     * Set the database driver
     *
     * @param {Sy.Storage.Dbal.DriverInterface} driver
     *
     * @return {Sy.Storage.Manager} self
     */

    setDriver: {
        value: function (driver) {
            if (!(driver instanceof Sy.Storage.Dbal.DriverInterface)) {
                throw new TypeError('Invalid dbal driver');
            }

            this.driver = driver;

            return this;
        }
    },

    /**
     * Return the driver
     *
     * @return {Sy.Storage.Dbal.DriverInterface}
     */

    getDriver: {
        value: function () {
            return this.driver;
        }
    },

    /**
     * Set the unit of work
     *
     * @param {Sy.Storage.UnitOfWork} uow
     *
     * @return {Sy.Storage.Manager} self
     */

    setUnitOfWork: {
        value: function (uow) {
            if (!(uow instanceof Sy.Storage.UnitOfWork)) {
                throw new TypeError('Invalid unit of work');
            }

            this.uow = uow;

            return this;
        }
    },

    /**
     * Return the UnitOfWork
     *
     * @return {Sy.Storage.UnitOfWork}
     */

    getUnitOfWork: {
        value: function () {
            return this.uow;
        }
    },

    /**
     * Set the allowed entities to be managed here
     *
     * @param {Array} mappings
     *
     * @return {Sy.Storage.Manager} self
     */

    setMappings: {
        value: function (mappings) {
            if (!(mappings instanceof Array)) {
                throw new TypeError('Invalid mappings array');
            }

            this.mappings = mappings;

            return this;
        }
    },

    /**
     * Set the repository factory
     *
     * @param {Sy.Storage.RepositoryFactory} factory
     *
     * @return {Sy.Storage.Manager} self
     */

    setRepositoryFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.RepositoryFactory)) {
                throw new TypeError('Invalid repository factory');
            }
            this.repoFactory = factory;

            return this;
        }
    },

    /**
     * Get the repository for the given alias
     *
     * @param {String} alias
     *
     * @return {Sy.Storage.Repository}
     */

    getRepository: {
        value: function (alias) {
            if (!this.isHandled(alias)) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            return this.repoFactory.make(this, alias);
        }
    },

    /**
     * Find an entity by its id
     *
     * @param {String} alias Entity name alias (ie: 'Bundle::Entity')
     * @param {String} id
     *
     * @return {Promise}
     */

    find: {
        value: function (alias, id) {
            if (!this.isHandled(alias)) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            return this.uow.find(alias, id);
        }
    },

    /**
     * Plan an entity to be persisted to the database
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.Manager} self
     */

    persist: {
        value: function (entity) {
            if (!this.isHandled(this.uow.getIdentityMap().getAlias(entity))) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            this.uow.persist(entity);

            return this;
        }
    },

    /**
     * Commit the changes to the database
     *
     * @return {Sy.Storage.Manager} self
     */

    flush: {
        value: function () {
            this.uow.commit();

            return this;
        }
    },

    /**
     * Plan an entity to be removed from the database
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.Manager} self
     */

    remove: {
        value: function (entity) {
            if (!this.isHandled(this.uow.getIdentityMap().getAlias(entity))) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            this.uow.remove(entity);

            return this;
        }
    },

    /**
     * Detach all the entities managed
     *
     * @param {String} alias Entity alias, optional
     *
     * @return {Sy.Storage.Manager} self
     */

    clear: {
        value: function (alias) {
            this.uow.clear(alias);

            return this;
        }
    },

    /**
     * Detach an entity from the manager,
     * any changes to the entity will not be persisted
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.Manager} self
     */

    detach: {
        value: function (entity) {
            if (!this.isHandled(this.uow.getIdentityMap().getAlias(entity))) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            this.uow.detach(entity);

            return this;
        }
    },

    /**
     * Tell if the entity is managed by this manager
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    contains: {
        value: function (entity) {
            if (!this.isHandled(this.uow.getIdentityMap().getAlias(entity))) {
                throw new ReferenceError('Entity not handled by this manager');
            }

            return this.uow.isManaged(entity);
        }
    },

    /**
     * Check if the alias is managed by this manager
     *
     * @private
     * @param {String} alias
     *
     * @return {Boolean}
     */

    isHandled: {
        value: function (alias) {
            if (this.mappings.length === 0) {
                return true;
            }

            return this.mappings.indexOf(alias) !== -1;
        }
    }

});

namespace('Sy.Storage');

/**
 * Build entity manager instances
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.ManagerFactory = function () {
    this.definitions = {};
    this.dbals = null;
    this.repoFactory = null;
    this.uowFactory = null;
};
Sy.Storage.ManagerFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the managers definitions
     *
     * @param {Object} definitions
     *
     * @return {Sy.Storage.ManagerFactory} self
     */

    setDefinitions: {
        value: function (definitions) {
            this.definitions = definitions || {};

            return this;
        }
    },

    /**
     * Set the factory to build dbals
     *
     * @param {Sy.Storage.Dbal.Factory} factory
     *
     * @return {Sy.Storage.ManagerFactory} self
     */

    setDbalFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.Dbal.Factory)) {
                throw new TypeError('Invalid dbal factory');
            }

            this.dbals = factory;

            return this;
        }
    },

    /**
     * Set the repository factory
     *
     * @param {Sy.Storage.RepositoryFactory} factory
     *
     * @return {Sy.Storage.ManagerFactory} self
     */

    setRepositoryFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.RepositoryFactory)) {
                throw new TypeError('Invalid repository factory');
            }

            this.repoFactory = factory;

            return this;
        }
    },

    /**
     * Set the unit of work factory
     *
     * @param {Sy.Storage.UnitOfWorkFactory} factory
     *
     * @return {Sy.Storage.ManagerFactory} self
     */

    setUnitOfWorkFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.UnitOfWorkFactory)) {
                throw new TypeError('Invalid unit of work factory');
            }

            this.uowFactory = factory;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (name) {
            if (!this.definitions.hasOwnProperty(name)) {
                throw new ReferenceError('Unknown manager definition');
            }

            var manager = new Sy.Storage.Manager(),
                uow = this.uowFactory.make(),
                driver = this.dbals.make(
                    this.definitions[name].connection
                );

            uow.setDriver(driver);

            return manager
                .setDriver(driver)
                .setRepositoryFactory(this.repoFactory)
                .setMappings(
                    this.definitions[name].mappings || []
                )
                .setUnitOfWork(uow);
        }
    }

});

namespace('Sy.Storage');

/**
 * Entity repository
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @param {Sy.Storage.Manager} em
 * @param {String} alias
 */

Sy.Storage.Repository = function (em, alias) {
    if (!(em instanceof Sy.Storage.Manager)) {
        throw new TypeError('Invalid entity manager');
    }

    this.em = em;
    this.alias = alias;
};
Sy.Storage.Repository.prototype = Object.create(Object.prototype, {

    /**
     * Detach all the entities for this entity type
     *
     * @return {Sy.Storage.Repository} self
     */

    clear: {
        value: function () {
            this.em.clear(this.alias);

            return this;
        }
    },

    /**
     * Find an entity by its id
     *
     * @param {String} id
     *
     * @return {Promise}
     */

    find: {
        value: function (id) {
            return this.em.find(this.alias, id);
        }
    },

    /**
     * Find all entities
     *
     * @return {Promise}
     */

    findAll: {
        value: function () {
            return this.em
                .getUnitOfWork()
                .findAll(this.alias);
        }
    },

    /**
     * Find all entities matching the criteria
     *
     * @param {String} index
     * @param {mixed} value Value or array of bounds
     * @param {Integer} limit optional
     *
     * @return {Promise}
     */

    findBy: {
        value: function (index, value, limit) {
            return this.em
                .getUnitOfWork()
                .findBy(this.alias, index, value, limit);
        }
    },

    /**
     * Find one entity matching the criteria
     *
     * @param {String} index
     * @param {mixed} value Value or array of bounds
     *
     * @return {Promise}
     */

    findOneBy: {
        value: function (index, value) {
            return this.em
                .getUnitOfWork()
                .findBy(this.alias, index, value, 1)
                .then(function (entities) {
                    if (entities.length === 1) {
                        return entities[0];
                    }

                    throw new ReferenceError('Entity not found');
                });
        }
    }

});

namespace('Sy.Storage');

/**
 * Build a repository for the specified alias
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.RepositoryFactory = function () {
    this.metadata = null;
    this.loaded = null;
};
Sy.Storage.RepositoryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set a registry to hold entities metadata
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.RepositoryFactory} self
     */

    setMetadataRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.metadata = registry;

            return this;
        }
    },

    /**
     * Set a registry to hold loaded repositories
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.RepositoryFactory} self
     */

    setRepositoriesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.loaded = registry;

            return this;
        }
    },

    /**
     * Set a new entity definition
     *
     * @param {String} alias
     * @param {Function} repository Repository constructor
     *
     * @return {Sy.Storage.RepositoryFactory} self
     */

    setRepository: {
        value: function (alias, repository) {
            this.metadata.set(alias, repository);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (em, alias) {
            if (this.loaded.has(alias)) {
                return this.loaded.get(alias);
            }

            if (!this.metadata.has(alias)) {
                throw new ReferenceError('Unknown entity alias "' + alias + '"');
            }

            var repo = new (this.metadata.get(alias))(
                em,
                alias
            );

            if (!(repo instanceof Sy.Storage.Repository)) {
                throw new TypeError('Invalid repository');
            }

            this.loaded.set(alias, repo);

            return repo;
        }
    }

});

namespace('Sy.Storage');

/**
 * Extract necessary information from entities metadata
 * and inject properly the repositories definition in the factory
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.RepositoryFactoryConfigurator = function () {
    this.metadata = null;
};
Sy.Storage.RepositoryFactoryConfigurator.prototype = Object.create(Object.prototype, {

    /**
     * Set the entities metadata
     *
     * @param {Array} metadata
     */

    setMetadata: {
        value: function (metadata) {
            this.metadata = metadata;
        }
    },

    /**
     * Inject the repositories definitions in the factory
     *
     * @param {Sy.Storage.RepositoryFactory} factory
     */

    configure: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.RepositoryFactory)) {
                throw new TypeError('Invalid repository factory');
            }

            for (var i = 0, l = this.metadata.length; i < l; i++) {
                factory.setRepository(
                    this.metadata[i].alias,
                    this.metadata[i].repository || Sy.Storage.Repository
                );
            }
        }
    }

});

namespace('Sy.Storage');

/**
 * Bridge between database driver and entity level
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.UnitOfWork = function () {
    this.driver = null;
    this.map = null;
    this.entities = null;
    this.states = null;
    this.propertyAccessor = null;
    this.scheduledForInsert = [];
    this.scheduledForUpdate = [];
    this.scheduledForDelete = [];
    this.logger = null;
    this.generator = null;
    this.dispatcher = null;
};
Sy.Storage.UnitOfWork.prototype = Object.create(Object.prototype, {

    STATE_NEW: {
        value: 'new',
        writable: false,
    },

    STATE_MANAGED: {
        value: 'managed',
        writable: false
    },

    STATE_DETACHED: {
        value: 'detached',
        writable: false
    },

    STATE_REMOVED: {
        value: 'removed',
        writable: false
    },

    /**
     * Set the database driver
     *
     * @param {Sy.Storage.Dbal.DriverInterface} driver
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setDriver: {
        value: function (driver) {
            if (!(driver instanceof Sy.Storage.Dbal.DriverInterface)) {
                throw new TypeError('Invalid database driver');
            }

            this.driver = driver;

            return this;
        }
    },

    /**
     * Set the identity map
     *
     * @param {Sy.Storage.IdentityMap} map
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setIdentityMap: {
        value: function (map) {
            if (!(map instanceof Sy.Storage.IdentityMap)) {
                throw new TypeError('Invalid identity map');
            }

            this.map = map;

            return this;
        }
    },

    /**
     * Return the identity map
     *
     * @return {Sy.Storage.IdentityMap}
     */

    getIdentityMap: {
        value: function () {
            return this.map;
        }
    },

    /**
     * Set a state registry to hold loaded entities
     *
     * @param {Sy.StateRegistryInterface} registry
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setEntitiesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.StateRegistryInterface)) {
                throw new TypeError('Invalid state registry');
            }

            this.entities = registry;

            return this;
        }
    },

    /**
     * Set a property accessor
     *
     * @param {Sy.PropertyAccessor} accessor
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setPropertyAccessor: {
        value: function (accessor) {
            if (!(accessor instanceof Sy.PropertyAccessor)) {
                throw new TypeError('Invalid property accessor');
            }

            this.propertyAccessor = accessor;

            return this;
        }
    },

    /**
     * Set a state registry to hold entities states
     *
     * @param {Sy.StateRegistryInterface} registry
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setStatesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.StateRegistryInterface)) {
                throw new TypeError('Invalid state registry');
            }

            this.states = registry;

            return this;
        }
    },

    /**
     * Set a logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setLogger: {
        value: function (logger) {
            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;
        }
    },

    /**
     * Set a generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setGenerator: {
        value: function (generator) {
            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = generator;

            return this;
        }
    },

    /**
     * Set the event dispatcher
     *
     * @param {Sy.EventDispatcher.EventDispatcherInterface} dispatcher
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    setDispatcher: {
        value: function (dispatcher) {
            if (!(dispatcher instanceof Sy.EventDispatcher.EventDispatcherInterface)) {
                throw new TypeError('Invalid event dispatcher');
            }

            this.dispatcher = dispatcher;

            return this;
        }
    },

    /**
     * Find an entity for the specified id
     *
     * @param {String} alias
     * @param {String} id
     *
     * @return {Promise}
     */

    find: {
        value: function (alias, id) {
            if (this.entities.has(alias, id)) {
                return new Promise(function (resolve) {
                    resolve(this.entities.get(alias, id));
                }.bind(this));
            }

            return this.driver
                .read(alias, id)
                .then(function (data) {
                    return this.buildEntity(alias, data);
                }.bind(this));
        }
    },

    /**
     * Find all the entities for the given alias
     *
     * @param {String} alias
     *
     * @return {Promise}
     */

    findAll: {
        value: function (alias) {
            return this.driver
                .findAll(alias)
                .then(function (data) {
                    for (var i = 0, l = data.length; i < l; i++) {
                        data[i] = this.buildEntity(alias, data[i]);
                    }

                    return data;
                }.bind(this));
        }
    },

    /**
     * Find entities matching the given alias and criteria
     *
     * @param {String} alias
     * @param {String} index
     * @param {mixed} value
     * @param {Integer} limit
     *
     * @return {Promise}
     */

    findBy: {
        value: function (alias, index, value, limit) {
            return this.driver
                .find(alias, index, value, limit)
                .then(function (data) {
                    for (var i = 0, l = data.length; i < l; i++) {
                        data[i] = this.buildEntity(alias, data[i]);
                    }

                    return data;
                }.bind(this));
        }
    },

    /**
     * Build an entity for the specified alias
     *
     * @private
     * @param {String} alias
     * @param {Object} data
     *
     * @return {Sy.EntityInterface}
     */

    buildEntity: {
        value: function (alias, data) {
            var constructor = this.map.getConstructor(alias),
                key = this.map.getKey(alias),
                entity;

            if (this.entities.has(alias, data[key])) {
                entity = this.entities.get(alias, data[key]);
            } else {
                entity = new constructor();
                this.entities.set(alias, data[key], entity);

                (new ObjectObserver(entity))
                    .open(function () {
                        this.computeSchedules(entity);
                    }.bind(this));
            }

            for (var p in data) {
                if (data.hasOwnProperty(p)) {
                    entity.set(p, data[p]);
                }
            }

            this.states.set(this.STATE_MANAGED, data[key], data[key]);

            return entity;
        }
    },

    /**
     * Plan the given entity to be persisted
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    persist: {
        value: function (entity) {
            if (!(entity instanceof Sy.EntityInterface)) {
                throw new TypeError('Invalid entity');
            }

            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                id = this.propertyAccessor.getValue(entity, key),
                state = this.states.state(id);

            if (state === undefined) {
                id = this.generator.generate();
                this.states.set(
                    this.STATE_NEW,
                    id,
                    id
                );
                this.scheduledForInsert.push(entity);
                this.propertyAccessor.setValue(entity, key, id);

                (new ObjectObserver(entity))
                    .open(function () {
                        this.computeSchedules(entity);
                    }.bind(this));
            } else {
                this.scheduledForUpdate.push(entity);
            }

            this.entities.set(alias, id, entity);

            return this;
        }
    },

    /**
     * Commit the changes to the database
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    commit: {
        value: function () {
            Platform.performMicrotaskCheckpoint();

            this.scheduledForInsert.forEach(function (entity) {
                var alias = this.map.getAlias(entity),
                    key = this.map.getKey(alias),
                    id = this.propertyAccessor.getValue(entity, key),
                    event = new Sy.Storage.LifeCycleEvent(alias, entity);

                this.dispatcher && this.dispatcher.dispatch(
                    event.PRE_CREATE,
                    event
                );

                if (event.isAborted()) {
                    return;
                }

                this.driver
                    .create(alias, this.getEntityData(entity))
                    .then(function () {
                        this.states.set(
                            this.STATE_MANAGED,
                            id,
                            id
                        );

                        this.dispatcher && this.dispatcher.dispatch(
                            event.POST_CREATE,
                            event
                        );

                        this.logger && this.logger.info(
                            'Entity created',
                            entity
                        );
                    }.bind(this));
            }, this);
            this.scheduledForUpdate.forEach(function (entity) {
                var alias = this.map.getAlias(entity),
                    key = this.map.getKey(alias),
                    id = this.propertyAccessor.getValue(entity, key),
                    event = new Sy.Storage.LifeCycleEvent(alias, entity);

                this.dispatcher && this.dispatcher.dispatch(
                    event.PRE_UPDATE,
                    event
                );

                if (event.isAborted()) {
                    return;
                }

                this.driver
                    .update(
                        alias,
                        id,
                        this.getEntityData(entity)
                    )
                    .then(function () {
                        this.dispatcher && this.dispatcher.dispatch(
                            event.POST_UPDATE,
                            event
                        );

                        this.logger && this.logger.info(
                            'Entity updated',
                            entity
                        );
                    });
            }, this);
            this.scheduledForDelete.forEach(function (entity) {
                var alias = this.map.getAlias(entity),
                    key = this.map.getKey(alias),
                    id = this.propertyAccessor.getValue(entity, key),
                    event = new Sy.Storage.LifeCycleEvent(alias, entity);

                this.dispatcher && this.dispatcher.dispatch(
                    event.PRE_REMOVE,
                    event
                );

                if (event.isAborted()) {
                    return;
                }

                this.driver
                    .remove(alias, id)
                    .then(function () {
                        this.states.set(
                            this.STATE_REMOVED,
                            id,
                            id
                        );

                        this.dispatcher && this.dispatcher.dispatch(
                            event.POST_REMOVE,
                            event
                        );

                        this.logger && this.logger.info(
                            'Entity removed',
                            entity
                        )
                    }.bind(this));
            }, this);

            //reinitialize schedules so 2 close commits can't trigger
            //an entity to be sent to the driver twice
            this.scheduledForInsert.splice(0);
            this.scheduledForUpdate.splice(0);
            this.scheduledForDelete.splice(0);

            return this;
        }
    },

    /**
     * Plan the entity to be removed from the database
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    remove: {
        value: function (entity) {
            if (!(entity instanceof Sy.EntityInterface)) {
                throw new TypeError('Invalid entity');
            }

            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                state = this.states.state(
                    this.propertyAccessor.getValue(entity, key)
                );

            if (state === this.STATE_MANAGED) {
                if (this.isScheduledForUpdate(entity)) {
                    this.scheduledForUpdate.splice(
                        this.scheduledForUpdate.indexOf(entity),
                        1
                    );
                }

                this.scheduledForDelete.push(entity);
            } else if (state === this.STATE_NEW) {
                this.scheduledForInsert.splice(
                    this.scheduledForInsert.indexOf(entity),
                    1
                );
            }

            return this;
        }
    },

    /**
     * Detach all entities or the ones of the given alias
     *
     * @param {String} alias optional
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    clear: {
        value: function (alias) {
            var entities = this.entities.get(),
                constructor;

            for (var a in entities) {
                if (entities.hasOwnProperty(a)) {

                    if (alias !== undefined && alias !== a) {
                        continue;
                    }

                    for (var i = 0, l = entities[a].length; i < l; i++) {
                        this.detach(entities[a][i]);
                    }

                    if (alias !== undefined && alias === a) {
                        break;
                    }
                }
            }

            return this;
        }
    },

    /**
     * Detach the given entity
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Sy.Storage.UnitOfWork} self
     */

    detach: {
        value: function (entity) {
            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                id = this.propertyAccessor.getValue(entity, key);

            this.states.set(this.STATE_DETACHED, id, id);

            if (this.isScheduledForInsert(entity)) {
                this.scheduledForInsert.splice(
                    this.scheduledForInsert.indexOf(entity),
                    1
                );
            }

            if (this.isScheduledForUpdate(entity)) {
                this.scheduledForUpdate.splice(
                    this.scheduledForUpdate.indexOf(entity),
                    1
                );
            }

            if (this.isScheduledForDelete(entity)) {
                this.scheduledForDelete.splice(
                    this.scheduledForDelete.indexOf(entity),
                    1
                );
            }

            return this;
        }
    },

    /**
     * Check if the entity is managed
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isManaged: {
        value: function (entity) {
            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                id = this.propertyAccessor.getValue(entity, key);
                state = this.states.state(id);

            return [this.STATE_NEW, this.STATE_MANAGED].indexOf(state) !== -1;
        }
    },

    /**
     * Check if the entity is scheduled for insertion
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForInsert: {
        value: function (entity) {
            return this.scheduledForInsert.indexOf(entity) !== -1;
        }
    },

    /**
     * Check if the entity is scheduled for update
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForUpdate: {
        value: function (entity) {
            return this.scheduledForUpdate.indexOf(entity) !== -1;
        }
    },

    /**
     * Check if the entity is scheduled for removal
     *
     * @param {Sy.EntityInterface} entity
     *
     * @return {Boolean}
     */

    isScheduledForDelete: {
        value: function (entity) {
            return this.scheduledForDelete.indexOf(entity) !== -1;
        }
    },

    /**
     * Update the schedules for the given entity
     * If entity scheduled for insert leave as is
     * otherwise plan for update except if planned for delete
     *
     * @private
     * @param {Sy.EntityInterface} entity
     */

    computeSchedules: {
        value: function (entity) {
            var alias = this.map.getAlias(entity),
                key = this.map.getKey(alias),
                state = this.states.state(
                    this.propertyAccessor.getValue(entity, key)
                );

            if (state === this.STATE_MANAGED && !this.isScheduledForUpdate(entity)) {
                this.scheduledForUpdate.push(entity);
            }
        }
    },

    /**
     * Extract the data as a POJO from an entity
     *
     * @private
     * @param {Sy.EtityInterface} entity
     *
     * @return {Object}
     */

    getEntityData: {
        value: function (entity) {
            var data = {},
                refl = new ReflectionObject(entity);

            refl.getProperties().forEach(function (refl) {
                data[refl.getName()] = this.propertyAccessor.getValue(
                    entity,
                    refl.getName()
                );
            }.bind(this));

            return data;
        }
    }

});

namespace('Sy.Storage');

/**
 * Create a generic unit of work
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.UnitOfWorkFactory = function () {
    this.identityMap = new Sy.Storage.IdentityMap();
    this.stateRegistryFactory = null;
    this.propertyAccessor = null;
    this.logger = null;
    this.generator = null;
    this.dispatcher = null;
};
Sy.Storage.UnitOfWorkFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set all entities metadata
     *
     * @param {Array} metadata
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setEntitiesMetadata: {
        value: function (metadata) {
            if (!(metadata instanceof Array)) {
                throw new TypeError('Invalid metadata array');
            }

            for (var i = 0, l = metadata.length; i < l; i++) {
                this.identityMap.set(
                    metadata[i].alias,
                    metadata[i].entity,
                    metadata[i].uuid
                );
            }

            this.identityMap.lock();

            return this;
        }
    },

    /**
     * Set the state registry factory
     *
     * @param {Sy.StateRegistryFactory} factory
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setStateRegistryFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.StateRegistryFactory)) {
                throw new TypeError('Invalid state registry factory');
            }

            this.stateRegistryFactory = factory;

            return this;
        }
    },

    /**
     * Set a property accessor
     *
     * @param {Sy.PropertyAccessor} accessor
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setPropertyAccessor: {
        value: function (accessor) {
            if (!(accessor instanceof Sy.PropertyAccessor)) {
                throw new TypeError('Invalid property accessor');
            }

            this.propertyAccessor = accessor;

            return this;
        }
    },

    /**
     * Set a logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setLogger: {
        value: function (logger) {
            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;
        }
    },

    /**
     * Set a generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setGenerator: {
        value: function (generator) {
            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = generator;

            return this;
        }
    },

    /**
     * Set the event dispatcher
     *
     * @param {Sy.EventDispatcher.EventDispatcherInterface} dispatcher
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setDispatcher: {
        value: function (dispatcher) {
            if (!(dispatcher instanceof Sy.EventDispatcher.EventDispatcherInterface)) {
                throw new TypeError('Invalid event dispatcher');
            }

            this.dispatcher = dispatcher;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function () {
            var uow = new Sy.Storage.UnitOfWork();

            return uow
                .setIdentityMap(this.identityMap)
                .setEntitiesRegistry(this.stateRegistryFactory.make())
                .setStatesRegistry(
                    this.stateRegistryFactory
                        .make()
                        .setStrict()
                )
                .setPropertyAccessor(this.propertyAccessor)
                .setLogger(this.logger)
                .setGenerator(this.generator)
                .setDispatcher(this.dispatcher);
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Factory to build a storage driver instance
 *
 * @package Sy
 * @subpackage Storage
 * @interface
 */

Sy.Storage.Dbal.DriverFactoryInterface = function () {};
Sy.Storage.Dbal.DriverFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Build a driver instance
     *
     * @param {String} dbname
     * @param {Integer} version
     * @param {Array} stores
     * @param {Object} options
     *
     * @return {Sy.Storage.Dbal.DriverFactoryInterface} self
     */

    make: {
        value: function (dbname, version, stores, options) {}
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Minimum signature a driver must implement
 *
 * @package Sy
 * @subpackage Storage
 * @interface
 */

Sy.Storage.Dbal.DriverInterface = function () {};
Sy.Storage.Dbal.DriverInterface.prototype = Object.create(Object.prototype, {

    /**
     * Retrieve an object by its id
     *
     * @param {String} store
     * @param {String} id
     *
     * @return {Promise}
     */

    read: {
        value: function (store, id) {}
    },

    /**
     * Create a new element in the store
     *
     * @param {String} store
     * @param {Object} object
     *
     * @return {Promise}
     */

    create: {
        value: function (store, object) {}
    },

    /**
     * Update an object in the store
     *
     * @param {String} store
     * @param {String} id
     * @param {Object} object
     *
     * @return {Promise}
     */

    update: {
        value: function (store, id, object) {}
    },

    /**
     * Delete an object from the store
     *
     * @param {String} store
     * @param {String} id
     *
     * @return {Promise}
     */

    remove: {
        value: function (store, id) {}
    },

    /**
     * Find (an) element(s) in the storage
     *
     * @param {String} store
     * @param {String} index
     * @param {Mixed} value
     * @param {Integer} limit Optional
     *
     * @return {Promise}
     */

    find: {
        value: function (store, index, value, limit) {}
    },

    /**
     * Retrieve all the objects from a store
     *
     * @param {String} store
     *
     * @return {Promise}
     */

    findAll: {
        value: function (store) {}
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Factory that leverage storage drivers factories to build a specific driver
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.Dbal.Factory = function () {
    this.factories = null;
    this.defaultConnection = 'default';
    this.connections = {};
};
Sy.Storage.Dbal.Factory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set a registry to hold drivers factories
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.Dbal.Factory} self
     */

    setFactoriesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.factories = registry;

            return this;
        }
    },

    /**
     * Set a new driver factory
     *
     * @param {String} name Driver name
     * @param {Sy.Storage.Dbal.DriverFactoryInterface} factory
     *
     * @return {Sy.Storage.Dbal.Factory} self
     */

    setDriverFactory: {
        value: function (name, factory) {
            if (!(factory instanceof Sy.Storage.Dbal.DriverFactoryInterface)) {
                throw new TypeError('Invalid driver factory');
            }

            if (this.factories.has(name)) {
                throw new ReferenceError('Can\'t redefine the driver factory "' + name + '"');
            }

            this.factories.set(
                name,
                factory
            );

            return this;
        }
    },

    /**
     * Set the default connection name
     *
     * @param {String} name
     *
     * @return {Sy.Storage.Dbal.Factory} self
     */

    setDefaultConnectionName: {
        value: function (name) {
            this.defaultConnection = name || 'default';

            return this;
        }
    },

    /**
     * Set the list of available connections
     *
     * @param {Object} connections
     *
     * @return {Sy.Storage.Dbal.Factory} self
     */

    setConnections: {
        value: function (connections) {
            this.connections = connections || {};

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (name) {
            name = name || this.defaultConnection;

            if (!this.connections.hasOwnProperty(name)) {
                throw new ReferenceError('No connection defined with the name "' + name + '"');
            }

            var conn = this.connections[name],
                factory,
                driver;

            if (!this.factories.has(conn.driver)) {
                throw new ReferenceError('Unknown driver "' + conn.driver + '"');
            }

            factory = this.factories.get(conn.driver);
            driver = factory.make(
                conn.dbname,
                conn.version || 1,
                conn.stores || [],
                conn.options || {}
            );

            if (!(driver instanceof Sy.Storage.Dbal.DriverInterface)) {
                throw new TypeError('Invalid driver instance');
            }

            return driver;
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Storage driver leveraging IndexedDB to persist objects
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverInterface}
 */

Sy.Storage.Dbal.IndexedDB = function () {
    this.version = 1;
    this.connection = null;
    this.transaction = null;
    this.keyRange = null;
    this.transactionModes = {
        READ_ONLY: null,
        READ_WRITE: null
    };
    this.name = null;
    this.stores = {};
    this.storage = null;
    this.logger = null;
    this.opened = false;
    this.openingCheckInterval = null;
    this.openingPromise = null;
};
Sy.Storage.Dbal.IndexedDB.prototype = Object.create(Sy.Storage.Dbal.DriverInterface.prototype, {

    /**
     * Set the storage name
     *
     * @param {String} name
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setName: {
        value: function (name) {
            this.name = name;

            return this;
        }
    },

    /**
     * Set the storage version
     *
     * @param {Integer} version
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setVersion: {
        value: function (version) {
            this.version = version || 1;

            return this;
        }
    },

    /**
     * Set the connection object to IndexedDB
     *
     * @param {IDBFactory} conn
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setConnection: {
        value: function (conn) {
            if (!(conn instanceof IDBFactory)) {
                throw new TypeError('Invalid connection');
            }

            this.connection = conn;

            return this;
        }
    },

    /**
     * Set transaction object
     *
     * @param {IDBTransaction} transaction
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setTransaction: {
        value: function (transaction) {
            this.transaction = transaction;
            this.transactionModes.READ_ONLY = transaction.READ_ONLY || 'readonly';
            this.transactionModes.READ_WRITE = transaction.READ_WRITE || 'readwrite';

            return this;
        }
    },

    /**
     * Set key range object
     *
     * @param {IDBKeyRange} keyRange
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setKeyRange: {
        value: function (keyRange) {
            this.keyRange = keyRange;

            return this;
        }
    },

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setLogger: {
        value: function (logger) {
            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;
        }
    },

    /**
     * Set a new store
     *
     * @param {String} alias
     * @param {String} name
     * @param {String} identifier
     * @param {Array} indexes
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    setStore: {
        value: function (alias, name, identifier, indexes) {
            this.stores[alias] = {
                path: name,
                key: identifier,
                indexes: indexes
            };

            return this;
        }
    },

    /**
     * Open the connection to the database
     *
     * @return {Sy.Storage.Dbal.IndexedDB} self
     */

    open: {
        value: function () {
            var request = this.connection.open(this.name, this.version);

            request.onupgradeneeded = this.upgradeDatabase.bind(this);
            request.onsuccess = function (event) {
                this.storage = event.target.result;
                this.opened = true;
                this.storage.onerror = function (event) {
                    this.logger && this.logger.error('Database operation failed', [this.name, event]);
                };

                this.logger && this.logger.info('Database opened', this.name);
            }.bind(this);
            request.onerror = function (event) {
                this.logger && this.logger.error('Database opening failed', [this.name, event]);
            }.bind(this);
            request.onblocked = function (event) {
                this.logger && this.logger.error('Database opening failed! (blocked by browser setting)', [this.name, event]);
            }.bind(this);

            return this;
        }
    },

    /**
     * Return a promise to know when the database is opened
     *
     * @return {Promise}
     */

    whenOpened: {
        value: function () {
            if (this.openingPromise) {
                return this.openingPromise;
            }

            this.openingPromise = new Promise(function (resolve) {
                if (this.opened === true) {
                    resolve();
                    return;
                }

                if (this.openingCheckInterval !== null) {
                    return;
                }

                this.openingCheckInterval = setInterval(function () {
                    if (this.opened === true) {
                        resolve();
                        clearInterval(this.openingCheckInterval);
                    }
                }.bind(this), 50);
            }.bind(this));

            return this.openingPromise;
        }
    },

    /**
     * Upgrade the definition of the database
     *
     * @private
     * @param {Object} event
     */

    upgradeDatabase: {
        value: function (event) {
            var objectStore;

            this.logger && this.logger.info('Upgrading database...', [this.name, this.version]);

            this.storage = event.target.result;

            for (var store in this.stores) {
                if (this.stores.hasOwnProperty(store)) {
                    store = this.stores[store];

                    if (!this.storage.objectStoreNames.contains(store.path)) {
                        this.storage.createObjectStore(
                            store.path,
                            {
                                keyPath: store.key,
                                autoincrement: false
                            }
                        );
                    }

                    objectStore = event.target.transaction.objectStore(store.path);

                    for (var i = 0, l = objectStore.indexNames.length; i < l; i++) {
                        if (store.indexes.indexOf(objectStore.indexNames[i]) === -1) {
                            objectStore.deleteIndex(objectStore.indexNames[i]);
                        }
                    }

                    for (var j = 0, jl = store.indexes.length; j < jl; j++) {
                        if (!objectStore.indexNames.contains(store.indexes[j])) {
                            objectStore.createIndex(
                                store.indexes[j],
                                store.indexes[j],
                                {unique: false}
                            );
                        }
                    }
                }
            }
        }
    },

    /**
     * @inheritDoc
     */

    read: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_ONLY
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.get(id);

                    request.addEventListener('success', function (event) {
                        resolve(event.target.result);
                    }.bind(this));
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Read operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Read operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    create: {
        value: function (storeName, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_WRITE
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.put(object);

                    request.addEventListener('success', function (event) {
                        resolve(event.target.result);
                    }.bind(this));
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Create operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Create operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    update: {
        value: function (storeName, id, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_WRITE
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.put(object);

                    request.addEventListener('success', function (event) {
                        resolve(event.target.result);
                    }.bind(this));
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Update operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Update operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_WRITE
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.delete(id);

                    request.addEventListener('success', function (event) {
                        resolve(event.target.result);
                    }.bind(this));

                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Delete operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Delete operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    find: {
        value: function (storeName, indexName, value, limit) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_ONLY
                        ),
                        objectStore = transaction.objectStore(store.path),
                        index = objectStore.index(indexName),
                        results = [],
                        keyRange,
                        request;

                    if (value instanceof Array && value.length === 2) {

                        if (value[0] === undefined) {
                            keyRange = this.keyRange.upperBound(value[1]);
                        } else if (value[1] === undefined) {
                            keyRange = this.keyRange.lowerBound(value[0]);
                        } else {
                            keyRange = this.keyRange.bound(value[0], value[1]);
                        }

                    } else {
                        keyRange = this.keyRange.only(value);
                    }

                    request = index.openCursor(keyRange);

                    request.addEventListener('success', function (event) {

                        var result = event.target.result;

                        if (!!result === false) {
                            if (limit !== undefined) {
                                resolve(results.slice(0, limit));
                            } else {
                                resolve(results);
                            }
                            return;
                        }

                        results.push(result.value);
                        result.continue();

                    });
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Search operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Search operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    findAll: {
        value: function (storeName) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                try {
                    var transaction = this.storage.transaction(
                            [store.path],
                            this.transactionModes.READ_ONLY
                        ),
                        objectStore = transaction.objectStore(store.path),
                        request = objectStore.openCursor(),
                        results = [];

                    request.addEventListener('success', function (event) {

                        var result = event.target.result;

                        if (!!result === false) {
                            resolve(results);
                            return;
                        }

                        results.push(result.value);
                        result.continue();

                    });
                    request.addEventListener('error', function (event) {
                        this.logger && this.logger.error('Search operation failed!', [this.name, event]);
                        reject(event);
                    }.bind(this));
                } catch (e) {
                    this.logger && this.logger.error('Search operation failed!', [
                        this.name,
                        e
                    ]);
                    reject(e);
                }
            }.bind(this));
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * IndexedDB driver factory
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverFactoryInterface}
 */

Sy.Storage.Dbal.IndexedDBFactory = function () {
    this.meta = [];
    this.logger = null;
};
Sy.Storage.Dbal.IndexedDBFactory.prototype = Object.create(Sy.Storage.Dbal.DriverFactoryInterface.prototype, {

    /**
     * Set all the defined entities
     *
     * @param {Array} meta
     *
     * @return {Sy.Storage.Dbal.IndexedDBFactory} self
     */

    setEntitiesMeta: {
        value: function (meta) {
            this.meta = meta;

            return this;
        }
    },

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.Dbal.IndexedDBFactory} self
     */

    setLogger: {
        value: function (logger) {
            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (dbname, version, stores, options) {
            var driver = new Sy.Storage.Dbal.IndexedDB();

            driver
                .setName(dbname)
                .setVersion(version)
                .setConnection(
                    window.indexedDB ||
                    window.webkitIndexedDB ||
                    window.mozIndexedDB ||
                    window.msIndexedDB
                )
                .setTransaction(
                    window.IDBTransaction ||
                    window.webkitIDBTransaction
                )
                .setKeyRange(
                    window.IDBKeyRange ||
                    window.webkitIDBKeyRange
                )
                .setLogger(this.logger);

            for (var i = 0, l = this.meta.length; i < l; i++) {
                if (stores.length === 0 || stores.indexOf(this.meta[i].alias) !== -1) {
                    driver.setStore(
                        this.meta[i].alias,
                        this.meta[i].alias.toLowerCase(),
                        this.meta[i].uuid,
                        this.meta[i].indexes
                    );
                }
            }

            return driver.open();
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Storage driver leveraging Storage to persist objects
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverInterface}
 */

Sy.Storage.Dbal.Localstorage = function () {
    this.storage = null;
    this.stores = {};
    this.data = null;
    this.name = null;
};
Sy.Storage.Dbal.Localstorage.prototype = Object.create(Sy.Storage.Dbal.DriverInterface.prototype, {

    /**
     * Set the database name
     *
     * @param {String} name
     *
     * @return {Sy.Storage.Dbal.Localstorage} self
     */

    setName: {
        value: function (name) {
            this.name = name;

            return this;
        }
    },

    /**
     * Set the storage connection
     *
     * @param {Storage} storage
     *
     * @return {Sy.Storage.Dbal.Localstorage} self
     */

    setConnection: {
        value: function (storage) {
            if (!(storage instanceof Storage)) {
                throw new TypeError('Invalid storage');
            }

            this.storage = storage;

            return this;
        }
    },

    /**
     * Set a new store
     *
     * @param {String} alias
     * @param {String} name
     * @param {String} identifier
     *
     * @return {Sy.Storage.Dbal.Localstorage} self
     */

    setStore: {
        value: function (alias, name, identifier) {
            this.stores[alias] = {
                path: name,
                key: identifier
            };

            return this;
        }
    },

    /**
     * Open the storage and load the data
     *
     * @return {Sy.Storage.Dbal.Localstorage} self
     */

    open: {
        value: function () {
            var data = this.storage.getItem(this.name);

            if (!data) {
                this.createStorage();
            } else {
                this.data = JSON.parse(data);
            }

            return this;
        }
    },

    /**
     * Initialize the database structure
     *
     * @private
     */

    createStorage: {
        value: function () {
            this.data = {};

            for (var store in this.stores) {
                if (this.stores.hasOwnProperty(store)) {
                    this.data[this.stores[store].path] = {};
                }
            }

            this.commit();

            return this;
        }
    },

    /**
     * Write the data to the database
     *
     * @private
     */

    commit: {
        value: function () {
            this.storage.setItem(this.name, JSON.stringify(this.data));
        }
    },

    /**
     * @inheritDoc
     */

    read: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                if (this.data[store.path].hasOwnProperty(id)) {
                    resolve(this.data[store.path][id]);
                }
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    create: {
        value: function (storeName, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.data[store.path][object[store.key]] = object;
                this.commit();

                resolve(object[store.key]);
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    update: {
        value: function (storeName, id, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.data[store.path][id] = object;
                this.commit();

                resolve(object);
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                delete this.data[store.path][id];
                this.commit();

                resolve();
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    find: {
        value: function (storeName, index, value, limit) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                }

                var store = this.stores[storeName],
                    data = [],
                    d;

                for (var key in this.data[store.path]) {
                    if (this.data[store.path].hasOwnProperty(key)) {
                        d = this.data[store.path][key];

                        if (value instanceof Array) {
                            if (
                                (
                                    value[0] === undefined &&
                                    d[index] <= value[1]
                                ) ||
                                (
                                    value[1] === undefined &&
                                    d[index] >= value[0]
                                ) ||
                                (
                                    d[index] >= value[0] &&
                                    d[index] <= value[1]
                                )
                            ) {
                                data.push(d);
                            }

                        } else if (d[index] === value) {
                            data.push(d);
                        }
                    }
                }

                if (limit !== undefined) {
                    data = data.slice(0, limit);
                }

                resolve(data);
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    findAll: {
        value: function (storeName) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName],
                    data = [];

                for (var key in this.data[store.path]) {
                    if (this.data[store.path].hasOwnProperty(key)) {
                        data.push(this.data[store.path][key]);
                    }
                }

                resolve(data);
            }.bind(this));
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * LocalStorage driver factory
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverFactoryInterface}
 */

Sy.Storage.Dbal.LocalstorageFactory = function () {
    this.meta = [];
};
Sy.Storage.Dbal.LocalstorageFactory.prototype = Object.create(Sy.Storage.Dbal.DriverFactoryInterface.prototype, {

    /**
     * Set all the defined entities
     *
     * @param {Array} meta
     *
     * @return {Sy.Storage.Dbal.LocalstorageFactory} self
     */

    setEntitiesMeta: {
        value: function (meta) {
            this.meta = meta;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (dbname, version, stores, options) {
            var driver = new Sy.Storage.Dbal.Localstorage();

            driver
                .setName(dbname)
                .setConnection(
                    options.temporary === true ?
                        localStorage :
                        sessionStorage
                );

            for (var i = 0, l = this.meta.length; i < l; i++) {
                if (stores.length === 0 || stores.indexOf(this.meta[i].alias) !== -1) {
                    driver.setStore(
                        this.meta[i].alias,
                        this.meta[i].alias.toLowerCase(),
                        this.meta[i].uuid
                    );
                }
            }

            return driver.open();
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Storage driver leveraging HTTP to persist objects
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverInterface}
 */

Sy.Storage.Dbal.Rest = function () {
    this.pattern = null;
    this.version = 1;
    this.connection = null;
    this.logger = null;
    this.headers = {};
    this.stores = {};
};
Sy.Storage.Dbal.Rest.prototype = Object.create(Sy.Storage.Dbal.DriverInterface.prototype, {

    /**
     * Set the url pattern
     *
     * @param {String} pattern
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setURLPattern: {
        value: function (pattern) {
            if (!(/.*\/$/).test(pattern)) {
                pattern += '/';
            }

            this.pattern = pattern;

            return this;
        }
    },

    /**
     * Set the version
     *
     * @param {Integer} version
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setVersion: {
        value: function (version) {
            if (this.pattern) {
                this.pattern = this.pattern.replace('{version}', version);
            }

            this.version = version;

            return this;
        }
    },

    /**
     * Set the REST engine
     *
     * @param {Sy.HTTP.REST} rest
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setConnection: {
        value: function (rest) {
            if (!(rest instanceof Sy.HTTP.REST)) {
                throw new TypeError('Invalid rest engine');
            }

            this.connection = rest;

            return this;
        }
    },

    /**
     * Set a header to be passed on each http request
     *
     * @param {String} name
     * @param {String} value
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setHeader: {
        value: function (name, value) {
            this.headers[name] = value;

            return this;
        }
    },

    /**
     * Set a new store
     *
     * @param {String} alias
     * @param {String} bundle
     * @param {String} name
     * @param {String} identifier
     *
     * @return {Sy.Storage.Dbal.Rest} self
     */

    setStore: {
        value: function (alias, bundle, name, identifier) {
            this.stores[alias] = {
                bundle: bundle,
                name: name,
                key: identifier,
                path: this.urlPattern
                    .replace('{bundle}', bundle)
                    .replace('{name}', name)
                    .replace('{bundle|lower}', bundle.toLowerCase())
                    .replace('{name|lower}', name.toLowerCase())
            };

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    read: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.connection.get({
                    uri: store.path + id,
                    headers: this.headers,
                    listener: function (resp) {
                        if (resp.getStatusCode() === resp.HTTP_OK) {
                            resolve(resp.getBody());
                        } else {
                            reject(
                                resp.getStatusCode().toString() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    create: {
        value: function (storeName, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.connection.post({
                    uri: store.path,
                    headers: this.headers,
                    data: object,
                    listener: function (resp) {
                        if (resp.getStatusCode() === resp.HTTP_CREATED) {
                            resolve(resp.getBody()[store.key]);
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    update: {
        value: function (storeName, id, object) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.connection.put({
                    uri: store.path + id,
                    headers: this.headers,
                    data: object,
                    listener: function (resp) {
                        if (
                            resp.getStatusCode() === resp.HTTP_OK ||
                            resp.getStatusCode() === resp.HTTP_CREATED
                        ) {
                            resolve(resp.getBody());
                        } else if (resp.getStatusCode() === resp.HTTP_NO_CONTENT) {
                            resolve(object);
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (storeName, id) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.connection.remove({
                    uri: store.path + id,
                    headers: this.headers,
                    listener: function (resp) {
                        if (
                            resp.getStatusCode() === resp.HTTP_OK ||
                            resp.getStatusCode() === resp.HTTP_ACCEPTED ||
                            resp.getStatusCode() === resp.HTTP_NO_CONTENT
                        ) {
                            resolve()
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }
                });
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    find: {
        value: function (storeName, index, value, limit) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName],
                    path = store.path;

                path += '?' + index + '=' + (value instanceof Array ?
                    JSON.stringify(value) :
                    value);

                if (limit !== undefined) {
                    path += '&limit=' + limit;
                }

                this.connection.get({
                    uri: encodeURI(path),
                    headers: this.headers,
                    listener: function (resp) {
                        if (resp.getStatusCode() === resp.HTTP_OK) {
                            resolve(resp.getBody());
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
            }.bind(this));
        }
    },

    /**
     * @inheritDoc
     */

    findAll: {
        value: function (storeName) {
            return new Promise(function (resolve, reject) {
                if (!this.stores.hasOwnProperty(storeName)) {
                    reject(new ReferenceError('Unknown store "' + storeName + '"'));
                    return;
                }

                var store = this.stores[storeName];

                this.connection.get({
                    uri: store.path,
                    headers: this.headers,
                    listener: function (resp) {
                        if (resp.getStatusCode() === resp.HTTP_OK) {
                            resolve(resp.getBody());
                        } else {
                            reject(
                                resp.getStatusCode() + ' ' +
                                resp.getStatusText()
                            );
                        }
                    }.bind(this)
                });
            }.bind(this));
        }
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Rest driver factory
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverFactoryInterface}
 */

Sy.Storage.Dbal.RestFactory = function () {
    this.meta = [];
    this.rest = null;
};
Sy.Storage.Dbal.RestFactory.prototype = Object.create(Sy.Storage.Dbal.DriverFactoryInterface.prototype, {

    /**
     * Set all the defined entities
     *
     * @param {Array} meta
     *
     * @return {Sy.Storage.Dbal.RestFactory} self
     */

    setEntitiesMeta: {
        value: function (meta) {
            this.meta = meta;

            return this;
        }
    },

    /**
     * Set the REST engine
     *
     * @param {Sy.HTTP.REST} rest
     *
     * @return {Sy.Storage.Dbal.RestFactory} self
     */

    setREST: {
        value: function (rest) {
            if (!(rest instanceof Sy.HTTP.REST)) {
                throw new TypeError('Invalid rest engine');
            }

            this.rest = rest;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (dbname, version, stores, options) {
            var driver = new Sy.Storage.Dbal.Rest();

            driver
                .setURLPattern(options.pattern)
                .setVersion(version)
                .setConnection(this.rest);

            if (options.headers instanceof Array) {
                for (var id = 0, l = options.headers.length; i < l; i++) {
                    driver.setHeader(
                        options.headers[0],
                        options.headers[1]
                    );
                }
            }

            for (var i = 0, l = this.meta.length; i < l; i++) {
                if (stores.length === 0 || stores.indexOf(this.meta[i].alias) !== -1) {
                    driver.setStore(
                        this.meta[i].alias,
                        this.meta[i].bundle,
                        this.meta[i].name,
                        this.meta[i].uuid
                    );
                }
            }

            return driver;
        }
    }

});

namespace('Sy.Validator');

/**
 * Interface to declare required constraint methods
 *
 * @package Sy
 * @subpackage Validator
 * @interface
 */

Sy.Validator.ConstraintInterface = function (options) {};
Sy.Validator.ConstraintInterface.prototype = Object.create(Object.prototype, {

    /**
     * Check if the given validation group is set for the constraint
     *
     * @param {String} group
     *
     * @return {Boolean}
     */

    hasGroup: {
        value: function (group) {}
    },

    /**
     * Return the path to the constraint validator class
     *
     * @return {String}
     */

    validateBy: {
        value: function () {}
    }

});

namespace('Sy.Validator');

/**
 * Interface that eachconstraint validator must implement
 *
 * @package Sy
 * @subpackage Validator
 * @interface
 */

Sy.Validator.ConstraintValidatorInterface = function () {};
Sy.Validator.ConstraintValidatorInterface.prototype = Object.create(Object.prototype, {

    /**
     * Inject the current validation context
     *
     * @param {Sy.Validator.ExecutionContextInterface} context
     *
     * @return {Sy.Validator.ConstraintValidatorInterface} self
     */

    setContext: {
        value: function (context) {}
    },

    /**
     * Validate a value
     *
     * @param {mixed} value
     * @param {Sy.Validator.ConstraintInterface} constraint
     */

    validate: {
        value: function (value, constraint) {}
    }

});

namespace('Sy.Validator');

/**
 * Main validator, it's the interface to the outer world
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.Core = function () {
    this.rules = null;
    this.contextFactory = null;
    this.constraintFactory = null;
    this.useReflection = true;
};
Sy.Validator.Core.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry to hold defined rules
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Validator.Core} self
     */

    setRulesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.rules = registry;

            return this;
        }
    },

    /**
     * Set the context factory
     *
     * @param {Sy.Validator.ExecutionContextFactory} factory
     *
     * @return {Sy.Validator.Core} self
     */

    setContextFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Validator.ExecutionContextFactory)) {
                throw new TypeError('Invalid context factory');
            }

            this.contextFactory = factory;

            return this;
        }
    },

    /**
     * Set the constraint factory
     *
     * @param {Sy.Validator.ConstraintFactory} factory
     *
     * @return {Sy.Validator.Core} self
     */

    setConstraintFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Validator.ConstraintFactory)) {
                throw new TypeError('Invalid constraint factory');
            }

            this.constraintFactory = factory;

            return this;
        }
    },

    /**
     * Activate the use of reflection to get property
     * value out of an object when validating
     *
     * @return {Sy.Validator.Code} self
     */

    enableReflection: {
        value: function () {
            this.useReflection = true;

            return this;
        }
    },

    /**
     * Deactivate the use of reflection to get property
     * value out of an object when validating
     *
     * @return {Sy.Validator.Code} self
     */

    disableReflection: {
        value: function () {
            this.useReflection = false;

            return this;
        }
    },

    /**
     * Register new set of rules for objects
     *
     * @param {Object} data
     *
     * @return {Sy.Validator.Core} self
     */

    registerRules: {
        value: function (data) {

            for (var path in data) {
                if (data.hasOwnProperty(path)) {
                    this.registerRule(path, data[path]);
                }
            }

            return this;

        }
    },

    /**
     * Register rules for the specified class path
     *
     * @param {String} path Class path
     * @param {Object} data
     *
     * @return {Sy.Validator.Core} self
     */

    registerRule: {
        value: function (path, data) {
            if (this.rules.has(path)) {
                throw new ReferenceError('Rules are already defined for the path "' + path + '"');
            }

            if (data.getters === undefined) {
                data.getters = {};
            }

            if (data.properties === undefined) {
                data.properties = {};
            }

            this.rules.set(path, data);

            return this;
        }
    },

    /**
     * Validate a value against a (or a set of) constraint(s)
     *
     * @param {mixed} value
     * @param {mixed} constraints Must be a constraint or array of constraints
     * @param {String|Array} groups Optional, must be string or array of strings
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    validateValue: {
        value: function (value, constraints, groups) {

            groups = groups || [];

            if (!(constraints instanceof Array)) {
                constraints = [constraints];
            }

            if (!(groups instanceof Array)) {
                groups = [groups];
            }

            var context = this.contextFactory.make();

            for (var i = 0, l = constraints.length; i < l; i++) {
                context.validate(value, constraints[i], groups);
            }

            return context.getViolations();

        }
    },

    /**
     * Validate an object, it must have been declared first
     *
     * @param {Object} object
     * @param {String|Array} groups Optional
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    validate: {
        value: function (object, groups) {

            var rules = this.resolve(object),
                context = this.contextFactory.make(),
                constraint,
                value,
                refl,
                propGetter;

            groups = groups || [];

            if (!(groups instanceof Array)) {
                groups = [groups];
            }

            context.setObject(object);

            for (var getter in rules.getters) {
                if (rules.getters.hasOwnProperty(getter)) {
                    context.setPath(getter);

                    for (constraint in rules.getters[getter]){
                        if (rules.getters[getter].hasOwnProperty(constraint)) {
                            context.validate(
                                object[getter](),
                                this.constraintFactory.make(
                                    constraint,
                                    rules.getters[getter][constraint]
                                ),
                                groups
                            );
                        }
                    }
                }
            }

            for (var property in rules.properties) {
                if (rules.properties.hasOwnProperty(property)) {
                    context.setPath(property);

                    if (this.useReflection) {
                        refl = new ReflectionObject(object);
                        propGetter = 'get' + property.charAt(0).toUpperCase() + property.substr(1);

                        if (refl.hasMethod(propGetter)) {
                            value = refl.getMethod(propGetter).call()
                        } else if (refl.hasMethod('get')) {
                            value = refl.getMethod('get').call(property);
                        } else {
                            value = refl.getProperty(property).getValue();
                        }
                    } else {
                        value = object[property];
                    }

                    for (constraint in rules.properties[property]) {
                        if (rules.properties[property].hasOwnProperty(constraint)) {
                            context.validate(
                                value,
                                this.constraintFactory.make(
                                    constraint,
                                    rules.properties[property][constraint]
                                ),
                                groups
                            );
                        }
                    }
                }
            }

            return context.getViolations();

        }
    },

    /**
     * Look for the rules for the given object
     *
     * @private
     * @param {Object} object
     *
     * @return {Object} Set of rules
     */

    resolve: {
        value: function (object) {
            var mapping = this.rules.getMapping(),
                constructor;

            for (var path in mapping) {
                if (mapping.hasOwnProperty(path)) {
                    constructor = objectGetter(path);

                    if (!!constructor && object instanceof constructor) {
                        return mapping[path];
                    }
                }
            }

            throw new ReferenceError('No rules defined for the specified object');
        }
    }

});

namespace('Sy.Validator');

/**
 * Basic constraint that implement the `hasGroup` interface method
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.Validator.ConstraintInterface}
 */

Sy.Validator.AbstractConstraint = function (options) {
    Sy.Validator.ConstraintInterface.call(this, options);

    this.groups = options.groups instanceof Array ? options.groups : [];
};
Sy.Validator.AbstractConstraint.prototype = Object.create(Sy.Validator.ConstraintInterface.prototype, {

    /**
     * @inheritDoc
     */

    hasGroup: {
        value: function (group) {
            return this.groups instanceof Array && this.groups.indexOf(group) !== -1;
        }
    }

})

namespace('Sy.Validator');

/**
 * Abstract constraint validator that implements context setter
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.Validator.ConstraintValidatorInterface}
 */

Sy.Validator.AbstractConstraintValidator = function () {
    this.context = null;
};
Sy.Validator.AbstractConstraintValidator.prototype = Object.create(Sy.Validator.ConstraintValidatorInterface.prototype, {

    /**
     * @inheritDoc
     */

    setContext: {
        value: function (context) {
            this.context = context;

            return this;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Constraint to check if a value is an empty string or is null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Blank = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'This value must be blank';
};
Sy.Validator.Constraint.Blank.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.BlankValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Blank constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.BlankValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.BlankValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Blank)) {
                throw new TypeError('Invalid constraint');
            }

            if (
                (typeof value === 'string' && value.length !== 0) &&
                value !== null
            ) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Use a function to validate a value
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Callback = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    if (options.callback === undefined) {
        throw new ReferenceError('Undefined constraint callback');
    }

    this.callback = options.callback;
};
Sy.Validator.Constraint.Callback.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.CallbackValidator';
        }
    },

    /**
     * Return the callback
     *
     * @return {String}
     */

    getCallback: {
        value: function () {
            return this.callback;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Callback constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.CallbackValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.CallbackValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Callback)) {
                throw new TypeError('Invalid constraint');
            }

            var callback = constraint.getCallback();

            this.context.getObject()[callback](this.context);

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is one of the defined choices
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Choice = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.choices = options.choices || [];
    this.multiple = !!options.multiple;
    this.min = parseInt(options.min, 10);
    this.max = parseInt(options.max, 10);
    this.message = options.message || 'The value you selected is not a valid choice';
    this.multipleMessage = options.multipleMessage || 'One or more of the given values is invalid';
    this.minMessage = options.minMessage || 'You must select more choices';
    this.maxMessage = options.maxMessage || 'You have selected too many choices';
    this.callback = options.callback;
};
Sy.Validator.Constraint.Choice.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.ChoiceValidator';
        }
    },

    /**
     * Return the choices array
     *
     * @return {Array}
     */

    getChoices: {
        value: function () {
            return this.choices;
        }
    },

    /**
     * Check if the constraint has a function defined to get choices
     *
     * @return {Boolean}
     */

    hasCallback: {
        value: function () {
            return !!this.callback;
        }
    },

    /**
     * Return the callback to get choices
     *
     * @return {String}
     */

    getCallback: {
        value: function () {
            return this.callback;
        }
    },

    /**
     * Check if the value can contain numerous choices
     *
     * @return {Boolean}
     */

    isMultiple: {
        value: function () {
            return this.multiple;
        }
    },

    /**
     * Check if the constraint has a minimum of choices
     *
     * @return {Boolean}
     */

    hasMin: {
        value: function () {
            return !isNaN(this.min);
        }
    },

    /**
     * Return the minimum count of choices required
     *
     * @return {Integer}
     */

    getMin: {
        value: function () {
            return this.min;
        }
    },

    /**
     * Check if the constraint has a maximum of choices
     *
     * @return {Boolean}
     */

    hasMax: {
        value: function () {
            return !isNaN(this.max);
        }
    },

    /**
     * Return the maximum count of choices required
     *
     * @return {Integer}
     */

    getMax: {
        value: function () {
            return this.max;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    },

    /**
     * Return the error message if multiple choices allowed
     *
     * @return {String}
     */

    getMultipleMessage: {
        value: function () {
            return this.multipleMessage;
        }
    },

    /**
     * Return the error message if too few choices
     *
     * @return {String}
     */

    getMinMessage: {
        value: function () {
            return this.minMessage;
        }
    },

    /**
     * Return the error message if too many choices
     *
     * @return {String}
     */

    getMaxMessage: {
        value: function () {
            return this.maxMessage;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Choice constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.ChoiceValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.ChoiceValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Choice)) {
                throw new TypeError('Invalid constraint');
            }

            if (constraint.isMultiple() && !(value instanceof Array)) {
                throw new TypeError('Array expected');
            }

            var choices;

            if (constraint.hasCallback()) {
                var callback = constraint.getCallback();

                choices = this.context.getObject()[callback]();
            } else {
                choices = constraint.getChoices();
            }

            if (constraint.isMultiple()) {
                for (var i = 0, l = value.length; i < l; i++) {
                    if (choices.indexOf(value[i]) === -1) {
                        this.context.addViolation(constraint.getMultipleMessage());
                    }
                }

                if (constraint.hasMin() && value.length < constraint.getMin()) {
                    this.context.addViolation(constraint.getMinMessage());
                }

                if (constraint.hasMax() && value.length > constraint.getMax()) {
                    this.context.addViolation(constraint.getMaxMessage());
                }
            } else if (choices.indexOf(value) === -1) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check a value is a country code
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Country = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'This value is not a valid country';
};
Sy.Validator.Constraint.Country.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.CountryValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

})

namespace('Sy.Validator.Constraint');

/**
 * Country constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.CountryValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.CountryValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Country)) {
                throw new TypeError('Invalid constraint');
            }

            if (Intl.Collator.supportedLocalesOf(value).length === 0) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is a valid date
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Date = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value is not a valid date';
};
Sy.Validator.Constraint.Date.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.DateValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Date constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.DateValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.DateValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Date)) {
                throw new TypeError('Invalid constraint');
            }

            if (['', null, undefined].indexOf(value) !== -1) {
                return;
            }

            if (typeof value === 'string') {
                if ((new Date(value)).toDateString() === 'Invalid Date') {
                    this.context.addViolation(constraint.getMessage());
                }
            } else if (!(value instanceof Date)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check the value is an email
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Email = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value is not a valid email';
};
Sy.Validator.Constraint.Email.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.EmailValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Email constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.EmailValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.EmailValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Email)) {
                throw new TypeError('Invalid constraint');
            }

            if (['', null, undefined].indexOf(value) !== -1) {
                return;
            }

            var regex = new RegExp(/^[a-z\.\-\_]+@[a-z\.\-\_]+\.[a-z]{2,}$/i);

            if (!regex.test(value)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the validated value is equal to the given value
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.EqualTo = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value should be equal to ' + options.value;
};
Sy.Validator.Constraint.EqualTo.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.EqualToValidator';
        }
    },

    /**
     * Return the wished value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * EqualTo constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.EqualToValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.EqualToValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.EqualTo)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is false
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.False = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must be false';
};
Sy.Validator.Constraint.False.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.FalseValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * False constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.FalseValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.FalseValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.False)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== false) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is greater than the given one
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.GreaterThan = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must be greater than "' + options.value + '"';
};
Sy.Validator.Constraint.GreaterThan.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.GreaterThanValidator';
        }
    },

    /**
     * Return the reference value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * GreaterThan constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.GreaterThanValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.GreaterThanValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.GreaterThan)) {
                throw new TypeError('Invalid constraint');
            }

            if (value <= constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is greater than or equal to the given one
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.GreaterThanOrEqual = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must be greater than or equal to "' + options.value + '"';
};
Sy.Validator.Constraint.GreaterThanOrEqual.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.GreaterThanOrEqualValidator';
        }
    },

    /**
     * Return the reference value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * GreaterThanOrEqual constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.GreaterThanOrEqualValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.GreaterThanOrEqualValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.GreaterThanOrEqual)) {
                throw new TypeError('Invalid constraint');
            }

            if (value < constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is an IP address
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Ip = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.port = !!options.port;
    this.mask = !!options.mask;
    this.message = options.message || 'The value is not a valid IP address';
};
Sy.Validator.Constraint.Ip.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.IpValidator';
        }
    },

    /**
     * Does it must have a port specified
     *
     * @return {Boolean}
     */

    hasPort: {
        value: function () {
            return this.port;
        }
    },

    /**
     * Does it must have a wildcard mask
     *
     * @return {Boolean}
     */

    hasMask: {
        value: function () {
            return this.mask;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Ip constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.IpValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.IpValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Ip)) {
                throw new TypeError('Invalid constraint');
            }

            var portRegex = ':[0-9]{1,6}',
                maskRegex = '\\/(?:[12][0-9]|3[0-2]|[0-9])',
                regex = '^(?:[01]?[0-9]?[0-9]\.|2[0-4][0-9]\.|25[0-5]\.){3}(?:[01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]){1}';

            if (constraint.hasPort()) {
                regex += portRegex;
            }

            if (constraint.hasMask()) {
                regex += maskRegex;
            }

            regex = new RegExp(regex + '$');

            if (!regex.test(value)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value has a length between the specified min and max
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Length = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.min = options.min;
    this.max = options.max;
    this.minMessage = options.minMessage || 'The value is too short';
    this.maxMessage = options.maxMessage || 'The value is too long';
    this.exactMessage = options.exactMessage || 'The value must be ' + this.min + ' long';
};
Sy.Validator.Constraint.Length.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.LengthValidator';
        }
    },

    /**
     * Get the minimum length
     *
     * @return {Integer}
     */

    getMin: {
        value: function () {
            return this.min;
        }
    },

    /**
     * Return the maximum length
     *
     * @return {Integer}
     */

    getMax: {
        value: function () {
            return this.max;
        }
    },

    /**
     * Return the error message if value too short
     *
     * @return {String}
     */

    getMinMessage: {
        value: function () {
            return this.minMessage;
        }
    },

    /**
     * Return the error message if value too long
     *
     * @return {String}
     */

    getMaxMessage: {
        value: function () {
            return this.maxMessage;
        }
    },

    /**
     * Return the error message in case min is equal to max, and the value differs from it
     *
     * @return {String}
     */

    getExactMessage: {
        value: function () {
            return this.exactMessage;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Length constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.LengthValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.LengthValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Length)) {
                throw new TypeError('Invalid constraint');
            }

            if (['', null, undefined].indexOf(value) !== -1) {
                return;
            }

            if (value.length === undefined) {
                throw new TypeError('The value has no length attribute');
            }

            if (
                constraint.getMin() === constraint.getMax() &&
                value.length !== constraint.getMin()
            ) {
                this.context.addViolation(constraint.getExactMessage());
            } else {

                if (value.length < constraint.getMin()) {
                    this.context.addViolation(constraint.getMinMessage());
                }

                if (value.length > constraint.getMax()) {
                    this.context.addViolation(constraint.getMaxMessage());
                }

            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is less than the given one
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.LessThan = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must be less than "' + options.value + '"';
};
Sy.Validator.Constraint.LessThan.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.LessThanValidator';
        }
    },

    /**
     * Return the reference value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * LessThan constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.LessThanValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.LessThanValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.LessThan)) {
                throw new TypeError('Invalid constraint');
            }

            if (value >= constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is less than or equal to the given one
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.LessThanOrEqual = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must be less than or equal to "' + options.value + '"';
};
Sy.Validator.Constraint.LessThanOrEqual.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.LessThanOrEqualValidator';
        }
    },

    /**
     * Return the reference value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * LessThanOrEqual constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.LessThanOrEqualValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.LessThanOrEqualValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.LessThanOrEqual)) {
                throw new TypeError('Invalid constraint');
            }

            if (value > constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Constraint to check if a value is not an empty string nor is null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.NotBlank = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'This value must not be blank';
};
Sy.Validator.Constraint.NotBlank.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NotBlankValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * NotBlank constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotBlankValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotBlankValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotBlank)) {
                throw new TypeError('Invalid constraint');
            }

            if (
                (typeof value === 'string' && value.length === 0) ||
                value === null
            ) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the validated value is equal to the given value
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.NotEqualTo = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must not be equal to ' + options.value;
};
Sy.Validator.Constraint.NotEqualTo.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NotEqualToValidator';
        }
    },

    /**
     * Return the wished value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * NotEqualTo constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotEqualToValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotEqualToValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotEqualTo)) {
                throw new TypeError('Invalid constraint');
            }

            if (value === constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is not null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.NotNull = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must not be null';
};
Sy.Validator.Constraint.NotNull.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NotNullValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * NotNull constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotNullValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotNullValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotNull)) {
                throw new TypeError('Invalid constraint');
            }

            if (value === null) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is not undefined
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.NotUndefined = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must not be undefined';
};
Sy.Validator.Constraint.NotUndefined.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NotUndefinedValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * NotUndefined constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotUndefinedValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotUndefinedValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotUndefined)) {
                throw new TypeError('Invalid constraint');
            }

            if (value === undefined) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Null = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must be null';
};
Sy.Validator.Constraint.Null.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NullValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Null constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NullValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NullValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Null)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== null) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is in the defined range
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Range = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.min = options.min;
    this.max = options.max;
    this.minMessage = options.minMessage || 'The value is below the lower bound';
    this.maxMessage = options.maxMessage || 'The value is above the upper bound';
};
Sy.Validator.Constraint.Range.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.RangeValidator';
        }
    },

    /**
     * Return the lower bound
     *
     * @return {Integer}
     */

    getMin: {
        value: function () {
            return this.min;
        }
    },

    /**
     * Return the upper bound
     *
     * @return {Integer}
     */

    getMax: {
        value: function () {
            return this.max;
        }
    },

    /**
     * Return the lower bound error message
     *
     * @return {String}
     */

    getMinMessage: {
        value: function () {
            return this.minMessage;
        }
    },

    /**
     * Return the upper bound error message
     *
     * @return {String}
     */

    getMaxMessage: {
        value: function () {
            return this.maxMessage;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Range constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.RangeValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.RangeValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Range)) {
                throw new TypeError('Invalid constraint');
            }

            if (typeof value !== 'number' || isNaN(value)) {
                throw new TypeError('The value is not a numer');
            }

            if (value < constraint.getMin()) {
                this.context.addViolation(constraint.getMinMessage());
            }

            if (value > constraint.getMax()) {
                this.context.addViolation(constraint.getMaxMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value match the given pattern
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Regex = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.pattern = options.pattern;
    this.flags = options.flags;
    this.message = options.message || 'The value do not match the wished pattern';
};
Sy.Validator.Constraint.Regex.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.RegexValidator';
        }
    },

    /**
     * Return the regular expression pattern
     *
     * @return {String}
     */

    getPattern: {
        value: function () {
            return this.pattern;
        }
    },

    /**
     * Return the regular expression flags
     *
     * @return {String}
     */

    getFlags: {
        value: function () {
            return this.flags;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Regex constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.RegexValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.RegexValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Regex)) {
                throw new TypeError('Invalid constraint');
            }

            try {
                var regex = new RegExp(constraint.getPattern(), constraint.getFlags())

                if (!regex.test(value)) {
                    this.context.addViolation(constraint.getMessage());
                }
            } catch (e) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is true
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.True = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must be true';
};
Sy.Validator.Constraint.True.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.TrueValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * True constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.TrueValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.TrueValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.True)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== true) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is of the specified type
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Type = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.type = options.type;
    this.message = options.message || 'The value differs from the specified type';
};
Sy.Validator.Constraint.Type.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.TypeValidator';
        }
    },

    /**
     * Return the wished type
     *
     * @return {mixed}
     */

    getType: {
        value: function () {
            return this.type;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Type constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.TypeValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.TypeValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Type)) {
                throw new TypeError('Invalid constraint');
            }

            var expected = constraint.getType(),
                constructor = objectGetter(expected) || function () {};

            if (
                typeof value !== expected &&
                !(value instanceof constructor)
            ) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is undefined
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Undefined = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must be undefined';
};
Sy.Validator.Constraint.Undefined.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.UndefinedValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Undefined constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.UndefinedValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.UndefinedValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Undefined)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== undefined) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is a valid url
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Url = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.protocols = options.protocols instanceof Array ? options.protocols : ['http', 'https'];
    this.message = options.message || 'The value is not a valid url';
};
Sy.Validator.Constraint.Url.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.UrlValidator';
        }
    },

    /**
     * Return the protocols
     *
     * @return {Array}
     */

    getProtocols: {
        value: function () {
            return this.protocols;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Url constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.UrlValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.UrlValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Url)) {
                throw new TypeError('Invalid constraint');
            }

            if (['', null, undefined].indexOf(value) !== -1) {
                return;
            }

            var protocols = constraint.getProtocols().join('|'),
                regex = new RegExp('^(' + protocols + ')://[a-z\-\_\.]+(?:\.[a-z]{2,})?.*$', 'i');

            if (!regex.test(value)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator');

/**
 * Build an instance of the specified constraint
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Validator.ConstraintFactory = function () {};
Sy.Validator.ConstraintFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, options) {

            var constructor = Sy.Validator.Constraint[name],
                constraint;

            if (constructor === undefined) {
                throw new ReferenceError('The constraint "' + name + '" is undefined');
            }

            constraint = new constructor(options);

            if (!(constraint instanceof Sy.Validator.ConstraintInterface)) {
                throw new TypeError('"' + name + '" is not a valid constraint');
            }

            return constraint;

        }
    }

});

namespace('Sy.Validator');

/**
 * Build the validator object of a constraint
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Validator.ConstraintValidatorFactory = function () {
    this.validators = {};
};
Sy.Validator.ConstraintValidatorFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function (constraint) {

            if (!(constraint instanceof Sy.Validator.ConstraintInterface)) {
                throw new TypeError('Invalid constraint');
            }

            var path = constraint.validatedBy(),
                constructor;

            if (this.validators[path] === undefined) {
                constructor = objectGetter(path);

                if (constructor === undefined) {
                    throw new ReferenceError('Undefined validator "' + path + '"');
                }

                this.validators[path] = new constructor();
            }

            return this.validators[path];

        }
    }

});
namespace('Sy.Validator');

/**
 * Holds message and path of a constraint violation
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.ConstraintViolation = function (data) {
    this.message = data.message;
    this.path = data.path;
};
Sy.Validator.ConstraintViolation.prototype = Object.create(Object.prototype, {

    /**
     * Return the violation message
     *
     * @return {String}
     */

    toString: {
        value: function () {
            return this.message;
        }
    },

    /**
     * Return the violation path
     *
     * @return {String}
     */

    getPath: {
        value: function () {
            return this.path;
        }
    },

    /**
     * Return raw object containing message + path
     *
     * @return {Object}
     */

    toJSON: {
        value: function () {
            return {
                message: this.message,
                path: this.path
            }
        }
    }

});

namespace('Sy.Validator');

/**
 * Holds a set of contraint violations messages
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.ConstraintViolationList = function () {
    this.violations = [];
    this.length = 0;
};
Sy.Validator.ConstraintViolationList.prototype = Object.create(Object.prototype, {

    /**
     * Add a new violation
     *
     * @param {String} message
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    addViolation: {
        value: function (message) {
            this.violations.push(new Sy.Validator.ConstraintViolation({
                message: message
            }));
            this.length++;

            return this;
        }
    },

    /**
     * Add a new violation for the specified path
     *
     * @param {String} message
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    addViolationAt: {
        value: function (path, message) {
            this.violations.push(new Sy.Validator.ConstraintViolation({
                message: message,
                path: path
            }));
            this.length++;

            return this;
        }
    },

    /**
     * Apply a callback on each violations
     *
     * @param {Function} callback
     *
     * @return {Sy.Validator.ConstraintViolationList} self
     */

    forEach: {
        value: function (callback) {
            this.violations.forEach(callback);

            return this;
        }
    },

    /**
     * Return all the violations
     *
     * @return {Array}
     */

    getViolations: {
        value: function () {
            return this.violations;
        }
    },

    /**
     * Return the violations for the specified type
     *
     * @return {Array}
     */

    getViolationsAt: {
        value: function (path) {
            return this.violations.filter(function (violation) {
                return violation.getPath() === path;
            }.bind(this));
        }
    },

    /**
     * Return an array of raw representation of each violation
     *
     * @return {Array}
     */

    toJSON: {
        value: function () {
            return this.violations.map(function (element) {
                return element.toJSON();
            });
        }
    }

});

namespace('Sy.Validator');

/**
 * Execute the validation of values against constraints
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.ExecutionContext = function () {
    this.constraintValidatorFactory = null;
    this.violations = null;
    this.path = null;
    this.object = null;
};
Sy.Validator.ExecutionContext.prototype = Object.create(Object.prototype, {

    /**
     * Set the constraint validator factory
     *
     * @param {Sy.Validator.ConstraintValidatorFactory} factory
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    setConstraintValidatorFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Validator.ConstraintValidatorFactory)) {
                throw new TypeError('Invalid constraint validator factory');
            }

            this.constraintValidatorFactory = factory;

            return this;
        }
    },

    /**
     * Set the constraint violations list
     *
     * @param {Sy.Validator.ConstraintViolationList} violations
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    setViolationList: {
        value: function (violations) {
            if (!(violations instanceof Sy.Validator.ConstraintViolationList)) {
                throw new TypeError('Invalid constraint violation list');
            }

            this.violations = violations;

            return this;
        }
    },

    /**
     * Return the violation list
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    getViolations: {
        value: function () {
            return this.violations;
        }
    },

    /**
     * Set the path in the object being validated
     *
     * @param {String} path
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    setPath: {
        value: function (path) {
            this.path = path;

            return this;
        }
    },

    /**
     * Set the object being validated
     *
     * @param {Object} object
     *
     * @return {Sy.Validator.ExecutionContext}
     */

    setObject: {
        value: function (object) {
            this.object = object;

            return this;
        }
    },

    /**
     * Return the object being validated
     *
     * @return {Object}
     */

    getObject: {
        value: function () {
            return this.object;
        }
    },

    /**
     * Add a new violation
     *
     * @param {String} message
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    addViolation: {
        value: function (message) {
            if (this.path) {
                this.violations.addViolationAt(this.path, message);
            } else {
                this.violations.addViolation(message);
            }
        }
    },

    /**
     * Add a new violation for the specified path
     *
     * @param {String} path
     * @param {String} message
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    addViolationAt: {
        value: function (path, message) {
            this.violations.addViolationAt(path, message);
        }
    },

    /**
     * Validate the value against the constraint
     *
     * @param {mixed} value
     * @param {Sy.Validator.ConstraintInterface} constraint
     * @param {Array} groups
     *
     * @return {void}
     */

    validate: {
        value: function (value, constraint, groups) {

            var validator = this.constraintValidatorFactory.make(constraint);

            if (groups instanceof Array && groups.length > 0) {
                for (var i = 0, l = groups.length; i < l; i++) {
                    if (constraint.hasGroup(groups[i])) {
                        validator
                            .setContext(this)
                            .validate(value, constraint);
                        break;
                    }
                }
            } else {
                validator
                    .setContext(this)
                    .validate(value, constraint);
            }

        }
    }

});

namespace('Sy.Validator');

/**
 * Generates new validation execution contexts
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Validator.ExecutionContextFactory = function () {
    this.constraintValidatorFactory = null;
};
Sy.Validator.ExecutionContextFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the constraint validator factory
     *
     * @param {Sy.Validator.ConstraintValidatorFactory} factory
     *
     * @return {Sy.Validator.ExecutionContextFactory} self
     */

    setConstraintValidatorFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Validator.ConstraintValidatorFactory)) {
                throw new TypeError('Invalid constraint validator factory');
            }

            this.constraintValidatorFactory = factory;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function () {
            var context = new Sy.Validator.ExecutionContext();

            return context
                .setConstraintValidatorFactory(this.constraintValidatorFactory)
                .setViolationList(new Sy.Validator.ConstraintViolationList());
        }
    }

});

namespace('Sy.Form');

/**
 * Representation of a form wrapper
 *
 * @package Sy
 * @subpackage Form
 * @interface
 */

Sy.Form.FormInterface = function () {};
Sy.Form.FormInterface.prototype = Object.create(Object.prototype, {

    /**
     * Add a new element to the form
     *
     * @param {String} name Name of the element in the dom, must be identical to the attribute of data class
     *
     * @return {Sy.Form.FormInterface} self
     */

    add: {
        value: function (name) {}
    },

    /**
     * Set the name of the form, will be used as the id
     * to look for form element in the dom
     *
     * @param {String} name
     *
     * @return {Sy.Form.FormInterface} self
     */

    setName: {
        value: function (name) {}
    },

    /**
     * Return the form name
     *
     * @return {String}
     */

    getName: {
        value: function () {}
    },

    /**
     * Set the options config object
     *
     * @param {Sy.ConfiguratorInterface} config
     *
     * @return {Sy.Form.FormInterface} self
     */

    setOptions: {
        value: function (config) {}
    },

    /**
     * Check if the form data is valid by injecting data
     * to the object and then passing it to the validator
     *
     * If no validator set, it will use the html `checkValidity`
     *
     * @return {Boolean}
     */

    isValid: {
        value: function () {}
    },

    /**
     * Set the object that will hold form data
     *
     * @param {Object} object
     *
     * @return {Sy.Form.FormInterface}
     */

    setObject: {
        value: function (object) {}
    },

    /**
     * Return an instance of the data class
     *
     * @return {Object}
     */

    getObject: {
        value: function () {}
    },

    /**
     * Extract the data off of the form element
     * If no element specified it will check if
     * one has been defined previously
     *
     * @param {HTMLFormElement} form Optional
     *
     * @return {Sy.Form.FormInterface} self
     */

    handle: {
        value: function (form) {}
    },

    /**
     * Inject the validator
     *
     * @param {Sy.Validator.Core} validator
     *
     * @return {Sy.Form.FormInterface} self
     */

    setValidator: {
        value: function (validator) {}
    }

});

namespace('Sy.Form');

/**
 * Class use to build instances of classes implementing `Sy.Form.FormInterface`
 *
 * @package Sy
 * @subpackage Form
 * @interface
 */

Sy.Form.FormBuilderInterface = function () {};
Sy.Form.FormBuilderInterface.prototype = Object.create(Object.prototype, {

    /**
     * Add a new element to the form
     *
     * @param {String} name
     *
     * @return {Sy.Form.FormBuilderInterface} self
     */

    add: {
        value: function (name) {}
    },

    /**
     * Set the user defined options to the form
     *
     * @param {Sy.ConfiguratorInterface} config
     *
     * @return {Sy.Form.FormBuilderInterface} self
     */

    setOptions: {
        value: function (config) {}
    },

    /**
     * Set the form name
     *
     * @param {String} name
     *
     * @return {Sy.Form.FormBuilderInterface} self
     */

    setName: {
        value: function (name) {}
    },

    /**
     * Set the object that will hold data to the form
     *
     * @param {Object} object
     *
     * @return {Sy.Form.FormBuilderInterface}
     */

    setObject: {
        value: function (object) {}
    },

    /**
     * Return the form
     *
     * @return {Sy.Form.FormInterface}
     */

    getForm: {
        value: function () {}
    }

});

namespace('Sy.Form');

/**
 * Representation of a form
 *
 * @package Sy
 * @subpackage Form
 * @interface
 */

Sy.Form.FormTypeInterface = function () {};
Sy.Form.FormTypeInterface.prototype = Object.create(Object.prototype, {

    /**
     * Pass the form builder to define the form elements
     *
     * @param {Sy.Form.FormBuilderInterface} builder
     * @param {Sy.ConfiguratorInterface} options
     *
     * @return {void}
     */

    buildForm: {
        value: function (builder, options) {}
    },

    /**
     * Set the default options for the form,
     * like the data class or the validation groups
     *
     * @param {Sy.ConfiguratorInterface} config
     */

    setDefaultOptions: {
        value: function (config) {}
    },

    /**
     * Set the form name
     *
     * @return {String}
     */

    getName: {
        value: function () {}
    }

});

namespace('Sy.Form');

/**
 * Default implementation of `FormInterface`
 *
 * @package Sy
 * @subpackage Form
 * @class
 * @implements {Sy.Form.FormInterface}
 */

Sy.Form.Form = function () {
    this.elements = [];
    this.name = null;
    this.config = null;
    this.validator = null;
    this.form = null;
    this.object = null;
};
Sy.Form.Form.prototype = Object.create(Sy.Form.FormInterface.prototype, {

    /**
     * @inheritDoc
     */

    add: {
        value: function (name) {
            this.elements.push(name);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setName: {
        value: function (name) {
            this.name = name;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * @inheritDoc
     */

    setOptions: {
        value: function (config) {
            if (!(config instanceof Sy.ConfiguratorInterface)) {
                throw new TypeError('Invalid configurator');
            }

            this.config = config;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    isValid: {
        value: function () {

            if (this.validator) {
                return !this.validator.validate(
                    this.object,
                    this.config.get('validationGroups')
                ).length;
            } else if (this.form) {
                for (var i = 0, l = this.elements.length; i < l; i++) {
                    if (!this.form.hasOwnProperty(this.elements[i])) {
                        return false;
                    } else if (this.form[this.elements[i]].checkValidity() === false) {
                        return false;
                    }
                }

                return true;
            }

            return true;

        }
    },

    /**
     * @inheritDoc
     */

    setObject: {
        value: function (object) {
            this.object = object;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    getObject: {
        value: function () {
            return this.object;
        }
    },

    /**
     * @inheritDoc
     */

    handle: {
        value: function (form) {
            if (form) {
                this.form = form;
            } else if (!this.form && this.getName()) {
                this.form = document.querySelector('form[id=' + this.getName() + ']');
            }

            if (!this.form && !(this.form instanceof HTMLFormElement)) {
                throw new ReferenceError('Form element not found');
            }

            if (!this.object) {
                return;
            }

            var refl = new ReflectionObject(this.object),
                els = this.elements,
                setter,
                value;

            for (var i = 0, l = els.length; i < l; i++) {
                if (this.form.elements[els[i]] !== undefined) {
                    setter = 'set' + els[i].charAt(0).toUpperCase() + els[i].substr(1);
                    value = this.form.elements[els[i]].value;

                    if (refl.hasMethod(setter)) {
                        refl.getMethod(setter).call(value);
                    } else if (refl.hasMethod('set')) {
                        refl.getMethod('set').call(els[i], value);
                    } else {
                        this.object[els[i]] = value;
                    }
                }
            }

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setValidator: {
        value: function (validator) {
            if (!(validator instanceof Sy.Validator.Core)) {
                throw new TypeError('Invalid validator');
            }

            this.validator = validator;

            return this;
        }
    }

});

namespace('Sy.Form');

/**
 * Default implementation of `FormBuilderInterface`
 *
 * @package Sy
 * @subpackage Form
 * @class
 * @implements {Sy.Form.FormBuilderInterface}
 */

Sy.Form.FormBuilder = function () {
    this.form = new Sy.Form.Form();
};
Sy.Form.FormBuilder.prototype = Object.create(Sy.Form.FormBuilderInterface.prototype, {

    /**
     * @inheritDoc
     */

    add: {
        value: function (name) {
            this.form.add(name);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setOptions: {
        value: function (config) {
            this.form.setOptions(config);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setName: {
        value: function (name) {
            this.form.setName(name);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setObject: {
        value: function (object) {
            this.form.setObject(object);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    getForm: {
        value: function () {
            return this.form;
        }
    },

    /**
     * Set the validator to the form
     *
     * @param {Sy.Validator.Core} validator
     *
     * @return {Sy.Form.FormBuilder}
     */

    setValidator: {
        value: function (validator) {
            this.form.setValidator(validator);

            return this;
        }
    }

});

namespace('Sy.Form');

/**
 * Entry point to build form instances for the developer
 *
 * @package Sy
 * @subpackage Form
 * @class
 */

Sy.Form.Builder = function () {
    this.validator = null;
    this.types = {};
};
Sy.Form.Builder.prototype = Object.create(Object.prototype, {

    /**
     * Set the validator
     *
     * @param {Sy.Validator.core} validator
     *
     * @return {Sy.Form.Builder} self
     */

    setValidator: {
        value: function (validator) {
            if (!(validator instanceof Sy.Validator.Core)) {
                throw new TypeError('Invalid validator');
            }

            this.validator = validator;

            return this;
        }
    },

    /**
     * Create a form builder based on the object passed
     *
     * @param {Object} data
     * @param {Object} options
     *
     * @return {Sy.Form.FormBuilderInterface}
     */

    createFormBuilder: {
        value: function (data, options) {
            var builder = new Sy.Form.FormBuilder(),
                config = new Sy.Configurator();

            if (options) {
                config.set(options);
            }

            builder
                .setOptions(config)
                .setObject(data);

            if (this.validator) {
                builder.setValidator(this.validator);
            }

            return builder;
        }
    },

    /**
     * Register a new form type
     *
     * @param {Sy.Form.FormTypeInterface} formType
     *
     * @return {Sy.Form.Builder} self
     */

    registerFormType: {
        value: function (formType) {
            if (!(formType instanceof Sy.Form.FormTypeInterface)) {
                throw new TypeError('Invalid form type');
            }

            this.types[formType.getName()] = formType;

            return this;
        }
    },

    /**
     * Create a form based on the form type
     *
     * @param {Sy.Form.FormTypeInterface|String} formType
     * @param {Object} object Optional, object that will hold form data
     * @param {Object} options
     *
     * @return {Sy.Form.FormInterface}
     */

    createForm: {
        value: function (formType, object, options) {
            if (typeof formType === 'string') {
                if (!this.types[formType]) {
                    throw new ReferenceError('Form type "' + formType + '" is undefined');
                }

                formType = this.types[formType];
            }

            var builder = new Sy.Form.FormBuilder(),
                config = new Sy.Configurator(),
                dataClass;

            builder.setName(formType.getName());
            formType.setDefaultOptions(config);

            if (options) {
                for (var prop in options) {
                    if (options.hasOwnProperty(prop)) {
                        config.set(prop, options[prop]);
                    }
                }
            }

            formType.buildForm(builder, config);

            builder.setOptions(config);

            if (!object && config.has('dataClass')) {
                dataClass = objectGetter(config.get('dataClass'));

                if (!dataClass) {
                    throw new ReferenceError('Data class "' + config.get('dataClass') + '" is undefined');
                }

                builder.setObject(new dataClass());
            } else if (object && typeof object === 'object') {
                if (
                    config.has('dataClass') &&
                    !(object instanceof objectGetter(config.get('dataClass')))
                ) {
                    throw new TypeError('The object is not an instance of "' + config.get('dataClass') + '"');
                }

                builder.setObject(object);
            }

            if (this.validator) {
                builder.setValidator(this.validator);
            }

            return builder.getForm();
        }
    }

});

namespace('Sy');

/**
 * Wrapper to set/retrieve key/value pairs
 *
 * @package Sy
 * @interface
 */

Sy.ConfiguratorInterface = function () {};

Sy.ConfiguratorInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set a new key/value pair
     *
     * @param {string} key
     * @param {mixed} value
     *
     * @return {Sy.ConfiguratorInterface}
     */

    set: {
        value: function (key, value) {}
    },

    /**
     * Return a previously set value through its key
     *
     * @param {string} key
     *
     * @return {mixed}
     */

    get: {
        value: function (key) {}
    },

    /**
     * Check if a key is set in the configuration
     *
     * @param {string} key
     *
     * @return {boolean}
     */

    has: {
        value: function (key) {}
    },

    /**
     * Set a name for configuration object
     *
     * @param {string} name
     *
     * @return {Sy.ConfiguratorInterface}
     */

    setName: {
        value: function (name) {}
    },

    /**
     * Return the configuration name
     *
     * @return {string}
     */

    getName: {
        value: function () {}
    }

});
namespace('Sy');

/**
 * Wrapper to set/retrieve key/value pairs
 *
 * @package Sy
 * @class
 * @implements {Sy.ConfiguratorInterface}
 */

Sy.Configurator = function () {

    this.name = '';
    this.config = {};

};

Sy.Configurator.prototype = Object.create(Sy.ConfiguratorInterface.prototype, {

    /**
     * @inheritDoc
     */

    set: {
        value: function (key, value) {

            if (key instanceof Object && value === undefined) {
                this.config = _.extend(this.config, key);
            } else {
                objectSetter.call(this.config, key, value);
            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (key) {

            var value;

            if (key === undefined) {
                value = this.config;
            } else if (this.has(key)) {
                value = objectGetter.call(this.config, key);
            }

            return value;

        }
    },

    /**
     * @inheritDoc
     */

    has: {
        value: function (key) {
            var elements = key.split('.'),
                object = this.config,
                prop;

            while (elements.length !== 0) {
                prop = elements.shift();

                if (!object.hasOwnProperty(prop)) {
                    return false;
                }

                object = object[prop];
            }

            return true;
        }
    },

    /**
     * @inheritDoc
     */

    setName: {
        value: function (name) {

            this.name = name;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    getName: {
        value: function () {

            return this.name;

        }
    }

});
/**
 * Helper to abstract browsers diffs and extend dom manipulation
 *
 * @class
 */

DOM = function (node) {

    if (this === window) {
        return new DOM(node);
    }

    this.node = node;

};

DOM.prototype = Object.create(Object.prototype, {

    /**
     * Check if the node if a child of the specified node or css selector
     *
     * @param {string|HTMLElement} toMatch Parent node or css selector representing a parent
     * @param {HTMLElement} node Optional, default to instance node
     *
     * @return {Boolean}
     */

    isChildOf: {
        value: function (toMatch, node) {

            node = node || this.node;

            if (toMatch instanceof HTMLElement) {
                if (toMatch === node) {
                    return true;
                } else {
                    return this.isChildOf(toMatch, node.parentNode);
                }
            } else if (typeof toMatch === 'string') {
                if (this.matches(toMatch)) {
                    return true;
                } else {
                    return this.matches(toMatch, node.parentNode);
                }
            }

            return false;

        }
    },

    /**
     * Check if the node match a css selector
     *
     * @param {string} selector
     * @param {HTMLElement} node Optional, default to instance node
     *
     * @return {Boolean}
     */

    matches: {
        value: function (selector, node) {

            node = node || this.node;

            if (node.matches && node.matches(selector)) {
                return true;
            } else if (node.webkitMatchesSelector && node.webkitMatchesSelector(selector)) {
                return true;
            } else if (node.mozMatchesSelector && node.mozMatchesSelector(selector)) {
                return true;
            } else if (node.msMatchesSelector && node.msMatchesSelector(selector)) {
                return true;
            }

            return false;

        }
    }

});
namespace('Sy.View');

/**
 * Interface to list dependencies for this factory
 *
 * @package Sy
 * @subpackage View
 * @interface
 * @extends {Sy.FactoryInterface}
 */

Sy.View.LayoutFactoryInterface = function () {};
Sy.View.LayoutFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the dom parser
     *
     * @param {Sy.View.Parser} parser
     *
     * @return {Sy.View.LayoutFactoryInterface}
     */

    setParser: {
        value: function (parser) {}
    },

    /**
     * Set the template engine
     *
     * @param {Sy.View.TemplateEngineInterface} engine
     *
     * @return {Sy.View.LayoutFactoryInterface}
     */

    setTemplateEngine: {
        value: function (engine) {}
    },

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.View.LayoutFactoryInterface}
     */

    setRegistryFactory: {
        value: function (factory) {}
    },

    /**
     * Set the layout factory
     *
     * @param {Sy.View.LayoutFactoryInterface} factory
     *
     * @return {Sy.View.LayoutFactoryInterface}
     */

    setListFactory: {
        value: function (factory) {}
    },

    /**
     * Inject a layout wrapper instance
     *
     * @param {String} viewscreen ViewScreen name it belongs to
     * @param {String} name Layout name it's attached to
     * @param {Sy.View.Layout} layout
     *
     * @return {Sy.View.LayoutFactoryInterface} self
     */

    setLayoutWrapper: {
        value: function (viewscreen, name, layout) {}
    }

});

namespace('Sy.View');

/**
 * Interface to list dependencies for this factory
 *
 * @package Sy
 * @subpackage View
 * @interface
 * @extends {Sy.FactoryInterface}
 */

Sy.View.ListFactoryInterface = function () {};
Sy.View.ListFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the template engine
     *
     * @param {Sy.View.TemplateEngineInterface} engine
     *
     * @return {Sy.View.ListFactoryInterface}
     */

    setTemplateEngine: {
        value: function (engine) {}
    },

    /**
     * Set a registry to hold custom list wrappers
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.ListFactoryInterface} self
     */

    setRegistry: {
        value: function (registry) {}
    },

    /**
     * Inject a custom list wrapper
     *
     * @param {String} viewscreen ViewScreen name it belongs to
     * @param {String} layout Layout name it belongs to
     * @param {String} name List it's attached to
     * @param {Sy.View.List} list
     *
     * @return {Sy.View.ListFactoryInterface} self
     */

    setListWrapper: {
        value: function (viewscreen, layout, name, list) {}
    }

});

namespace('Sy.View');

/**
 * Parse DOM nodes and replace placeholders by the given data
 *
 * @package Sy
 * @subpackage View
 * @interface
 */

Sy.View.TemplateEngineInterface = function () {};
Sy.View.TemplateEngineInterface.prototype = Object.create(Object.prototype, {

    /**
     * Placeholder pattern
     */

    PATTERN: {
        value: new RegExp(/{{\s?([\w.]+)\s?}}/igm),
        writable: false,
        configurable: false
    },

    /**
     * Parse DOM nodes and replace placeholders by the given data
     *
     * @param {HTMLElement} node
     * @param {Object} data
     * @param {String} exempt CSS selector to exempt nodes of being rendered
     *
     * @return {Sy.View.TemplateEngineInterface}
     */

    render: {
        value: function (node, data, exempt) {}
    }

});

namespace('Sy.View');

/**
 * Interface to list dependencies for this factory
 *
 * @package Sy
 * @subpackage View
 * @interface
 * @extends {Sy.FactoryInterface}
 */

Sy.View.ViewScreenFactoryInterface = function () {};
Sy.View.ViewScreenFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the dom parser
     *
     * @param {Sy.View.Parser} parser
     *
     * @return {Sy.View.ViewScreenFactoryInterface}
     */

    setParser: {
        value: function (parser) {}
    },

    /**
     * Set the template engine
     *
     * @param {Sy.View.TemplateEngineInterface} engine
     *
     * @return {Sy.View.ViewScreenFactoryInterface}
     */

    setTemplateEngine: {
        value: function (engine) {}
    },

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.View.ViewScreenFactoryInterface}
     */

    setRegistryFactory: {
        value: function (factory) {}
    },

    /**
     * Set the layout factory
     *
     * @param {Sy.View.LayoutFactoryInterface} factory
     *
     * @return {Sy.View.ViewScreenFactoryInterface}
     */

    setLayoutFactory: {
        value: function (factory) {}
    },

    /**
     * Set viewscreen wrapper constructor
     *
     * @param {String} name Viewscreen name it's attached to
     * @param {Sy.View.ViewScreen} viewscreen
     *
     * @return {Sy.View.ViewScreenFactoryInterface} self
     */

    setViewScreenWrapper: {
        value: function (name, viewscreen) {}
    }

});

namespace('Sy.View.Event');

/**
 * Event fired before and after a viewscreen is displayed in the viewport
 *
 * @package Sy
 * @subpackage View.Event
 * @class
 * @extends {Sy.EventDispatcher.Event}
 */

Sy.View.Event.ViewPortEvent = function (viewscreen) {
	if (!(viewscreen instanceof Sy.View.ViewScreen)) {
		throw new TypeError('Invalid viewscreen');
	}

	this.viewscreen = viewscreen;
};
Sy.View.Event.ViewPortEvent.prototype = Object.create(Sy.EventDispatcher.Event.prototype, {

	PRE_DISPLAY: {
		value: 'view::on::pre::display',
		writable: false
	},

	POST_DISPLAY: {
		value: 'view::on::post::display',
		writable: false
	},

	/**
	 * Return the viewscreen being displayed
	 *
	 * @return {Sy.View.ViewScreen}
	 */

	getViewScreen: {
		value: function () {
			return this.viewscreen;
		}
	}

});

namespace('Sy.View');

/**
 * Abstract class to centralise getter/setter for node element + template engine setter
 *
 * @package Sy
 * @subpackage View
 * @class
 */

Sy.View.NodeWrapper = function () {
    this.engine = null;
    this.node = null;
};
Sy.View.NodeWrapper.prototype = Object.create(Object.prototype, {

    /**
     * Set the template engine
     *
     * @param {Sy.View.TemplateEngineInterface} engine
     *
     * @return {Sy.View.NodeWrapper}
     */

    setTemplateEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.View.TemplateEngineInterface)) {
                throw new TypeError('Invalid template engine');
            }

            this.engine = engine;

            return this;

        }
    },

    /**
     * Set the dom node
     *
     * @param {HTMLElement} node
     *
     * @return {Sy.View.NodeWrapper}
     */

    setNode: {
        value: function (node) {

            if (!(node instanceof HTMLElement)) {
                throw new TypeError('Invalid dom node');
            }

            this.node = node;

            return this;

        }
    },

    /**
     * Return the dom node
     *
     * @return {HTMLElement}
     */

    getNode: {
        value: function () {
            return this.node;
        }
    },

    /**
     * Render the node with the specified data
     *
     * @param {Object} data
     *
     * @return {Sy.View.NodeWrapper}
     */

    render: {
        value: function (data) {

            this.engine.render(this.node, data);

            return this;

        }
    },

    /**
     * Find one element in the node tree matching the given selector
     *
     * @param {String} selector Css selector
     *
     * @return {HTMLElement|null}
     */

    findOne: {
        value: function (selector) {
            return this.node.querySelector(selector);
        }
    },

    /**
     * Find a set of elements in the node tree matching the given selector
     *
     * @param {String} selector Css selector
     *
     * @return {NodeList}
     */

    find: {
        value: function (selector) {
            return this.node.querySelectorAll(selector);
        }
    }

});

namespace('Sy.View');

/**
 * Node wrapper to a view layout dom node
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.NodeWrapper}
 */

Sy.View.Layout = function () {
    Sy.View.NodeWrapper.call(this);
    this.name = null;
    this.lists = null;
    this.parser = null;
    this.listFactory = null;
    this.screen = null;
};
Sy.View.Layout.prototype = Object.create(Sy.View.NodeWrapper.prototype, {

    /**
     * @inheritDoc
     */

    setNode: {
        value: function (node) {

            var lists,
                wrapper;

            Sy.View.NodeWrapper.prototype.setNode.call(this, node);

            this.name = node.dataset.syLayout;
            lists = this.parser.getLists(node);

            for (var i = 0, l = lists.length; i < l; i++) {
                wrapper = this.listFactory.make(
                    this.screen,
                    this.name,
                    lists[i]
                );

                this.lists.set(
                    wrapper.getName(),
                    wrapper
                );
            }

            return this;

        }
    },

    /**
     * Set the view screen name the layout belongs to
     *
     * @param {String} name
     *
     * @return {Sy.View.Layout} self
     */

    setViewScreenName: {
        value: function (name) {
            this.screen = name;

            return this;
        }
    },

    /**
     * Return the layout name
     *
     * @return {String}
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * Set the dom parser to look for list elements
     *
     * @param {Sy.View.Parser} parser
     *
     * @return {Sy.View.Layout}
     */

    setParser: {
        value: function (parser) {

            if (!(parser instanceof Sy.View.Parser)) {
                throw new TypeError('Invalid parser');
            }

            this.parser = parser;

            return this;

        }
    },

    /**
     * Set the registry to hold the lists
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.Layout}
     */

    setListsRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.lists = registry;

            return this;

        }
    },

    /**
     * Set the factory to build lists wrappers
     *
     * @param {Sy.View.ListFactoryInterface} factory
     *
     * @return {Sy.View.Layout}
     */

    setListFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.View.ListFactoryInterface)) {
                throw new TypeError('Invalid list factory');
            }

            this.listFactory = factory;

            return this;

        }
    },

    /**
     * Return the lists array
     *
     * @return {Array}
     */

    getLists: {
        value: function () {
            return this.lists.get();
        }
    },

    /**
     * Return the specified list wrapper
     *
     * @param {String} name
     *
     * @return {Sy.View.List}
     */

    getList: {
        value: function (name) {
            return this.lists.get(name);
        }
    },

    /**
     * @inheritDoc
     */

    render: {
        value: function (data) {
            this.engine.render(this.node, data, '[data-sy-list]');

            return this;
        }
    }

});
namespace('Sy.View');

/**
 * Default implementation of LayoutFactoryInterface
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.LayoutFactoryInterface}
 */

Sy.View.LayoutFactory = function () {
    this.parser = null;
    this.engine = null;
    this.registryFactory = null;
    this.listFactory = null;
    this.layouts = null;
};
Sy.View.LayoutFactory.prototype = Object.create(Sy.View.LayoutFactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    setParser: {
        value: function (parser) {

            if (!(parser instanceof Sy.View.Parser)) {
                throw new TypeError('Invalid parser');
            }

            this.parser = parser;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setTemplateEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.View.TemplateEngineInterface)) {
                throw new TypeError('Invalid template engine');
            }

            this.engine = engine;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.RegistryFactory)) {
                throw new TypeError('Invalid registry factory');
            }

            this.registryFactory = factory;
            this.layouts = factory.make();

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setListFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.View.ListFactoryInterface)) {
                throw new TypeError('Invalid list factory');
            }

            this.listFactory = factory;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setLayoutWrapper: {
        value: function (viewscreen, name, layout) {
            var fullname = viewscreen + '::' + name;

            if (this.layouts.has(fullname)) {
                throw new ReferenceError('A layout wrapper is already defined with the name "' + fullname + '"')
            }

            if (!(layout instanceof Sy.View.Layout)) {
                throw new TypeError('Invalid layout wrapper');
            }

            this.layouts.set(
                fullname,
                layout
            );

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (viewscreen, node) {

            var fullname = viewscreen + '::' + node.dataset.syLayout,
                wrapper;

            if (this.layouts.has(fullname)) {
                wrapper = this.layouts.get(fullname);
            } else {
                wrapper = new Sy.View.Layout();
            }

            return wrapper
                .setViewScreenName(viewscreen)
                .setParser(this.parser)
                .setListFactory(this.listFactory)
                .setListsRegistry(this.registryFactory.make())
                .setTemplateEngine(this.engine)
                .setNode(node);

        }
    }

});

namespace('Sy.View');

/**
 * Node wrapper to a view list dom node
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.NodeWrapper}
 */

Sy.View.List = function () {
    Sy.View.NodeWrapper.call(this);
    this.name = null;
    this.elements = [];
    this.types = [];
    this.screen = null;
    this.layout = null;
};
Sy.View.List.prototype = Object.create(Sy.View.NodeWrapper.prototype, {

    /**
     * @inheritDoc
     */

    setNode: {
        value: function (node) {

            var child;

            Sy.View.NodeWrapper.prototype.setNode.call(this, node);

            this.name = node.dataset.syList;

            for (var i = 0, l = node.childElementCount; i < l; i++) {
                child = node.firstElementChild;
                this.elements.push(child);
                node.removeChild(child);

                if (this.elements.length > 1 && child.dataset.type === undefined) {
                    throw new SyntaxError('Multiple list elements require a type to be set');
                }

                if (child.dataset.type !== undefined) {
                    if (this.types.indexOf(child.dataset.type) !== -1) {
                        throw new SyntaxError('Multiple list elements defined with the same type');
                    }

                    this.types.push(child.dataset.type);
                }
            }

            return this;

        }
    },

    /**
     * Set the view screen name the list belongs to
     *
     * @param {String} name
     *
     * @return {Sy.View.List} self
     */

    setViewScreenName: {
        value: function (name) {
            this.screen = name;

            return this;
        }
    },

    /**
     * Set the layout name the list belongs to
     *
     * @param {String} name
     *
     * @return {Sy.View.List} self
     */

    setLayoutName: {
        value: function (name) {
            this.layout = name;

            return this;
        }
    },

    /**
     * Return the layout name
     *
     * @return {String}
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * Render a specific element
     *
     * @private
     * @param {Object} data
     * @param {String} type
     *
     * @return {HTMLElement}
     */

    renderElement: {
        value: function (data, type) {

            var idx = type ? this.types.indexOf(type) : 0,
                node;

            if (idx === -1) {
                throw new ReferenceError('The type "' + type + '" does not exist for the list "' + this.getName() + '"');
            }

            if (window.HTMLTemplateElement && this.elements[idx] instanceof HTMLTemplateElement) {
                node = document.importNode(this.elements[idx].content, true);
            } else {
                node = this.elements[idx].cloneNode(true);
            }

            return this.engine.render(node, data);

        }
    },

    /**
     * Append a new element rendered with the specified data to the list
     *
     * @param {Object} data
     * @param {String} type Element type (optional)
     *
     * @return {Sy.View.List}
     */

    append: {
        value: function (data, type) {

            this.getNode().appendChild(
                this.renderElement(data, type)
            );

            return this;

        }
    },

    /**
     * Prepend a new element rendered with the specified data to the list
     *
     * @param {Object} data
     * @param {String} type Element type (optional)
     *
     * @return {Sy.View.List}
     */

    prepend: {
        value: function (data, type) {

            this.getNode().insertBefore(
                this.renderElement(data, type),
                this.getNode().firstElementChild
            );

            return this;

        }
    },

    /**
     * Render the list will all the specified data (remove all elements from the list first)
     *
     * @param {Array} data Array of objects (Specify `_type` attribute to reference the type of element to be rendered on each object)
     *
     * @return {Sy.View.List}
     */

    render: {
        value: function (data) {

            var node = this.getNode(),
                d,
                type;

            while (node.firstElementChild) {
                node.removeChild(node.firstElementChild);
            }

            for (var j = 0, jl = data.length; j < jl; j++) {
                d = data[j];
                type = d._type;

                this.append(d, type);
            }

            return this;

        }
    }

});

namespace('Sy.View');

/**
 * Default implementation of ListFactoryInterface
 *
 * @package Sy
 * @subpackage View
 * @interface
 * @extends {Sy.FactoryInterface}
 */

Sy.View.ListFactory = function () {
    this.engine = null;
    this.lists = null;
};
Sy.View.ListFactory.prototype = Object.create(Sy.View.ListFactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    setTemplateEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.View.TemplateEngineInterface)) {
                throw new TypeError('Invalid template engine');
            }

            this.engine = engine;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.lists = registry;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    setListWrapper: {
        value: function (viewscreen, layout, name, list) {
            var fullname = viewscreen + '::' + layout + '::' + name;

            if (this.lists.has(fullname)) {
                throw new ReferenceError('A list wrapper is already defined with the name "' + fullname + '"')
            }

            if (!(list instanceof Sy.View.List)) {
                throw new TypeError('Invalid list wrapper');
            }

            this.lists.set(
                fullname,
                list
            );

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (viewscreen, layout, node) {

            var fullname = viewscreen + '::' + layout + '::' + node.dataset.syList,
                wrapper;

            if (this.lists.has(fullname)) {
                wrapper = this.lists.get(fullname);
            } else {
                wrapper = new Sy.View.List();
            }

            return wrapper
                .setViewScreenName(viewscreen)
                .setLayoutName(layout)
                .setTemplateEngine(this.engine)
                .setNode(node);

        }
    }

});

namespace('Sy.View');

/**
 * Handles the app views collection
 *
 * @package Sy
 * @subpackage View
 * @class
 */
Sy.View.Manager = function () {
    this.views = null;
    this.factory = null;
};
Sy.View.Manager.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry object
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.Manager}
     */

    setViewsRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.views = registry;

            return this;

        }
    },

    /**
     * Set the view screen wrapper factory
     *
     * @param {Sy.View.ViewScreenFactoryInterface} factory
     *
     * @return {Sy.View.Manager}
     */

    setViewScreenFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.View.ViewScreenFactoryInterface)) {
                throw new TypeError('Invalid factory');
            }

            this.factory = factory;

            return this;

        }
    },

    /**
     * Set a new view screen node
     *
     * @param {HTMLElement} node
     *
     * @return {Sy.View.Manager}
     */

    setViewScreen: {
        value: function (node) {

            if (!(node instanceof HTMLElement)) {
                throw new TypeError('Html node expected');
            }

            var name = node.dataset.syView;

            if (!name && name.trim() === '') {
                throw new SyntaxError('Attribute "data-sy-view" is expected');
            }

            if (this.views.has(name.trim())) {
                throw new ReferenceError('A view with the name "' + name.trim() + '" already exist');
            }

            this.views.set(
                name.trim(),
                this.factory.make(node)
            );

            return this;

        }
    },

    /**
     * Return the node wrapper for the specified view screen name
     *
     * @param {string} name
     *
     * @return {Sy.View.ViewScreen}
     */

    getViewScreen: {
        value: function (name) {

            if (!this.views.has(name)) {
                throw new ReferenceError('The view screen "' + name + '" is not registered');
            }

            return this.views.get(name);

        }
    },

    /**
     * Return an array of all registered viewscreens
     *
     * @return {Array}
     */

    getViewScreens: {
        value: function () {
            return this.views.get();
        }
    }

});

namespace('Sy.View');

/**
 * Help to build the manager by injecting viewscreens
 *
 * @package Sy
 * @subpackage View
 * @class
 */

Sy.View.ManagerConfigurator = function () {
    this.parser = null;
};

Sy.View.ManagerConfigurator.prototype = Object.create(Object.prototype, {

    /**
     * Set the dom parser
     *
     * @param {Sy.View.Parser} parser
     */

    setParser: {
        value: function (parser) {
            if (!(parser instanceof Sy.View.Parser)) {
                throw new TypeError('Invalid parser');
            }

            this.parser = parser;
        }
    },

    /**
     * Configure the manager
     *
     * @param {Sy.View.Manager} manager
     */

    configure: {
        value: function (manager) {
            if (!(manager instanceof Sy.View.Manager)) {
                throw new TypeError('Invalid manager');
            }

            var viewscreens = this.parser.getViewScreens();

            for (var i = 0, l = viewscreens.length; i < l; i++) {
                manager.setViewScreen(viewscreens[i]);

                if (!DOM(viewscreens[i]).isChildOf('.viewport')){
                    viewscreens[i].parentNode.removeChild(viewscreens[i]);
                }
            }
        }
    }

});

namespace('Sy.View');

/**
 * DOM parser to look for viewscreen/layout/list inside a dom node
 *
 * @package Sy
 * @subpackage View
 * @class
 */

Sy.View.Parser = function () {};
Sy.View.Parser.prototype = Object.create(Object.prototype, {

    /**
     * Return the elements matching the specified selector inside the dom node
     *
     * @param {String} selector Css selector
     * @param {HTMLElement} node Optional (default to document.body)
     *
     * @return {NodeList}
     */

    get: {
        value: function (selector, node) {

            node = node || document.body;

            return node.querySelectorAll(selector);
        }
    },

    /**
     * Return the list of viewscreen elements
     *
     * @param {HTMLElement} node Root node (optional)
     *
     * @return {NodeList}
     */

    getViewScreens: {
        value: function (node) {
            return this.get('[data-sy-view]', node);
        }
    },

    /**
     * Return the list of layout elements
     *
     * @param {HTMLElement} node Root node (optional)
     *
     * @return {NodeList}
     */

    getLayouts: {
        value: function (node) {
            return this.get('[data-sy-layout]', node);
        }
    },

    /**
     * Return the list of list elements
     *
     * @param {HTMLElement} node Root node (optional)
     *
     * @return {NodeList}
     */

    getLists: {
        value: function (node) {
            return this.get('[data-sy-list]', node);
        }
    }

});
namespace('Sy.View');

/**
 * Default implementation of TemplateEngineInterface
 *
 * @package Sy
 * @subpackage View
 * @class
 * @implements {Sy.View.TemplateEngineInterface}
 */

Sy.View.TemplateEngine = function () {
    Sy.View.TemplateEngineInterface.call(this);
    this.registry = null;
    this.generator = null;
};
Sy.View.TemplateEngine.prototype = Object.create(Sy.View.TemplateEngineInterface.prototype, {

    /**
     * Set registry to hold rendered nodes references
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.TemplateEngine}
     */

    setRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.registry = registry;

            return this;

        }
    },

    /**
     * Set a generator to identify each rendered node
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.View.TemplateEngine}
     */

    setGenerator: {
        value: function (generator) {

            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = generator;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    render: {
        value: function (node, data, exempt) {

            if (!(node instanceof DocumentFragment)) {
                if (!node.dataset.syUuid) {
                    this.register(node);
                }

                if (node.dataset.syUuid && this.registry.has(node.dataset.syUuid)) {
                    this.renderAllAttributes(node, data);
                    this.renderContent(node, data, exempt);
                }
            }

            if (node.childElementCount > 0) {
                for (var i = 0, l = node.childElementCount; i < l; i++) {
                    this.render(node.children[i], data, exempt);
                }
            }

            return node;

        }
    },

    /**
     * Set a UUID on the node and set in the registry all the default attributes and text content
     *
     * @private
     * @param {HTMLElement} node
     *
     * @return {Sy.View.TemplateEngine}
     */

    register: {
        value: function (node) {

            var uuid = this.generator.generate(),
                content = {
                    attributes: {},
                    textContent: null,
                    uuid: uuid
                };

            for (var i = 0, l = node.attributes.length; i < l; i++) {
                content.attributes[node.attributes[i].name] = node.getAttribute(node.attributes[i].name);
            }

            content.textContent = node.textContent;
            node.dataset.syUuid = uuid;
            this.registry.set(uuid, content);

            return this;

        }
    },

    /**
     * Loop an all node attributes and render them
     *
     * @private
     * @param {HTMLElement} node
     * @param {Object} data
     *
     * @return {HTMLElement}
     */

    renderAllAttributes: {
        value: function (node, data) {

            for (var i = 0, l = node.attributes.length; i < l; i++) {
                this.renderAttribute(node, node.attributes[i].name, data);
            }

            return node;

        }
    },

    /**
     * Render a specific attribute on a node
     *
     * @private
     * @param {HTMLElement} node
     * @param {String} attribute
     * @param {Object} data
     *
     * @return {HTMLElement}
     */

    renderAttribute: {
        value: function (node, attribute, data) {

            var uuid = node.dataset.syUuid,
                originalContent = this.registry.get(uuid).attributes[attribute],
                text;

            if (!originalContent) {
                return node;
            }

            text = this.replace(originalContent, data);
            node.setAttribute(attribute, text);

            return node;

        }
    },

    /**
     * Replace {{ \w }} with the approriate data
     *
     * @private
     * @param {string} source
     * @param {Object} data
     *
     * @return {string}
     */

    replace: {
        value: function (source, data) {

            while (source.match(this.PATTERN)) {
                var results = this.PATTERN.exec(source);

                if (results !== null && results.length >= 1) {
                    source = source.replace(results[0], reflectedObjectGetter.call(data, results[1]) || '');
                }
            }

            return source;

        }
    },

    /**
     * Replace textContent placeholders by data
     *
     * @private
     * @param {HTMLElement} node
     * @param {Object} data
     * @param {String} exempt CSS selector to exempt nodes of being rendered
     *
     * @return {void}
     */

    renderContent: {
        value: function (node, data, exempt) {

            if (node.childElementCount > 0) {
                return node;
            }

            if (exempt && DOM(node).matches(exempt)) {
                return node;
            }

            var uuid = node.dataset.syUuid,
                originalContent = this.registry.get(uuid).textContent,
                results = this.PATTERN.exec(originalContent),
                d;

            if (results) {
                d = objectGetter.call(data, results[1]);
            }

            if (d instanceof HTMLElement) {
                node.removeChild(node.firstElementChild);
                node.appendChild(d);
            } else {
                node.textContent = this.replace(originalContent, data);
            }

            return node;

        }
    }

});

namespace('Sy.View');

/**
 * Top class to access the view mechanism and handle the app viewport
 *
 * @package Sy
 * @subpackage View
 * @class
 */

Sy.View.ViewPort = function () {
    this.node = null;
    this.manager = null;
    this.dispatcher = null;
    this.current = null;
};
Sy.View.ViewPort.prototype = Object.create(Sy.View.NodeWrapper.prototype, {

    /**
     * Set the event dispatcher to dispatch event when viewscreen is changed
     *
     * @param {Sy.EventDispatcher.EventDispatcherInterface} dispatcher
     *
     * @return {Sy.View.ViewPort}
     */

    setDispatcher: {
        value: function (dispatcher) {

            if (!(dispatcher instanceof Sy.EventDispatcher.EventDispatcherInterface)) {
                throw new TypeError('Invalid event dispatcher');
            }

            this.dispatcher = dispatcher;

            return this;

        }
    },

    /**
     * Set the view port node
     *
     * @param {HTMLElement} node
     *
     * @return {Sy.View.ViewPort}
     */

    setNode: {
        value: function (node) {

            if (!(node instanceof HTMLElement) || !node.classList.contains('viewport')) {
                throw new TypeError('Invalid node');
            }

            this.node = node;

            return this;

        }
    },

    /**
     * Set the view manager
     *
     * @param {Sy.View.Manager} manager
     *
     * @return {Sy.View.ViewPort}
     */

    setViewManager: {
        value: function (manager) {

            if (!(manager instanceof Sy.View.Manager)) {
                throw new TypeError('Invalid manager');
            }

            this.manager = manager;

            return this;

        }
    },

    /**
     * Return the view manager
     *
     * @return {Sy.View.Manager}
     */

    getViewManager: {
        value: function () {
            return this.manager;
        }
    },

    /**
     * Return the current viewscreen being displayed
     *
     * @return {Sy.View.ViewScreen}
     */

    getCurrentViewScreen: {
        value: function () {

            if (this.current === null && this.node.childElementCount === 1) {
                this.current = this.manager.getViewScreen(
                    this.node.firstElementChild.dataset.syView
                );
            }

            return this.current;

        }
    },

    /**
     * Set the specified view screen name as the current one in the view port
     *
     * @param {string} name ViewScreen name
     *
     * @return {Sy.View.ViewPort}
     */

    display: {
        value: function (name) {

            var viewscreen = this.manager.getViewScreen(name),
                node = viewscreen.getNode(),
                event = new Sy.View.Event.ViewPortEvent(viewscreen);

            if (this.dispatcher) {
                this.dispatcher.dispatch(event.PRE_DISPLAY, event);
            }

            switch (this.node.childElementCount) {
                case 0:
                    this.node.appendChild(node);
                    break;
                case 1:
                    this.node.replaceChild(node, this.node.children[0]);
                    break;
                default:
                    throw new Error('Viewport in weird state (more than 1 child)');
            }

            this.current = viewscreen;

            if (this.dispatcher) {
                event = new Sy.View.Event.ViewPortEvent(viewscreen);
                this.dispatcher.dispatch(event.POST_DISPLAY, event);
            }

            return this;

        }
    }

});

namespace('Sy.View');

/**
 * Wrapper for a view screen dom node
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.NodeWrapper}
 */

Sy.View.ViewScreen = function () {
    Sy.View.NodeWrapper.call(this);
    this.name = '';
    this.parser = null;
    this.layouts = null;
    this.layoutFactory = null;
};
Sy.View.ViewScreen.prototype = Object.create(Sy.View.NodeWrapper.prototype, {

    /**
     * @inheritDoc
     */

    setNode: {
        value: function (node) {

            var layouts,
                wrapper;

            Sy.View.NodeWrapper.prototype.setNode.call(this, node);

            this.name = node.dataset.syView;
            layouts = this.parser.getLayouts(node);

            for (var i = 0, l = layouts.length; i < l; i++) {
                wrapper = this.layoutFactory.make(this.name, layouts[i]);

                this.layouts.set(
                    wrapper.getName(),
                    wrapper
                );
            }

            return this;

        }
    },

    /**
     * Return the view screen name
     *
     * @return {string}
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * Set the dom parser to look for layouts elements
     *
     * @param {Sy.View.Parser} parser
     *
     * @return {Sy.View.ViewScreen}
     */

    setParser: {
        value: function (parser) {

            if (!(parser instanceof Sy.View.Parser)) {
                throw new TypeError('Invalid parser');
            }

            this.parser = parser;

            return this;

        }
    },

    /**
     * Set the registry to hold the layouts
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.View.ViewScreen}
     */

    setLayoutsRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.layouts = registry;

            return this;

        }
    },

    /**
     * Set the factory to build layouts wrappers
     *
     * @param {Sy.View.LayoutFactoryInterface} factory
     *
     * @return {Sy.View.ViewScreen}
     */

    setLayoutFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.View.LayoutFactoryInterface)) {
                throw new TypeError('Invalid layout factory');
            }

            this.layoutFactory = factory;

            return this;

        }
    },

    /**
     * Return the layouts array
     *
     * @return {Array}
     */

    getLayouts: {
        value: function () {
            return this.layouts.get();
        }
    },

    /**
     * Return the specified layout wrapper
     *
     * @param {String} name
     *
     * @return {Sy.View.Layout}
     */

    getLayout: {
        value: function (name) {
            return this.layouts.get(name);
        }
    },

    /**
     * @inheritDoc
     */

    render: {
        value: function (data) {
            this.engine.render(this.node, data, '[data-sy-list]');

            return this;
        }
    }

});

namespace('Sy.View');

/**
 * Default implementation of ViewScreenFactoryInterface
 *
 * @package Sy
 * @subpackage View
 * @class
 * @extends {Sy.View.ViewScreenFactoryInterface}
 */

Sy.View.ViewScreenFactory = function () {
    this.parser = null;
    this.engine = null;
    this.registryFactory = null;
    this.layoutFactory = null;
    this.viewscreens = null;
};
Sy.View.ViewScreenFactory.prototype = Object.create(Sy.View.ViewScreenFactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    setParser: {
        value: function (parser) {

            if (!(parser instanceof Sy.View.Parser)) {
                throw new TypeError('Invalid parser');
            }

            this.parser = parser;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setTemplateEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.View.TemplateEngineInterface)) {
                throw new TypeError('Invalid template engine');
            }

            this.engine = engine;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.RegistryFactory)) {
                throw new TypeError('Invalid registry factory');
            }

            this.registryFactory = factory;
            this.viewscreens = factory.make();

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setLayoutFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.View.LayoutFactoryInterface)) {
                throw new TypeError('Invalid layout factory');
            }

            this.layoutFactory = factory;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    setViewScreenWrapper: {
        value: function (name, viewscreen) {

            if (this.viewscreens.has(name)) {
                throw new ReferenceError('A viewscreen wrapper is already defined with the name "' + name + '"');
            }

            if (!(viewscreen instanceof Sy.View.ViewScreen)) {
                throw new TypeError('Invalid viewscreen wrapper');
            }

            this.viewscreens.set(name, viewscreen);

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (node) {

            var name = node.dataset.syView,
                wrapper;

            if (this.viewscreens.has(name)) {
                wrapper = this.viewscreens.get(name);
            } else {
                wrapper = new Sy.View.ViewScreen();
            }

            return wrapper
                .setParser(this.parser)
                .setLayoutFactory(this.layoutFactory)
                .setLayoutsRegistry(this.registryFactory.make())
                .setTemplateEngine(this.engine)
                .setNode(node);

        }
    }

});

namespace('Sy.ServiceContainer');

/**
 * Service container
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Core = function () {
    this.initialized = {
        container: this
    };
    this.services = {};
    this.loading = [];
    this.config = null;
    this.compiler = null;
    this.compiled = false;
    this.propertyAccessor = new Sy.PropertyAccessor(true);
};

Sy.ServiceContainer.Core.prototype = Object.create(Object.prototype, {

    /**
     * Add a set of services definitions to the container
     *
     * @param {Object} services
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    set: {
        value: function (services) {
            var service,
                alias,
                def;

            for (var name in services) {
                alias = /^@.+$/;

                if (services.hasOwnProperty(name)) {
                    if (
                        this.services[name] &&
                        this.services[name] instanceof Sy.ServiceContainer.Definition
                    ) {
                        throw new TypeError('Service name already used');
                    }

                    def = services[name];

                    if (typeof def === 'string' && alias.test(def)) {
                        service = new Sy.ServiceContainer.Alias(def.substr(1));
                    } else {
                        service = new Sy.ServiceContainer.Definition();

                        service.setConstructor(def.constructor);

                        if (def.factory instanceof Array) {
                            service
                                .setFactoryService(new Sy.ServiceContainer.Reference(def.factory[0]))
                                .setFactoryMethod(def.factory[1]);
                        }

                        if (def.configurator instanceof Array) {
                            service
                                .setConfigurator(new Sy.ServiceContainer.Reference(def.configurator[0]))
                                .setConfiguratorMethod(def.configurator[1]);
                        }

                        if (def.calls instanceof Array) {
                            def.calls.forEach(function (el) {
                                service.addCall(el[0], el[1]);
                            }, this);
                        }

                        if (def.hasOwnProperty('private')) {
                            service.setPrivate();
                        }

                        if (def.tags instanceof Array) {
                            def.tags.forEach(function (el) {
                                service.addTag(el.name, el);
                            }, this);
                        }

                        if (def.hasOwnProperty('abstract')) {
                            service.setAbstract();
                        }

                        if (def.hasOwnProperty('prototype')) {
                            service.setPrototype();
                        }

                        if (def.hasOwnProperty('parent')) {
                            service.setParent(new Sy.ServiceContainer.Reference(def.parent));
                        }
                    }

                    this.services[name] = service;
                }
            }

            return this;
        }
    },

    /**
     * Set an already initialized object
     *
     * @param {String} name
     * @param {Object} service
     *
     * @return {Sy.ServiceContainer.Core}
     */

    setInstance: {
        value: function (name, service) {
            this.initialized[name] = service;

            return this;
        }
    },

    /**
     * Return the instance of a defined service
     *
     * @param {String} id
     *
     * @throws {ReferenceError} If the service has not been defined or is private
     *
     * @return {Object}
     */

    get: {
        value: function (id) {
            if (!this.services.hasOwnProperty(id) && !this.initialized.hasOwnProperty(id)) {
                throw new ReferenceError('Unknown service');
            }

            if (this.initialized.hasOwnProperty(id)) {
                return this.initialized[id];
            }

            if (this.services[id] instanceof Sy.ServiceContainer.Alias) {
                return this.get(this.services[id].toString());
            }

            if (this.loading.length === 0 && !this.services[id].isPublic()) {
                throw new Error('Can\'t access private service');
            }

            if (this.loading.length === 0 && this.services[id].isAbstract()) {
                throw new Error('Can\'t access abstract service');
            }

            if (this.loading.indexOf(id) !== -1) {
                this.loading = [];
                throw new Error('Circular referencing');
            }

            var def = this.services[id],
                constructor = this.propertyAccessor.getValue(window, def.getConstructor()),
                service,
                factory;

            this.loading.push(id);

            if (def.hasFactory()) {
                factory = this.get(
                    def
                        .getFactoryService()
                        .toString()
                );
                service = factory[def.getFactoryMethod()].call(factory, def.getConstructor());

                if (!(service instanceof constructor)) {
                    throw new TypeError('Factory built an object different from the specified type');
                }
            } else {
                service = new constructor();
            }

            def.getCalls().forEach(function (call) {
                var method = call[0],
                    args = call[1];

                args.forEach(function (arg, idx, args) {
                    if (arg instanceof Sy.ServiceContainer.Reference) {
                        args[idx] = this.get(arg.toString());
                    } else if (arg instanceof Sy.ServiceContainer.Parameter) {
                        args[idx] = this.getParameter(arg.toString());
                    }
                }, this);

                service[method].apply(service, args);
            }, this);

            if (def.hasConfigurator()) {
                this
                    .get(
                        def
                            .getConfigurator()
                            .toString()
                    )
                    [def.getConfiguratorMethod()](service);
            }

            if (!def.isPrototype()) {
                this.initialized[id] = service;
            }

            this.loading.splice(this.loading.indexOf(id), 1);
            return service;
        }
    },

    /**
     * Remove a service definition
     *
     * @param {String} id
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    remove: {
        value: function (id) {
            delete this.services[id];

            return this;
        }
    },

    /**
     * Return all the services ids
     *
     * @return {Array}
     */

    getServiceIds: {
        value: function () {
            return Object.keys(this.services);
        }
    },

    /**
     * Check if a service is defined
     *
     * @param {String} id
     *
     * @return {Boolean}
     */

    has: {
        value: function (id) {
            return this.services.hasOwnProperty(id) || this.initialized.hasOwnProperty(id);
        }
    },

    /**
     * Check if a service has been initialized
     *
     * @param {String} id
     *
     * @return {Boolean}
     */

    isInitialized: {
        value: function (id) {
            return this.initialized.hasOwnProperty(id);
        }
    },

    /**
     * Set an config object
     *
     * @param {Sy.ConfiguratorInterface} config
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    setParameters: {
        value: function (config) {
            if (!(config instanceof Sy.ConfiguratorInterface)) {
                throw new TypeError('Invalid parameters object');
            }

            this.config = config;

            return this;
        }
    },

    /**
     * Return a parameter
     *
     * @param {String} path
     *
     * @throws {ReferenceError} If the path is not accessible
     *
     * @return {mixed}
     */

    getParameter: {
        value: function (path) {
            return this.config.get(path);
        }
    },

    /**
     * Check if a parameter is defined
     *
     * @param {String} path
     *
     * @return {Boolean}
     */

    hasParameter: {
        value: function (path) {
            return this.config.has(path);
        }
    },

    /**
     * Set a new parameter in the config object
     *
     * @param {String} key
     * @param {mixed} value
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    setParameter: {
        value: function (key, value) {
            this.config.set(key, value);

            return this;
        }
    },

    /**
     * Return the definition of a service
     *
     * @param {String} id
     *
     * @throws {ReferenceError} If the service does not exist or the container has been compiled
     *
     * @return {Sy.ServiceContainer.Definition}
     */

    getDefinition: {
        value: function (id) {
            if (this.compiled === true) {
                throw new ReferenceError('Can\'t access a definition once container compiled');
            }

            return this.services[id];
        }
    },

    /**
     * Set a service definition
     *
     * @param {String} id
     * @param {Sy.ServiceContainer.Definition} definition
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    setDefinition: {
        value: function (id, definition) {
            if (!(definition instanceof Sy.ServiceContainer.Definition)) {
                throw new TypeError('Invalid definition');
            }

            this.services[id] = definition;

            return this;
        }
    },

    /**
     * Set the compiler
     *
     * @param {Sy.ServiceContainer.Compiler} compiler
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    setCompiler: {
        value: function (compiler) {
            if (!(compiler instanceof Sy.ServiceContainer.Compiler)) {
                throw new TypeError('Invalid compiler');
            }

            this.compiler = compiler;

            return this;
        }
    },

    /**
     * Add a compiler pass
     *
     * @param {Sy.ServiceContainer.CompilerPassInterface} pass
     * @param {String} type
     *
     * @return {Sy.ServiceContainer.Core} self
     */

    addPass: {
        value: function (pass, type) {
            this.compiler.addPass(pass, type);

            return this;
        }
    },

    /**
     * Compile the container
     */

    compile: {
        value: function () {
            this.compiler.compile(this);

            Object.freeze(this.services);
            this.compiled = true;
        }
    },

    /**
     * Return the service ids flagged with the specified tag
     *
     * @param {String} tag
     *
     * @return {Array}
     */

    findTaggedServiceIds: {
        value: function (tag) {
            var ids = this.getServiceIds(),
                matched = [];

            ids.forEach(function (id) {
                if (!(this.services[id] instanceof Sy.ServiceContainer.Definition)) {
                    return;
                }

                var filtered = this.services[id].getTag(tag);

                if (filtered.length > 0) {
                    matched.push({id: id, tags: filtered});
                }
            }, this);

            return matched;
        }
    }

});

namespace('Sy.ServiceContainer');

/**
 * Alias to another service
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Alias = function (id) {
    this.id = id;
};

Sy.ServiceContainer.Alias.prototype = Object.create(Object.prototype, {

    /**
     * Return the original service id
     *
     * @return {String}
     */

    toString: {
        value: function () {
            return this.id
        }
    }

});

namespace('Sy.ServiceContainer');

/**
 * Optimize a container by compiling it with successive passes
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Compiler = function () {
    this.beforeOpti = [];
    this.opti = [
        new Sy.ServiceContainer.CompilerPass.ResolveParameterPlaceholder(),
        new Sy.ServiceContainer.CompilerPass.ResolveReferencePlaceholder(),
        new Sy.ServiceContainer.CompilerPass.ApplyParentDefinition(),
    ];
    this.beforeRm = [];
    this.rm = [
        new Sy.ServiceContainer.CompilerPass.RemoveAbstractDefinitions(),
    ];
    this.afterRm = [];
};

Sy.ServiceContainer.Compiler.prototype = Object.create(Object.prototype, {

    /**
     * Add a new pass to the compiler
     *
     * @param {Sy.ServiceContainer.CompilerPassInterface} pass
     * @param {String} type Default to before optimization
     */

    addPass: {
        value: function (pass, type) {
            if (!(pass instanceof Sy.ServiceContainer.CompilerPassInterface)) {
                throw new TypeError('Invalid compiler pass');
            }

            switch (type) {
                case pass.BEFORE_OPTIMIZATION:
                    this.beforeOpti.push(pass);
                    break;
                case pass.OPTIMIZE:
                    this.opti.push(pass);
                    break;
                case pass.BEFORE_REMOVING:
                    this.beforeRm.push(pass);
                    break;
                case pass.REMOVE:
                    this.rm.push(pass);
                    break;
                case pass.AFTER_REMOVING:
                    this.afterRm.push(pass);
                    break;
                default:
                    this.beforeOpti.push(pass);
            }
        }
    },

    /**
     * Compile the service container
     *
     * @param {Sy.ServiceContainer.Core} container
     */

    compile: {
        value: function (container) {
            if (!(container instanceof Sy.ServiceContainer.Core)) {
                throw new TypeError('Invalid service container');
            }

            this.beforeOpti.forEach(function (pass) {
                pass.process(container);
            }, this);
            this.opti.forEach(function (pass) {
                pass.process(container);
            }, this);
            this.beforeRm.forEach(function (pass) {
                pass.process(container);
            }, this);
            this.rm.forEach(function (pass) {
                pass.process(container);
            }, this);
            this.afterRm.forEach(function (pass) {
                pass.process(container);
            }, this);
        }
    }

});

namespace('Sy.ServiceContainer');

/**
 * Interface that each compiler pass must implement
 *
 * A pass allow to alter/optimize service definitions
 * at container compilation time
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @interface
 */

Sy.ServiceContainer.CompilerPassInterface = function () {};
Sy.ServiceContainer.CompilerPassInterface.prototype = Object.create(Object.prototype, {

    BEFORE_OPTIMIZATION: {
        value: 'before_optimization',
        writable: false
    },

    OPTIMIZE: {
        value: 'optimize',
        writable: false,
    },

    BEFORE_REMOVING: {
        value: 'before_removing',
        writable: false
    },

    REMOVE: {
        value: 'remove',
        writable: false
    },

    AFTER_REMOVING: {
        value: 'after_removing',
        writable: false
    },

    /**
     * The container is passed to the pass to do its own work
     *
     * @param {Sy.ServiceContainer.Core} container
     */

    process: {
        value: function (container) {}
    }

});

namespace('Sy.ServiceContainer');

/**
 * Service definition
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Definition = function () {
    this.constructor = null;
    this.factoryService = null;
    this.factoryMethod = null;
    this.configuratorService = null;
    this.configuratorMethod = null;
    this.calls = [];
    this.public = true;
    this.tags = [];
    this.abstract = false;
    this.parent = null;
    this.proto = false;
};

Sy.ServiceContainer.Definition.prototype = Object.create(Object.prototype, {

    /**
     * Set the path to the service constructor
     *
     * @param {String} path
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setConstructor: {
        value: function (constructor) {
            this.constructor = constructor;

            return this;
        }
    },

    /**
     * Return the constructor path
     *
     * @return {String}
     */

    getConstructor: {
        value: function () {
            return this.constructor;
        }
    },

    /**
     * Set the factory service reference
     *
     * @param {Sy.ServiceContainer.Reference} reference
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setFactoryService: {
        value: function (reference) {
            if (!(reference instanceof Sy.ServiceContainer.Reference)) {
                throw new TypeError('Invalid reference');
            }

            this.factoryService = reference;

            return this;
        }
    },

    /**
     * Return the factory service reference
     *
     * @return {Sy.ServiceContainer.Reference}
     */

    getFactoryService: {
        value: function () {
            return this.factoryService;
        }
    },

    /**
     * Set the factory method
     *
     * @param {String} method
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setFactoryMethod: {
        value: function (method) {
            this.factoryMethod = method;

            return this;
        }
    },

    /**
     * Return the factory method
     *
     * @return {String}
     */

    getFactoryMethod: {
        value: function () {
            return this.factoryMethod;
        }
    },

    /**
     * Check if a factory is defined
     *
     * @return {Boolean}
     */

    hasFactory: {
        value: function () {
            return !!this.factoryService && !!this.factoryMethod;
        }
    },

    /**
     * Set the configurator reference
     *
     * @param {Sy.ServiceContainer.Reference} configurator
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setConfigurator: {
        value: function (configurator) {
            if (!(configurator instanceof Sy.ServiceContainer.Reference)) {
                throw new TypeError('Invalid reference');
            }

            this.configuratorService = configurator;

            return this;
        }
    },

    /**
     * Return the configurator reference
     *
     * @return {Sy.ServiceContainer.Reference}
     */

    getConfigurator: {
        value: function () {
            return this.configuratorService;
        }
    },

    /**
     * Set configurator method
     *
     * @param {String} method
     *
     * @return {Sy.ServiceConfigurator.Definition} self
     */

    setConfiguratorMethod: {
        value: function (method) {
            this.configuratorMethod = method;

            return this;
        }
    },

    /**
     * Return configurator method
     *
     * @return {String}
     */

    getConfiguratorMethod: {
        value: function () {
            return this.configuratorMethod;
        }
    },

    /**
     * Check if service has a configurator
     *
     * @return {Boolean}
     */

    hasConfigurator: {
        value: function () {
            return !!this.configuratorService && !!this.configuratorMethod;
        }
    },

    /**
     * Add a new call statement
     *
     * @param {String} method
     * @param {Array} args Array of arguments
     * @param {Boolean} pos Whether to append or prepend the call (default to append)
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    addCall: {
        value: function (method, args, pos) {
            var m = !!pos ? 'unshift' : 'push';

            this.calls[m]([method, args]);

            return this;
        }
    },

    /**
     * Return the list of calls
     *
     * @return {Array}
     */

    getCalls: {
        value: function () {
            return this.calls;
        }
    },

    /**
     * Set the service as private
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setPrivate: {
        value: function () {
            this.public = false;

            return this;
        }
    },

    /**
     * Check if the service is public
     *
     * @return {Boolean}
     */

    isPublic: {
        value: function () {
            return this.public;
        }
    },

    /**
     * Add a tag
     *
     * @param {String} name
     * @param {Object} data
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    addTag: {
        value: function (name, data) {
            data = data || {};
            this.tags.push([name, data]);

            return this;
        }
    },

    /**
     * Return the list of tags
     *
     * @return {Array}
     */

    getTags: {
        value: function () {
            return this.tags;
        }
    },

    /**
     * Return the list of tags matching the name
     *
     * @param {String} name
     *
     * @return {Array}
     */

    getTag: {
        value: function (name) {
            return this.tags.filter(function (el) {
                return el[0] === name;
            }, this);
        }
    },

    /**
     * Set the service as abstract
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setAbstract: {
        value: function () {
            this.abstract = true;

            return this;
        }
    },

    /**
     * Check if the service is abstract
     *
     * @return {Boolean}
     */

    isAbstract: {
        value: function () {
            return this.abstract;
        }
    },

    /**
     * Set a service reference as parent
     *
     * @param {Sy.ServiceContainer.Reference} parent
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setParent: {
        value: function (parent) {
            if (!(parent instanceof Sy.ServiceContainer.Reference)) {
                throw new TypeError('Invalid reference');
            }

            this.parent = parent;

            return this;
        }
    },

    /**
     * Check if the service has a parent
     *
     * @return {Boolean}
     */

    hasParent: {
        value: function () {
            return !!this.parent;
        }
    },

    /**
     * Return the parent reference
     *
     * @return {Sy.ServiceContainer.Reference}
     */

    getParent: {
        value: function () {
            return this.parent;
        }
    },

    /**
     * Set the service as prototype, meaning a new one
     * is built each time the service is accessed
     *
     * @return {Sy.ServiceContainer.Definition} self
     */

    setPrototype: {
        value: function () {
            this.proto = true;

            return this;
        }
    },

    /**
     * Check if the service is a prototype
     *
     * @return {Boolean}
     */

    isPrototype: {
        value: function () {
            return this.proto;
        }
    }

});

namespace('Sy.ServiceContainer');

/**
 * Reference of a parameter from the configurator
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Parameter = function (id) {
    this.id = id;
};

Sy.ServiceContainer.Parameter.prototype = Object.create(Object.prototype, {

    /**
     * Return the parameter id
     *
     * @return {String}
     */

    toString: {
        value: function () {
            return this.id;
        }
    }

})

namespace('Sy.ServiceContainer');

/**
 * Reference to another service
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 */

Sy.ServiceContainer.Reference = function (id) {
    this.id = id;
};

Sy.ServiceContainer.Reference.prototype = Object.create(Object.prototype, {

    /**
     * Return the referenced service id
     *
     * @return {String}
     */

    toString: {
        value: function () {
            return this.id;
        }
    }

});

namespace('Sy.ServiceContainer.CompilerPass');

/**
 * Apply a parent definition to its children
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ServiceContainer.CompilerPass.ApplyParentDefinition = function () {};
Sy.ServiceContainer.CompilerPass.ApplyParentDefinition.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            container
                .getServiceIds()
                .forEach(function (id) {
                    var def = this.getDefinition(id),
                        parent,
                        calls;

                    if (!(def instanceof Sy.ServiceContainer.Definition)) {
                        return;
                    }

                    if (def.hasParent()) {
                        parent = this.getDefinition(
                            def.getParent().toString()
                        );

                        if (parent.hasFactory() && !def.hasFactory()) {
                            def.setFactoryService(
                                parent.getFactoryService()
                            );
                            def.setFactoryMethod(
                                parent.getFactoryMethod()
                            );
                        }

                        if (parent.hasConfigurator() && !def.hasConfigurator()) {
                            def.setConfigurator(
                                parent.getConfigurator()
                            );
                            def.setConfiguratorMethod(
                                parent.getConfiguratorMethod()
                            );
                        }

                        calls = parent.getCalls();

                        for (var i = calls.length - 1; i >= 0; i--) {
                            def.addCall(
                                calls[i][0],
                                calls[i][1],
                                true
                            );
                        }
                    }
                }, container);
        }
    }

});

namespace('Sy.ServiceContainer.CompilerPass');

/**
 * Remove abstract definitions as their're been copied to their children
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ServiceContainer.CompilerPass.RemoveAbstractDefinitions = function () {};
Sy.ServiceContainer.CompilerPass.RemoveAbstractDefinitions.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            container
                .getServiceIds()
                .forEach(function (id) {
                    var def = this.getDefinition(id);

                    if (!(def instanceof Sy.ServiceContainer.Definition)) {
                        return;
                    }

                    if (def.isAbstract()) {
                        this.remove(id);
                    }
                }, container);
        }
    }

});

namespace('Sy.ServiceContainer.CompilerPass');

/**
 * Replace the references of container parameters by a Parameter object
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ServiceContainer.CompilerPass.ResolveParameterPlaceholder = function () {};
Sy.ServiceContainer.CompilerPass.ResolveParameterPlaceholder.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            container
                .getServiceIds()
                .forEach(function (id) {
                    var def = this.getDefinition(id),
                        re = /^%[a-zA-Z-_.]+%$/,
                        calls;

                    if (!(def instanceof Sy.ServiceContainer.Definition)) {
                        return;
                    }

                    calls = def.getCalls();

                    for (var i = 0, l = calls.length; i < l; i++) {
                        for (var j = 0, m = calls[i][1].length; j < m; j++) {
                            if (re.test(calls[i][1][j])) {
                                calls[i][1][j] = new Sy.ServiceContainer.Parameter(
                                    calls[i][1][j].substring(
                                        1,
                                        calls[i][1][j].length - 1
                                    )
                                );
                            }
                        }
                    }
                }, container);
        }
    }

});

namespace('Sy.ServiceContainer.CompilerPass');

/**
 * Replace the references of other services by a Reference object
 *
 * @package Sy
 * @subpackage ServiceContainer
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ServiceContainer.CompilerPass.ResolveReferencePlaceholder = function () {};
Sy.ServiceContainer.CompilerPass.ResolveReferencePlaceholder.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            container
                .getServiceIds()
                .forEach(function (id) {
                    var def = this.getDefinition(id),
                        re = /^@.+$/,
                        calls;

                    if (!(def instanceof Sy.ServiceContainer.Definition)) {
                        return;
                    }

                    calls = def.getCalls();

                    for (var i = 0, l = calls.length; i < l; i++) {
                        for (var j = 0, m = calls[i][1].length; j < m; j++) {
                            if (re.test(calls[i][1][j])) {
                                calls[i][1][j] = new Sy.ServiceContainer.Reference(
                                    calls[i][1][j].substr(1)
                                );
                            }
                        }
                    }
                }, container);
        }
    }

});

namespace('Sy.FormBundle.CompilerPass');

/**
 * Pass that register registered form types
 *
 * @package Sy
 * @subpackage FormBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.FormBundle.CompilerPass.FormTypePass = function () {};
Sy.FormBundle.CompilerPass.FormTypePass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var formBuilder = container.getDefinition('sy::core::form');

            container
                .findTaggedServiceIds('form.type')
                .forEach(function (el) {
                    formBuilder.addCall(
                        'registerFormType',
                        ['@' + el.id]
                    );
                }, this);
        }
    }

});

namespace('Sy.StorageBundle.CompilerPass');

/**
 * Pass to look for driver factories and register them in the appropriate factory
 *
 * @package Sy
 * @subpackage StorageBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.StorageBundle.CompilerPass.RegisterDriverFactoryPass = function () {};
Sy.StorageBundle.CompilerPass.RegisterDriverFactoryPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var factory = container.getDefinition('sy::core::storage::dbal::factory');

            container
                .findTaggedServiceIds('storage.driver_factory')
                .forEach(function (el) {
                    for (var i = 0, l = el.tags.length; i < l; i++) {
                        if (!el.tags[i][1].alias) {
                            continue;
                        }

                        factory.addCall(
                            'setDriverFactory',
                            [
                                el.tags[i][1].alias,
                                '@' + el.id
                            ]
                        );
                    }
                }, this);
        }
    }

});

namespace('Sy.ViewBundle.CompilerPass');

/**
 * Scan for services tagged as layout wrappers
 * and reference them to the appropriate factory
 *
 * @package Sy
 * @subpackage ViewBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ViewBundle.CompilerPass.RegisterLayoutWrapperPass = function () {};
Sy.ViewBundle.CompilerPass.RegisterLayoutWrapperPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var factory = container.getDefinition('sy::core::view::factory::layout');

            container
                .findTaggedServiceIds('view.layout')
                .forEach(function (el) {
                    for (var i = 0, l = el.tags.length; i < l; i++) {
                        if (!el.tags[i][1].alias) {
                            continue;
                        }

                        if (!el.tags[i][1].viewscreen) {
                            continue;
                        }

                        factory.addCall(
                            'setLayoutWrapper',
                            [
                                el.tags[i][1].viewscreen,
                                el.tags[i][1].alias,
                                '@' + el.id
                            ]
                        );
                    }
                });
        }
    }

});

namespace('Sy.ViewBundle.CompilerPass');

/**
 * Scan for services tagged as list wrappers
 * and reference them to the appropriate factory
 *
 * @package Sy
 * @subpackage ViewBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ViewBundle.CompilerPass.RegisterListWrapperPass = function () {};
Sy.ViewBundle.CompilerPass.RegisterListWrapperPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var factory = container.getDefinition('sy::core::view::factory::list');

            container
                .findTaggedServiceIds('view.list')
                .forEach(function (el) {
                    for (var i = 0, l = el.tags.length; i < l; i++) {
                        if (!el.tags[i][1].alias) {
                            continue;
                        }

                        if (!el.tags[i][1].viewscreen) {
                            continue;
                        }

                        if (!el.tags[i][1].layout) {
                            continue;
                        }

                        factory.addCall(
                            'setListWrapper',
                            [
                                el.tags[i][1].viewscreen,
                                el.tags[i][1].layout,
                                el.tags[i][1].alias,
                                '@' + el.id
                            ]
                        );
                    }
                });
        }
    }

});

namespace('Sy.ViewBundle.CompilerPass');

/**
 * Scan for services tagged as viewscreen wrappers
 * and reference them to the appropriate factory
 *
 * @package Sy
 * @subpackage ViewBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ViewBundle.CompilerPass.RegisterViewScreenWrapperPass = function () {};
Sy.ViewBundle.CompilerPass.RegisterViewScreenWrapperPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var factory = container.getDefinition('sy::core::view::factory::viewscreen');

            container
                .findTaggedServiceIds('view.viewscreen')
                .forEach(function (el) {
                    for (var i = 0, l = el.tags.length; i < l; i++){
                        if (!el.tags[i][1].alias) {
                            continue;
                        }

                        factory.addCall(
                            'setViewScreenWrapper',
                            [
                                el.tags[i][1].alias,
                                '@' + el.id
                            ]
                        );
                    }
                });
        }
    }

});

namespace('Sy.ViewBundle.CompilerPass');

/**
 * Add the app state subscriber tag if the app state will initialize
 *
 * @package Sy
 * @subpackage ViewBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.ViewBundle.CompilerPass.RegisterSubscriberPass = function () {};
Sy.ViewBundle.CompilerPass.RegisterSubscriberPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var def = container.getDefinition('sy::core::view::subscriber::appstate');

            if (container.hasParameter('routes')) {
                def.addTag('event.subscriber', {name: 'event.subscriber'});
            }
        }
    }

});

namespace('Sy.AppStateBundle.CompilerPass');

/**
 * Service container pass to extract routes from config
 *
 * @package Sy
 * @subpackage AppStateBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.AppStateBundle.CompilerPass.RegisterRoutesPass = function () {};
Sy.AppStateBundle.CompilerPass.RegisterRoutesPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var def = container.getDefinition('sy::core::appstate::routeprovider'),
                routes = container.getParameter('routes');

            if (!routes) {
                return;
            }

            for (var name in routes) {
                if (routes.hasOwnProperty(name)) {
                    def.addCall(
                        'setRoute',
                        [
                            name,
                            routes[name].path,
                            routes[name].parameters,
                            routes[name].requirements
                        ]
                    );
                }
            }
        }
    }

});
namespace('Sy.EventDispatcherBundle.CompilerPass');

/**
 * Pass that subscribe to registered event subscribers/listeners
 *
 * @package Sy
 * @subpackage EventDispatcherBundle
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.EventDispatcherBundle.CompilerPass.RegisterListenersPass = function (service, listenerTag, subscriberTag) {
    this.service = service || 'sy::core::event_dispatcher';
    this.listenerTag = listenerTag || 'event.listener';
    this.subscriberTag = subscriberTag || 'event.subscriber';
    this.accessor = new Sy.PropertyAccessor(true);
};
Sy.EventDispatcherBundle.CompilerPass.RegisterListenersPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var dispatcher = container.getDefinition(this.service);

            container
                .findTaggedServiceIds(this.listenerTag)
                .forEach(function (el) {
                    def = container.getDefinition(el.id);

                    if (!def.isPublic()) {
                        throw new ReferenceError(
                            'The service "' + el.id + '" must be public as event listeners are lazy-loaded'
                        );
                    }

                    if (def.isAbstract()) {
                        throw new ReferenceError(
                            'The service "' + el.id + '" must not be abstract as event listeners are lazy-loaded'
                        );
                    }

                    for (var i = 0, l = el.tags.length; i < l; i++) {
                        if (!el.tags[i][1].event) {
                            throw new SyntaxError('Event name must be set in tag');
                        }

                        if (!el.tags[i][1].method) {
                            throw new SyntaxError('Listener method must be set in tag');
                        }

                        dispatcher.addCall(
                            'addListenerService',
                            [
                                el.tags[i][1].event,
                                el.id,
                                el.tags[i][1].method,
                                el.tags[i][1].priority
                            ]
                        );
                    }
                }, this);

            container
                .findTaggedServiceIds(this.subscriberTag)
                .forEach(function (el) {
                    var def = container.getDefinition(el.id),
                        constructor = def.getConstructor();

                    if (!def.isPublic()) {
                        throw new ReferenceError(
                            'The service "' + el.id + '" must be public as event listeners are lazy-loaded'
                        );
                    }

                    if (def.isAbstract()) {
                        throw new ReferenceError(
                            'The service "' + el.id + '" must not be abstract as event listeners are lazy-loaded'
                        );
                    }

                    constructor = this.accessor.getValue(window, constructor);

                    if (!constructor || !(constructor.prototype instanceof Sy.EventDispatcher.EventSubscriberInterface)) {
                        throw new TypeError(
                            'The service "' + el.id + '" must implement the interface "Sy.EventDispatcher.EventSubscriberInterface"'
                        );
                    }

                    dispatcher.addCall(
                        'addSubscriberService',
                        [
                            el.id,
                            constructor
                        ]
                    );
                }, this);
        }
    }

});

namespace('Sy');

/**
 * Class allowing to store translations string
 *
 * @package Sy
 * @class
 */

Sy.Translator = function () {
    this.currentLanguage = null;
    this.languages = null;
    this.stateRegistryFactory = null;
};

Sy.Translator.prototype = Object.create(Object.prototype, {

    /**
     * Set the language registry
     *
     * @param {Sy.Registry} registry
     *
     * @return {Sy.Translator}
     */

    setRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.Registry)) {
                throw new TypeError('Invalid registry');
            }

            this.languages = registry;

            return this;

        }
    },

    /**
     * Set the state registry factory used to easily create new groups of translations
     *
     * @param {Sy.StateRegistryFactory} factory
     *
     * @return {Sy.Translator}
     */

    setStateRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.StateRegistryFactory)) {
                throw new TypeError('Invalid state registry factory');
            }

            this.stateRegistryFactory = factory;

            return this;

        }
    },

    /**
     * Set the language to translate to
     *
     * @param {string} language
     *
     * @return {Sy.Translator}
     */

    setLanguage: {
        value: function (language) {

            this.currentLanguage = language;
            return this;

        }
    },

    /**
     * Register new translations data
     *
     * @param {string} language
     * @param {string} domain Group of translations
     * @param {string} key Translation key
     * @param {string} translation Translated string
     *
     * @return {Sy.Translator}
     */

    registerTranslation: {
        value: function (language, domain, key, translation) {

            if (!this.languages.has(language)) {
                this.languages.set(
                    language,
                    this.stateRegistryFactory.make()
                );
            }

            this.languages.get(language).set(
                domain,
                key,
                translation
            );

            return this;

        }
    },

    /**
     * Register multiple translations at once
     *
     * The translations array is composed of objects like below:
     * <code>
     * {
     *     'domain': 'domain of the translation', //optional (default to root)
     *     'key': 'key to access translation',
     *     'translation': 'translated string'
     * }
     * </code>
     *
     * @param {string} language
     * @param {Array} translations
     *
     * @return {Sy.Translator}
     */

    registerTranslations: {
        value: function (language, translations) {

            for (var i = 0, l = translations.length; i < l; i++) {
                this.registerTranslation(
                    language,
                    translations[i].domain || 'root',
                    translations[i].key,
                    translations[i].translation
                );
            }

            return this;

        }
    },

    /**
     * Translate a string
     *
     * @param {string} key
     * @param {string} domain Optional (default to root)
     * @param {string} language Enforce the translation language, optional
     *
     * @return {string}
     */

    translate: {
        value: function (key, domain, language) {

            var lang = language || this.currentLanguage;
            domain = domain || 'root';

            if (
                !this.languages.has(lang) ||
                !this.languages.get(lang).has(domain, key)
            ) {
                return key;
            }

            return this.languages.get(lang).get(domain, key);

        }
    }

});
namespace('Sy.AppState');

/**
 * Represent a URL
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.Route = function () {
    this.name = null;
    this.path = null;
    this.parameters = {};
    this.requirements = {};
    this.regex = null;
};
Sy.AppState.Route.prototype = Object.create(Object.prototype, {

    /**
     * Set the route name
     *
     * @param {String} name
     *
     * @return {Sy.AppState.Route} self
     */

    setName: {
        value: function (name) {
            this.name = name;

            return this;
        }
    },

    /**
     * Return the route name
     *
     * @return {String}
     */

    getName: {
        value: function () {
            return this.name;
        }
    },

    /**
     * Set the path
     *
     * @param {String} path
     *
     * @return {Sy.AppState.Route} self
     */

    setPath: {
        value: function (path) {
            this.path = path;

            return this;
        }
    },

    /**
     * Return the path
     *
     * @return {String}
     */

    getPath: {
        value: function () {
            return this.path;
        }
    },

    /**
     * Set the parameters
     *
     * @param {Object} params
     *
     * @return {Sy.AppState.Route} self
     */

    setParameters: {
        value: function (params) {
            if (!Object.isFrozen(this.parameters)) {
                this.parameters = params;
            }

            Object.freeze(this.parameters);

            return this;
        }
    },

    /**
     * Get the parameters
     *
     * @return {Object}
     */

    getParameters: {
        value: function () {
            return this.parameters;
        }
    },

    /**
     * Check if the route has a parameter
     *
     * @param {String} name
     *
     * @return {Boolean}
     */

    hasParameter: {
        value: function (name) {
            return this.parameters.hasOwnProperty(name);
        }
    },

    /**
     * Return a parameter value
     *
     * @param {String} name
     *
     * @return {mixed}
     */

    getParameter: {
        value: function (name) {
            return this.parameters[name];
        }
    },

    /**
     * Set the requirements
     *
     * @param {Object} req
     *
     * @return {Sy.AppState.Route} self
     */

    setRequirements: {
        value: function (req) {
            if (!Object.isFrozen(this.requirements)) {
                this.requirements = req;
            }

            Object.freeze(this.requirements);

            return this;
        }
    },

    /**
     * Return the requirements
     *
     * @return {Object}
     */

    getRequirements: {
        value: function () {
            return this.requirements;
        }
    },

    /**
     * Return a requirement
     *
     * @param {String} name
     *
     * @return {mixed}
     */

    getRequirement: {
        value: function (name) {
            return this.requirements[name];
        }
    },

    /**
     * Check if the route has a requirement
     *
     * @param {String} name
     *
     * @return {Boolean}
     */

    hasRequirement: {
        value: function (name) {
            return this.requirements.hasOwnProperty(name);
        }
    },

    /**
     * Create a regex from the path and requirements
     *
     * @return {Sy.AppState.Route} self
     */

    buildRegex: {
        value: function () {
            var placeholders = this.path.match(new RegExp(/{\w+}/g));

            this.regex = '^' + this.path + '$';

            if (placeholders instanceof Array) {
                placeholders.forEach(function (placeholder) {
                    var name = placeholder.substring(1, placeholder.length - 1);

                    if (this.hasRequirement(name)) {
                        this.regex = this.regex.replace(
                            placeholder,
                            '(' + this.getRequirement(name) + ')'
                        );
                    } else {
                        this.regex = this.regex.replace(
                            placeholder,
                            '(.+)'
                        );
                    }
                }.bind(this));
            }

            return this;
        }
    },

    /**
     * Check if a string matches the url
     *
     * @param {String} url
     *
     * @return {Boolean}
     */

    matches: {
        value: function (url) {
            return (new RegExp(this.regex)).test(url);
        }
    },

    /**
     * Return the variables from the url
     *
     * @param {String} url
     *
     * @return {Object}
     */

    getVariables: {
        value: function (url) {
            var placeholders = this.path.match(new RegExp(/{\w+}/g)),
                values = url.match(new RegExp(this.regex)),
                data = {};

            if (!placeholders) {
                return data;
            }

            placeholders = placeholders.map(function (p) {
                return p.substring(1, p.length - 1);
            });

            values = values.filter(function (val) {
                return val !== url;
            });

            for (var i = 0, l = placeholders.length; i < l; i++) {
                data[placeholders[i]] = values[i];
            }

            return data;
        }
    }

});
namespace('Sy.AppState');

/**
 * Help build urls via a route definition
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.Router = function () {
    this.provider = null;
};
Sy.AppState.Router.prototype = Object.create(Object.prototype, {

    /**
     * Set the route provider
     *
     * @param {Sy.AppState.RouteProvider} provider
     *
     * @return {Sy.AppState.Router} self
     */

    setRouteProvider: {
        value: function (provider) {
            if (!(provider instanceof Sy.AppState.RouteProvider)) {
                throw new TypeError('Invalid route provider');
            }

            this.provider = provider;

            return this;
        }
    },

    /**
     * Generate a url
     *
     * @param {String} name Route name
     * @param {Object} variables
     *
     * @return {String}
     */

    generate: {
        value: function (name, variables) {
            if (!this.provider.hasRoute(name)) {
                throw new ReferenceError('Unknown route "' + name + '"');
            }

            var route = this.provider.getRoute(name),
                params = route.getParameters(),
                url = route.getPath();

            variables = variables || {};

            for (var name in params) {
                if (
                    params.hasOwnProperty(name) &&
                    !variables.hasOwnProperty(name)
                ) {
                    variables[name] = params[name];
                }
            }

            for (var name in variables) {
                if (variables.hasOwnProperty(name)) {
                    if (
                        route.hasRequirement(name) &&
                        !(new RegExp('^' + route.getRequirement(name) + '$')).test(variables[name])
                    ) {
                        throw new SyntaxError(
                            'Variable "' + name + '" doesn\'t fulfill its requirement ' +
                            'for the route "' + route.getName() + '"'
                        );
                    }
                    url = url.replace('{' + name + '}', variables[name]);
                }
            }

            return url;
        }
    }

});
namespace('Sy.AppState');

/**
 * Holds all the routes definitions
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.RouteProvider = function () {
    this.routes = null;
};
Sy.AppState.RouteProvider.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry to hold routes
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.AppState.RouteProvider} self
     */

    setRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.routes = registry;

            return this;
        }
    },

    /**
     * Set a route
     *
     * @param {String} name
     * @param {String} path
     * @param {Object} params Optional
     * @param {Object} requirements Optional
     *
     * @return {Sy.AppState.RouteProvider} self
     */

    setRoute: {
        value: function (name, path, params, requirements) {
            var route = new Sy.AppState.Route();

            route
                .setName(name)
                .setPath(path);

            if (typeof params === 'object') {
                route.setParameters(params);
            }

            if (typeof requirements === 'object') {
                route.setRequirements(requirements);
            }

            route.buildRegex();

            this.routes.set(name, route);

            return this;
        }
    },

    /**
     * Return a route via its name
     *
     * @param {String} name
     *
     * @return {Sy.AppState.Route}
     */

    getRoute: {
        value: function (name) {
            return this.routes.get(name);
        }
    },

    /**
     * Return all routes
     *
     * @return {Array}
     */

    getRoutes: {
        value: function () {
            return this.routes.get();
        }
    },

    /**
     * Check if a route name exist
     *
     * @param {String} name
     *
     * @return {Boolean}
     */

    hasRoute: {
        value: function (name) {
            return this.routes.has(name);
        }
    }

});
namespace('Sy.AppState');

/**
 * Entry point to handle the states mechanism
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.Core = function () {
    this.matcher = null;
    this.provider = null;
    this.generator = null;
    this.dispatcher = null;
    this.handler = null;
    this.currentState = null;
};
Sy.AppState.Core.prototype = Object.create(Object.prototype, {

    /**
     * Set the url matcher
     *
     * @param {Sy.AppState.UrlMatcher} matcher
     *
     * @return {Sy.AppState.Core} self
     */

    setUrlMatcher: {
        value: function (matcher) {
            if (!(matcher instanceof Sy.AppState.UrlMatcher)) {
                throw new TypeError('Invalid url matcher');
            }

            this.matcher = matcher;

            return this;
        }
    },

    /**
     * Set the route provider
     *
     * @param {Sy.AppState.RouteProvider} provider
     *
     * @return {Sy.AppState.Core} self
     */

    setRouteProvider: {
        value: function (provider) {
            if (!(provider instanceof Sy.AppState.RouteProvider)) {
                throw new TypeError('Invalid route provider');
            }

            this.provider = provider;

            return this;
        }
    },

    /**
     * Set a uuid generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.AppState.Core} self
     */

    setGenerator: {
        value: function (generator) {
            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = generator;

            return this;
        }
    },

    /**
     * Set the event dispatcher
     *
     * @param {Sy.EventDispatcher.EventDispatcherInterface} dispatcher
     *
     * @return {Sy.AppState.Core} self
     */

    setDispatcher: {
        value: function (dispatcher) {
            if (!(dispatcher instanceof Sy.EventDispatcher.EventDispatcherInterface)) {
                throw new TypeError('Invalid event dispatcher');
            }

            this.dispatcher = dispatcher;

            return this;
        }
    },

    /**
     * Set the state handler
     *
     * @param {Sy.AppState.StateHandler} handler
     *
     * @return {Sy.AppState.Core} self
     */

    setStateHandler: {
        value: function (handler) {
            if (!(handler instanceof Sy.AppState.StateHandler)) {
                throw new TypeError('Invalid state handler');
            }

            this.handler = handler;

            return this;
        }
    },

    /**
     * Init the url listener
     *
     * @return {Sy.AppState.Core} self
     */

    boot: {
        value: function () {
            try {
                if (history.state) {
                    this.currentState = this.handler
                        .getState(history.state.uuid);

                    if (!this.currentState) {
                        this.createState();
                    }
                } else {
                    this.createState();
                }

                this.dispatchEvent();
            } catch (error) {
                this.dispatchRouteNotFound();
            }

            window.addEventListener('popstate', this.listenPop.bind(this), false);

            return this;
        }
    },

    /**
     * Listen the pop state event
     *
     * @private
     * @param {PopStateEvent} event
     */

    listenPop: {
        value: function (event) {
            try {
                if (!event.state) {
                    this.createState();
                } else {
                    this.currentState = this.handler
                        .getState(event.state.uuid);

                    if (!this.currentState) {
                        this.createState();
                    }
                }

                this.dispatchEvent();
            } catch (error) {
                this.dispatchRouteNotFound();
            }
        }
    },

    /**
     * Dispatch the appstate event
     *
     * @private
     */

    dispatchEvent: {
        value: function () {
            var event = new Sy.AppState.AppStateEvent();

            event
                .setState(this.currentState)
                .setRoute(
                    this.provider
                        .getRoute(this.currentState.getRoute())
                );

            this.dispatcher.dispatch(event.KEY, event);
        }
    },

    /**
     * Dispatch an event saying no route is found for the current url
     *
     * @private
     */

    dispatchRouteNotFound: {
        value: function () {
            var event = new Sy.AppState.RouteNotFoundEvent();

            event.setUrl(this.getUrl());

            this.dispatcher.dispatch(event.KEY, event);
        }
    },

    /**
     * Create a new state and set it as the current one
     *
     * @private
     */

    createState: {
        value: function () {
            var url = this.getUrl(),
                route = this.matcher.match(url);

            this.currentState = this.handler.createState(
                this.generator.generate(),
                route.getName(),
                route.getVariables(url)
            );

            this.updateBrowserState();
        }
    },

    /**
     * Update the browser state object
     *
     * @private
     */

    updateBrowserState: {
        value: function () {
            history.replaceState(
                this.currentState.toJSON(),
                document.title
            );
        }
    },

    /**
     * Return the current url
     *
     * @return {String}
     */

    getUrl: {
        value: function () {
            return location.hash.substr(1) || '/';
        }
    },

    /**
     * Return the current state
     *
     * @return {Sy.AppState.State}
     */

    getCurrentState: {
        value: function () {
            return this.currentState;
        }
    }

});

namespace('Sy.AppState');

/**
 * Return the appropriate route corresponding to a url
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.UrlMatcher = function () {
    this.provider = null;
};
Sy.AppState.UrlMatcher.prototype = Object.create(Object.prototype, {

    /**
     * Set the route provider
     *
     * @param {Sy.AppState.RouteProvider} provider
     *
     * @return {Sy.AppState.UrlMatcher} self
     */

    setRouteProvider: {
        value: function (provider) {
            if (!(provider instanceof Sy.AppState.RouteProvider)) {
                throw new TypeError('Invalid route provider');
            }

            this.provider = provider;

            return this;
        }
    },

    /**
     * Return a route for the given url
     *
     * @param {String} url
     *
     * @return {Sy.AppState.Route}
     */

    match: {
        value: function (url) {
            var routes = this.provider.getRoutes(),
                route;

            for (var i = 0, l = routes.length; i < l; i++) {
                if (routes[i].matches(url)) {
                    route = routes[i];
                    break;
                }
            }

            if (!route) {
                throw new ReferenceError('No route found for the url "' + url + '"');
            }

            return route;
        }
    }

});
namespace('Sy.AppState');

/**
 * Represent a state of the app
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.State = function () {
    this.uuid = null;
    this.route = null;
    this.variables = {};
};
Sy.AppState.State.prototype = Object.create(Object.prototype, {

    /**
     * Set the state identifier
     *
     * @param {String} uuid
     *
     * @return {Sy.AppState.State} self
     */

    setUUID: {
        value: function (uuid) {
            this.uuid = uuid;

            return this;
        }
    },

    /**
     * Return the state identifier
     *
     * @return {String}
     */

    getUUID: {
        value: function () {
            return this.uuid;
        }
    },

    /**
     * Set the route name of the state
     *
     * @param {String} name
     *
     * @return {Sy.AppState.State} self
     */

    setRoute: {
        value: function (name) {
            this.route = name;

            return this;
        }
    },

    /**
     * Return the route name
     *
     * @return {String}
     */

    getRoute: {
        value: function () {
            return this.route;
        }
    },

    /**
     * Set the variables contained in the url
     *
     * @param {Object} variables
     *
     * @return {Sy.AppState.State} self
     */

    setVariables: {
        value: function (variables) {
            this.variables = variables;

            return this;
        }
    },

    /**
     * Return the variables
     *
     * @return {Object}
     */

    getVariables: {
        value: function () {
            return this.variables;
        }
    },

    /**
     * Return a raw representation of the state
     *
     * @return {Object}
     */

    toJSON: {
        value: function () {
            return {
                uuid: this.uuid,
                route: this.route,
                variables: this.variables
            };
        }
    }

});
namespace('Sy.AppState');

/**
 * Holds all the app states and handles saving/retrieval
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.StateHandler = function () {
    this.storage = localStorage;
    this.key = 'sy::history';
    this.states = [];

    this.loadStates();

    window.addEventListener(
        'beforeunload',
        this.saveHistory.bind(this),
        false
    );
};
Sy.AppState.StateHandler.prototype = Object.create(Object.prototype, {

    /**
     * Load all the states from the storage
     */

    loadStates: {
        value: function () {
            var states = this.storage.getItem(this.key);

            if (states) {
                states = JSON.parse(states);

                states.forEach(function (raw) {
                    this.states.push(
                        this.createState(
                            raw.uuid,
                            raw.route,
                            raw.variables
                        )
                    );
                }.bind(this));
            }
        }
    },

    /**
     * Create a new state
     *
     * @param {String} uuid
     * @param {String} route Route name
     * @param {Object} variables
     *
     * @return {Sy.AppState.State}
     */

    createState: {
        value: function (uuid, route, variables) {
            var state = new Sy.AppState.State();

            this.states.push(state);

            return state
                .setUUID(uuid)
                .setRoute(route)
                .setVariables(variables);
        }
    },

    /**
     * Retrieve the state for the given uuid
     *
     * @param {String} uuid
     *
     * @return {Sy.AppState.State}
     */

    getState: {
        value: function (uuid) {
            for (var i = 0, l = this.states.length; i < l; i++) {
                if (this.states[i].getUUID() === uuid) {
                    return this.states[i];
                }
            }
        }
    },

    /**
     * Save the history when page unload
     *
     * @private
     */

    saveHistory: {
        value: function () {
            this.storage.setItem(
                this.key,
                JSON.stringify(this.states.splice(0 - history.length))
            );
        }
    }

});
namespace('Sy.AppState');

/**
 * Event fired when the app state changes
 *
 * @package Sy
 * @subpackage AppState
 * @class
 * @extends {Sy.EventDispatcher.Event}
 */

Sy.AppState.AppStateEvent = function () {
    this.state = null;
    this.route = null;
};
Sy.AppState.AppStateEvent.prototype = Object.create(Sy.EventDispatcher.Event.prototype, {

    KEY: {
        value: 'appstate.change',
        writable: false
    },

    /**
     * Set the current app state
     *
     * @param {Sy.AppState.State} state
     *
     * @return {Sy.AppState.AppStateEvent} self
     */

    setState: {
        value: function (state) {
            if (!(state instanceof Sy.AppState.State)) {
                throw new TypeError('Invalid state object');
            }

            this.state = state;

            return this;
        }
    },

    /**
     * Return the current state
     *
     * @return {Sy.AppState.State}
     */

    getState: {
        value: function () {
            return this.state;
        }
    },

    /**
     * Set the route associated to the state
     *
     * @param {Sy.AppState.Route} route
     *
     * @return {Sy.AppState.AppStateEvent} self
     */

    setRoute: {
        value: function (route) {
            if (!(route instanceof Sy.AppState.Route)) {
                throw new TypeError('Invalid route');
            }

            this.route = route;

            return this;
        }
    },

    /**
     * Return the route
     *
     * @return {Sy.AppState.Route}
     */

    getRoute: {
        value: function () {
            return this.route;
        }
    }

});

namespace('Sy.AppState');

/**
 * Event fired the a new path is reached but no associated route found
 *
 * @package Sy
 * @subpackage AppState
 * @class
 * @extends {Sy.EventDispatcher.Event}
 */

Sy.AppState.RouteNotFoundEvent = function () {
    this.url = null;
};
Sy.AppState.RouteNotFoundEvent.prototype = Object.create(Sy.EventDispatcher.Event.prototype, {

    KEY: {
        value: 'appstate.routenotfound',
        writable: false
    },

    /**
     * Set the url
     *
     * @param {String} url
     *
     * @return {Sy.AppState.RouteNotFoundEvent} self
     */

    setUrl: {
        value: function (url) {
            this.url = url;

            return this;
        }
    },

    /**
     * Return the url
     *
     * @return {String}
     */

    getUrl: {
        value: function () {
            return this.url;
        }
    }

});

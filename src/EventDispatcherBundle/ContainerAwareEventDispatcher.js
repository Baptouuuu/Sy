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

    if (!(container instanceof Sy.ServiceContainer.Core)) {
        throw new TypeError('Invalid service container');
    }

    this.container = container;
    this.listenersIds = {};
    this.loaded = [];
};
Sy.EventDispatcherBundle.ContainerAwareEventDispatcher.prototype = Object.create(Sy.EventDispatcher.EventDispatcher.prototype, {

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
            return (!!this.listenersIds[name] && !!this.listenersIds[name].length) ||
                (!!this.listeners[name] && !!this.listeners[name].length);
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

            if (!this.hasListeners(name)) {
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

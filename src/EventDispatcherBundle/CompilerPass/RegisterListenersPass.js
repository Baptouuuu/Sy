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

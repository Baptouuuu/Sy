namespace('Sy.Kernel.CompilerPass');

/**
 * Pass that subscribe to registered event subscribers
 *
 * @package Sy
 * @subpackage Kernel
 * @class
 * @implements {Sy.ServiceContainer.CompilerPassInterface}
 */

Sy.Kernel.CompilerPass.EventSubscriberPass = function () {};
Sy.Kernel.CompilerPass.EventSubscriberPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {

    /**
     * @inheritDoc
     */

    process: {
        value: function (container) {
            var mediator = container.get('sy::core::mediator');

            container
                .findTaggedServiceIds('event.subscriber')
                .forEach(function (el) {
                    var subscriber = container.get(el.id),
                        events;

                    if (!(subscriber instanceof Sy.EventSubscriberInterface)) {
                        throw new TypeError('Invalid event subscriber');
                    }

                    events = subscriber.getSubscribedEvents();

                    for (var evt in events) {
                        if (events.hasOwnProperty(evt)) {
                            mediator.subscribe({
                                channel: evt,
                                fn: subscriber[events[evt].method],
                                context: subscriber,
                                priority: subscriber[events[evt].priority],
                                async: subscriber[events[evt].async]
                            });
                        }
                    }

                }, this);
        }
    }

});

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

namespace('Sy');

/**
 * Interface to define required method for event subscribers
 *
 * @package Sy
 * @interface
 */

Sy.EventSubscriberInterface = function () {};
Sy.EventSubscriberInterface.prototype = Object.create(Object.prototype, {

    /**
     * Return an object of events that the object subscribed to
     * <code>
     * {
     *     'channel name': {
     *         method: 'function name in the object', //required
     *         priority: 'integer', //optional
     *         async: 'boolean' //optional
     *     }
     * }
     * </code>
     *
     * @return {Object}
     */

    getSubscribedEvents: {
        value: function () {}
    }

});

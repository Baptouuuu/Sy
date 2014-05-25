namespace('Sy.Event');

/**
 * Event fired when the window is closed, used to properly shutdown the app
 *
 * @package Sy
 * @subpackage Event
 * @class
 */
Sy.Event.AppShutdownEvent = function (originalEvent) {
    if (!(originalEvent instanceof BeforeUnloadEvent)) {
        throw new TypeError('Invalid unload event');
    }

    this.originalEvent = originalEvent;
};
Sy.Event.AppShutdownEvent.prototype = Object.create(Object.prototype, {

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

namespace('Sy.Event');

/**
 * Event fired before and after an action is fired on a controller
 *
 * @package Sy
 * @subpackage Event
 * @class
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
Sy.Event.ControllerEvent.prototype = Object.create(Object.prototype, {

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

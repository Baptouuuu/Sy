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

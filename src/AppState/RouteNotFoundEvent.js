namespace('Sy.AppState');

/**
 * Event fired the a new path is reached but no associated route found
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.RouteNotFoundEvent = function () {
    this.url = null;
};
Sy.AppState.RouteNotFoundEvent.prototype = Object.create(Object.prototype, {

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
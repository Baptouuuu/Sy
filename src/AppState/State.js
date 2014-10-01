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
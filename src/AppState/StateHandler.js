namespace('Sy.AppState');

/**
 * Holds all the app states and handles saving/retrieval
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.StateHandler = function () {
    this.storage = localStorage;
    this.key = 'sy::history';
    this.states = [];

    this.loadStates();

    window.addEventListener(
        'beforeunload',
        this.saveHistory.bind(this),
        false
    );
};
Sy.AppState.StateHandler.prototype = Object.create(Object.prototype, {

    /**
     * Load all the states from the storage
     */

    loadStates: {
        value: function () {
            var states = this.storage.getItem(this.key);

            if (states) {
                states = JSON.parse(states);

                states.forEach(function (raw) {
                    this.states.push(
                        this.createState(
                            raw.uuid,
                            raw.route,
                            raw.variables
                        )
                    );
                }.bind(this));
            }
        }
    },

    /**
     * Create a new state
     *
     * @param {String} uuid
     * @param {String} route Route name
     * @param {Object} variables
     *
     * @return {Sy.AppState.State}
     */

    createState: {
        value: function (uuid, route, variables) {
            var state = new Sy.AppState.State();

            this.states.push(state);

            return state
                .setUUID(uuid)
                .setRoute(route)
                .setVariables(variables);
        }
    },

    /**
     * Retrieve the state for the given uuid
     *
     * @param {String} uuid
     *
     * @return {Sy.AppState.State}
     */

    getState: {
        value: function (uuid) {
            for (var i = 0, l = this.states.length; i < l; i++) {
                if (this.states[i].getUUID() === uuid) {
                    return this.states[i];
                }
            }
        }
    },

    /**
     * Save the history when page unload
     *
     * @private
     */

    saveHistory: {
        value: function () {
            this.storage.setItem(
                this.key,
                JSON.stringify(this.states)
            );
        }
    }

});
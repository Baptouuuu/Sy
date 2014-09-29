namespace('Sy.AppState');

/**
 * Entry point to handle the states mechanism
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.Core = function () {
    this.matcher = null;
    this.provider = null;
    this.generator = null;
    this.mediator = null;
    this.currentState = null;
    this.history = [];
    this.storageKey = 'sy::history';
};
Sy.AppState.Core.prototype = Object.create(Object.prototype, {

    /**
     * Set the url matcher
     *
     * @param {Sy.AppState.UrlMatcher} matcher
     *
     * @return {Sy.AppState.Core} self
     */

    setUrlMatcher: {
        value: function (matcher) {
            if (!(matcher instanceof Sy.AppState.UrlMatcher)) {
                throw new TypeError('Invalid url matcher');
            }

            this.matcher = matcher;

            return this;
        }
    },

    /**
     * Set the route provider
     *
     * @param {Sy.AppState.RouteProvider} provider
     *
     * @return {Sy.AppState.Core} self
     */

    setRouteProvider: {
        value: function (provider) {
            if (!(provider instanceof Sy.AppState.RouteProvider)) {
                throw new TypeError('Invalid route provider');
            }

            this.provider = provider;

            return this;
        }
    },

    /**
     * Set a uuid generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.AppState.Core} self
     */

    setGenerator: {
        value: function (generator) {
            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = generator;

            return this;
        }
    },

    /**
     * Set te mediator
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.AppState.Core} self
     */

    setMediator: {
        value: function (mediator) {
            if (!(mediator instanceof Sy.Lib.Mediator)) {
                throw new TypeError('Invalid mediator');
            }

            this.mediator = mediator;

            return this;
        }
    },

    /**
     * Init the url listener
     *
     * @return {Sy.AppState.Core} self
     */

    boot: {
        value: function () {
            if (localStorage.getItem(this.storageKey)) {
                this.history = JSON.parse(localStorage.getItem(this.storageKey))
                    .map(function (el) {
                        var state = new Sy.AppState.State();

                        return state
                            .setUUID(el.uuid)
                            .setRoute(el.route)
                            .setVariables(el.variables);
                    });
            }

            if (history.state) {
                this.retrieveCurrentState(history.state.uuid);
            } else {
                this.createNewState();
            }

            window.addEventListener('popstate', this.listenPop.bind(this), false);
            window.addEventListener('beforeunload', this.saveHistory.bind(this), false);

            return this;
        }
    },

    /**
     * Listen the pop state event
     *
     * @param {PopStateEvent} event
     */

    listenPop: {
        value: function (event) {
            if (!event.state) {
                this.createNewState();
            } else {
                this.retrieveCurrentState(event.state.uuid);
            }

            var event = new Sy.AppState.AppStateEvent();

            event
                .setState(this.currentState)
                .setRoute(
                    this.provider
                        .getRoute(this.currentState.getRoute())
                );

            this.mediator.publish(event.KEY, event);
        }
    },

    /**
     * Add a new appstate
     */

    createNewState: {
        value: function () {
            var uuid = this.generator.generate(),
                url = location.hash.substr(1) || '/',
                routes = this.provider.getRoutes(),
                state = new Sy.AppState.State(),
                route = this.matcher.match(url);

            state
                .setUUID(uuid)
                .setRoute(route.getName())
                .setVariables(route.getVariables(url));

            this.history.push(state);

            this.currentState = state;

            history.replaceState(
                state.toJSON(),
                document.title,
                location.toString()
            );
        }
    },

    /**
     * Look in the history for the state for the given identifier
     *
     * @param {String} uuid
     */

    retrieveCurrentState: {
        value: function (uuid) {
            for (var i = 0, l = this.history.length; i < l; i++) {
                if (this.history[i].getUUID() === uuid) {
                    this.currentState = this.history[i];
                    break;
                }
            }
        }
    },

    /**
     * Persist the history to localStorage
     */

    saveHistory: {
        value: function () {
            localStorage.setItem(
                this.storageKey,
                JSON.stringify(this.history)
            );
        }
    },

    /**
     * Return the current state
     *
     * @return {Sy.AppState.State}
     */

    getCurrentState: {
        value: function () {
            return this.currentState;
        }
    }

});
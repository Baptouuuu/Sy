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
    this.handler = null;
    this.currentState = null;
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
     * Set the state handler
     *
     * @param {Sy.AppState.StateHandler} handler
     *
     * @return {Sy.AppState.Core} self
     */

    setStateHandler: {
        value: function (handler) {
            if (!(handler instanceof Sy.AppState.StateHandler)) {
                throw new TypeError('Invalid state handler');
            }

            this.handler = handler;

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
            if (history.state) {
                this.currentState = this.handler
                    .getState(history.state.uuid);
            } else {
                this.createState();
            }

            window.addEventListener('popstate', this.listenPop.bind(this), false);

            return this;
        }
    },

    /**
     * Listen the pop state event
     *
     * @private
     * @param {PopStateEvent} event
     */

    listenPop: {
        value: function (event) {
            if (!event.state) {
                this.createState();
            } else {
                this.currentState = this.handler
                    .getState(event.state.uuid);
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
     * Create a new state and set it as the current one
     *
     * @private
     */

    createState: {
        value: function () {
            var url = this.getUrl(),
                route = this.matcher.match(url);

            this.currentState = this.handler.createState(
                this.generator.generate(),
                route.getName(),
                route.getVariables(url)
            );

            this.updateBrowserState();
        }
    },

    /**
     * Update the browser state object
     *
     * @private
     */

    updateBrowserState: {
        value: function () {
            history.replaceState(
                this.currentState.toJSON(),
                document.title
            );
        }
    },

    /**
     * Return the current url
     *
     * @return {String}
     */

    getUrl: {
        value: function () {
            return location.hash.substr(1) || '/';
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
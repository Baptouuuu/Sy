namespace('Sy.AppState');

/**
 * Help build urls via a route definition
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.Router = function () {
    this.provider = null;
};
Sy.AppState.Router.prototype = Object.create(Object.prototype, {

    /**
     * Set the route provider
     *
     * @param {Sy.AppState.RouteProvider} provider
     *
     * @return {Sy.AppState.Router} self
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
     * Generate a url
     *
     * @param {String} name Route name
     * @param {Object} variables
     *
     * @return {String}
     */

    generate: {
        value: function (name, variables) {
            if (!this.provider.hasRoute(name)) {
                throw new ReferenceError('Unknown route "' + name + '"');
            }

            var route = this.provider.getRoute(name),
                params = route.getParameters(),
                url = route.getPath();

            variables = variables || {};

            for (var name in params) {
                if (
                    params.hasOwnProperty(name) &&
                    !variables.hasOwnProperty(name)
                ) {
                    variables[name] = params[name];
                }
            }

            for (var name in variables) {
                if (variables.hasOwnProperty(name)) {
                    if (
                        route.hasRequirement(name) &&
                        !(new RegExp('^' + route.getRequirement(name) + '$')).test(variables[name])
                    ) {
                        throw new SyntaxError(
                            'Variable "' + name + '" doesn\'t fulfill its requirement ' +
                            'for the route "' + route.getName() + '"'
                        );
                    }
                    url = url.replace('{' + name + '}', variables[name]);
                }
            }

            return url;
        }
    }

});
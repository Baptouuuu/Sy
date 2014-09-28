namespace('Sy.AppState');

/**
 * Holds all the routes definitions
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.RouteProvider = function () {
    this.routes = null;
};
Sy.AppState.RouteProvider.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry to hold routes
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.AppState.RouteProvider} self
     */

    setRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.routes = registry;

            return this;
        }
    },

    /**
     * Set a route
     *
     * @param {String} name
     * @param {String} path
     * @param {Object} params Optional
     * @param {Object} requirements Optional
     *
     * @return {Sy.AppState.RouteProvider} self
     */

    setRoute: {
        value: function (name, path, params, requirements) {
            var route = new Sy.AppState.Route();

            route
                .setName(name)
                .setPath(path);

            if (typeof params === 'object') {
                route.setParameters(params);
            }

            if (typeof requirements === 'object') {
                route.setRequirements(requirements);
            }

            this.routes.set(name, route);

            return this;
        }
    },

    /**
     * Return a route via its name
     *
     * @param {String} name
     *
     * @return {Sy.AppState.Route}
     */

    getRoute: {
        value: function (name) {
            return this.routes.get(name);
        }
    }

});
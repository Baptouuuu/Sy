namespace('Sy.AppState');

/**
 * Return the appropriate route corresponding to a url
 *
 * @package Sy
 * @subpackage AppState
 * @class
 */

Sy.AppState.UrlMatcher = function () {
    this.provider = null;
};
Sy.AppState.UrlMatcher.prototype = Object.create(Object.prototype, {

    /**
     * Set the route provider
     *
     * @param {Sy.AppState.RouteProvider} provider
     *
     * @return {Sy.AppState.UrlMatcher} self
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
     * Return a route for the given url
     *
     * @param {String} url
     *
     * @return {Sy.AppState.Route}
     */

    match: {
        value: function (url) {
            var routes = this.provider.getRoutes(),
                route;

            for (var i = 0, l = routes.length; i < l; i++) {
                if (routes[i].matches(url)) {
                    route = routes[i];
                    break;
                }
            }

            if (!route) {
                throw new ReferenceError('No route found for the url "' + url + '"');
            }

            return route;
        }
    }

});
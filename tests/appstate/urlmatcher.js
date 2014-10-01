/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/AppState/Route.js
 * @venus-include ../../src/AppState/RouteProvider.js
 * @venus-code ../../src/AppState/UrlMatcher.js
 */

describe('appstate router', function () {
    var m;

    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    beforeEach(function () {
        var p = new Sy.AppState.RouteProvider();

        m = new Sy.AppState.UrlMatcher();
        p.setRegistry(new Sy.Registry());
        p.setRoute('foo', '/foo');
        m.setRouteProvider(p);
    });

    it('should throw if no route found', function () {
        expect(function () {
            m.match('/unknown');
        }).toThrow('No route found for the url "/unknown"');
    });

    it('should return a route for the given url', function () {
        expect(m.match('/foo') instanceof Sy.AppState.Route).toBe(true);
        expect(m.match('/foo').getName()).toEqual('foo');
    });
});
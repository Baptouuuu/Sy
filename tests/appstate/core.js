/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/Lib/Generator/Interface.js
 * @venus-include ../../src/Lib/Generator/UUID.js
 * @venus-include ../../src/Lib/Mediator.js
 * @venus-include ../../src/AppState/UrlMatcher.js
 * @venus-include ../../src/AppState/RouteProvider.js
 * @venus-include ../../src/AppState/AppStateEvent.js
 * @venus-include ../../src/AppState/State.js
 * @venus-include ../../src/AppState/Route.js
 * @venus-code ../../src/AppState/Core.js
 */

describe('appstate core', function () {
    var c, p, m, um;

    beforeEach(function () {
        c = new Sy.AppState.Core();
        p = new Sy.AppState.RouteProvider();
        m = new Sy.Lib.Mediator();
        um = new Sy.AppState.UrlMatcher();

        p.setRegistry(new Sy.Registry());

        um.setRouteProvider(p);

        c.setRouteProvider(p);
        c.setMediator(m);
        c.setUrlMatcher(um);
    });

    it('should throw if trying to set invalid url matcher', function () {
        expect(function () {
            c.setUrlMatcher({});
        }).toThrow('Invalid url matcher');
    });

    it('should set the url matcher', function () {
        expect(c.setUrlMatcher(um)).toBe(c);
    });

    it('should throw if trying to set invalid route provider', function () {
        expect(function () {
            c.setRouteProvider({});
        }).toThrow('Invalid route provider');
    });

    it('should set the route provider', function () {
        expect(c.setRouteProvider(p)).toBe(c);
    });

    it('should throw if trying to set invalid mediator', function () {
        expect(function () {
            c.setMediator({});
        }).toThrow('Invalid mediator');
    });

    it('should set the mediator', function () {
        expect(c.setMediator(m)).toBe(c);
    });
});
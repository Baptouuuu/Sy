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
 * @venus-include ../../src/AppState/StateHandler.js
 * @venus-include ../../src/AppState/Route.js
 * @venus-code ../../src/AppState/Core.js
 */

describe('appstate core', function () {
    var c, p, m, um, sh, g;

    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    beforeEach(function () {
        c = new Sy.AppState.Core();
        p = new Sy.AppState.RouteProvider();
        m = new Sy.Lib.Mediator();
        um = new Sy.AppState.UrlMatcher();
        sh = new Sy.AppState.StateHandler();
        g = new Sy.Lib.Generator.UUID();

        p.setRegistry(new Sy.Registry());

        um.setRouteProvider(p);

        c.setRouteProvider(p);
        c.setMediator(m);
        c.setUrlMatcher(um);
        c.setStateHandler(sh);
        c.setGenerator(g);
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

    it('should throw if trying to set invalid generator', function () {
        expect(function () {
            c.setGenerator({});
        }).toThrow('Invalid generator');
    });

    it('should set the generator', function () {
        expect(c.setGenerator(g)).toBe(c);
    });

    it('should throw if trying to set invalid mediator', function () {
        expect(function () {
            c.setMediator({});
        }).toThrow('Invalid mediator');
    });

    it('should set the mediator', function () {
        expect(c.setMediator(m)).toBe(c);
    });

    it('should throw if trying to set invalid state handler', function () {
        expect(function () {
            c.setStateHandler({});
        }).toThrow('Invalid state handler');
    });

    it('should set the state handler', function () {
        expect(c.setStateHandler(sh)).toBe(c);
    });

    it('should load the current state when booting the engine', function () {
        p.setRoute('home', '/');

        expect(c.boot()).toBe(c);
        expect(c.getCurrentState() instanceof Sy.AppState.State).toBe(true);
        expect(sh.getState(c.getCurrentState().getUUID()) instanceof Sy.AppState.State).toBe(true);
    });

    it('should return the current url', function () {
        expect(c.getUrl()).toEqual('/');

        location.hash = '/foo';

        expect(c.getUrl()).toEqual('/foo');
    });
});
/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/AppState/State.js
 * @venus-include ../../src/AppState/Route.js
 * @venus-include ../../src/EventDispatcher/Event.js
 * @venus-code ../../src/AppState/AppStateEvent.js
 */

describe('appstate appstateevent', function () {
    var e;

    beforeEach(function () {
        e = new Sy.AppState.AppStateEvent();
    });

    it('should throw if trying to set invalid state', function () {
        expect(function () {
            e.setState({});
        }).toThrow('Invalid state object');
    });

    it('should set the state', function () {
        var s = new Sy.AppState.State();

        expect(e.setState(s)).toBe(e);
        expect(e.getState()).toBe(s);
    });

    it('should throw if trying to set invalid route', function () {
        expect(function () {
            e.setRoute({});
        }).toThrow('Invalid route');
    });

    it('should set the route', function () {
        var r = new Sy.AppState.Route();

        expect(e.setRoute(r)).toBe(e);
        expect(e.getRoute()).toBe(r);
    });
});

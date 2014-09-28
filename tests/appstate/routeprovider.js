/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/AppState/Route.js
 * @venus-code ../../src/AppState/RouteProvider.js
 */

describe('appstate route provider', function () {
    var p;

    beforeEach(function () {
        p = new Sy.AppState.RouteProvider();
    });

    it('should set the registry', function () {
        expect(p.setRegistry(new Sy.Registry())).toBe(p);
    });

    it('should set a route', function () {
        p.setRegistry(new Sy.Registry());

        expect(p.setRoute('foo', '/foo')).toBe(p);
        expect(p.getRoute('foo') instanceof Sy.AppState.Route).toBe(true);

        expect(p.setRoute('bar', '/bar', {_viewscreen: 'foo'})).toBe(p);
        expect(p.getRoute('bar') instanceof Sy.AppState.Route).toBe(true);

        expect(p.setRoute('baz', '/{baz}', undefined, {baz: '\\d+'})).toBe(p);
        expect(p.getRoute('baz') instanceof Sy.AppState.Route).toBe(true);
    });

    it('should return all routes', function () {
        p.setRegistry(new Sy.Registry());
        p.setRoute('foo', '/foo');

        expect(p.getRoutes() instanceof Array).toBe(true);
        expect(p.getRoutes().length).toEqual(1);
    });
});

/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/AppState/Route.js
 * @venus-include ../../src/AppState/RouteProvider.js
 * @venus-code ../../src/AppState/Router.js
 */

describe('appstate router', function () {
    var r;

    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    beforeEach(function () {
        var p = new Sy.AppState.RouteProvider();

        r = new Sy.AppState.Router();
        p.setRegistry(new Sy.Registry());
        p.setRoute('foo', '/foo');
        p.setRoute('bar', '/{bar}', {bar: 'baz'});
        p.setRoute('baz', '/{baz}', undefined,  {baz: '\\d{2}'});
        r.setRouteProvider(p);
    });

    it('should generate a url', function () {
        expect(r.generate('foo')).toEqual('/foo');
        expect(r.generate('bar')).toEqual('/baz');
        expect(r.generate('bar', {bar: 'foo'})).toEqual('/foo');
        expect(r.generate('baz', {baz: 42})).toEqual('/42');
    });

    it('should throw if a requirement is not fulfilled', function () {
        expect(function () {
            r.generate('baz', {baz: 'bar'});
        }).toThrow('Variable "baz" doesn\'t fulfill its requirement for the route "baz"');
    });
});
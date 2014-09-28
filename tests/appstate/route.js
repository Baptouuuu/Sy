/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-code ../../src/AppState/Route.js
 */

describe('appstate route', function () {
    var r;

    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    beforeEach(function () {
        r = new Sy.AppState.Route();
    });

    it('should set the name', function () {
        expect(r.setName('foo')).toBe(r);
        expect(r.getName()).toEqual('foo');
    });

    it('should set the path', function () {
        expect(r.setPath('/foo')).toBe(r);
        expect(r.getPath()).toEqual('/foo');
    });

    it('should set the parameters', function () {
        var p = {_viewscreen: 'foo'};

        expect(r.setParameters(p)).toBe(r);
        expect(r.getParameters()).toBe(p);
    });

    it('should prevent parameters from being overriden', function () {
        var p = {_viewscreen: 'foo'},
            p2 = {_viewscreen: 'bar'};

        r.setParameters(p);
        r.setParameters(p2);
        expect(r.getParameters()).toBe(p);
    });

    it('should set the requirements', function () {
        var p = {d: 'foo'};

        expect(r.setRequirements(p)).toBe(r);
        expect(r.getRequirements()).toBe(p);
    });

    it('should prevent requirements from being overriden', function () {
        var p = {d: 'foo'},
            p2 = {d: 'bar'};

        r.setRequirements(p);
        r.setRequirements(p2);
        expect(r.getRequirements()).toBe(p);
    });

    it('should return a requirement', function () {
        r.setRequirements({d: 'foo'});
        expect(r.getRequirement('d')).toEqual('foo');
    });

    it('should say a requirement is set', function () {
        r.setRequirements({d: 'foo'});
        expect(r.hasRequirement('d')).toBe(true);
    });

    it('should say it doesn\'t match a url', function () {
        r.setPath('/foo');
        r.buildRegex();

        expect(r.matches('/bar')).toBe(false);
    });

    it('should say it matches a url', function () {
        r.setPath('/foo');
        r.buildRegex();

        expect(r.matches('/foo')).toBe(true);
    });

    it('should say it doesn\'t match a url with parameters', function () {
        r.setPath('/foo/{bar}/{baz}');
        r.buildRegex();

        expect(r.matches('/foo/bar/')).toBe(false);
    });

    it('should say it matches a url with parameters', function () {
        r.setPath('/foo/{bar}/{baz}');
        r.buildRegex();

        expect(r.matches('/foo/bar/baz')).toBe(true);
    });

    it('should say it doesn\'t match a url with parameters and requirements', function () {
        r.setPath('/foo/{bar}/{baz}');
        r.setRequirements({bar: '\d+'});
        r.buildRegex();

        expect(r.matches('/foo/bar/baz')).toBe(false);
    });

    it('should say it matches a url with parameters and requirements', function () {
        r.setPath('/foo/{bar}/{baz}');
        r.setRequirements({bar: '\\d+'});
        r.buildRegex();

        expect(r.matches('/foo/42/baz')).toBe(true);
    });
});
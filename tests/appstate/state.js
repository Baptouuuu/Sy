/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-code ../../src/AppState/State.js
 */

describe('appstate state', function () {
    var s;

    beforeEach(function () {
        s = new Sy.AppState.State();
    });

    it('should set a uuid', function () {
        expect(s.setUUID('foo')).toBe(s);
        expect(s.getUUID()).toEqual('foo');
    });

    it('should set the route name', function () {
        expect(s.setRoute('foo')).toBe(s);
        expect(s.getRoute()).toEqual('foo');
    });

    it('should set the variables object', function () {
        var v = {foo: 'bar'};

        expect(s.setVariables(v)).toBe(s);
        expect(s.getVariables()).toBe(v);
    });

    it('should return a raw representation of the state', function () {
        s
            .setUUID('uuid')
            .setRoute('foo')
            .setVariables({});

        expect(s.toJSON()).toEqual({
            uuid: 'uuid',
            route: 'foo',
            variables: {}
        });
        expect(JSON.stringify(s)).toEqual('{"uuid":"uuid","route":"foo","variables":{}}');
    });
});
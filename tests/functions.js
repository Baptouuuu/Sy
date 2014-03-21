/**
 * @venus-library jasmine
 * @venus-code ../src/functions.js
 */

describe('functions', function () {

    it('should create two sub-objects of window', function () {

        namespace('Foo.Bar');

        expect(window.Foo).not.toBe(undefined);
        expect(window.Foo.Bar).not.toBe(undefined);

        delete window.Foo;

    });

    it('should create two sub-objects of own object', function () {

        var custom = {};

        namespace.call(custom, 'Foo.Bar');

        expect(custom.Foo).not.toBe(undefined);
        expect(custom.Foo.Bar).not.toBe(undefined);

    });

    it('should return nested value', function () {
        var obj = {
            foo: {
                bar: {
                    baz: 'foobar'
                }
            }
        };

        expect(objectGetter.call(obj, 'foo.bar.baz')).toEqual('foobar');
    });

    it('should return undefined in case of unknown path', function () {
        var obj = {};

        expect(objectGetter.call(obj, 'foo.bar')).toEqual(undefined);
    });

    it('should set a nested value', function () {
        var obj = {};

        objectSetter.call(obj, 'foo.bar.baz', 'foobar');

        expect(obj.foo.bar.baz).toEqual('foobar');
    });

});
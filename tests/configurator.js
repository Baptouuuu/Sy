/**
 * @venus-library jasmine
 * @venus-include ../vendor/underscore/underscore.js
 * @venus-include ../vendor/Reflection.js/reflection.js
 * @venus-include ../src/functions.js
 * @venus-include ../src/PropertyAccessor.js
 * @venus-include ../src/ConfiguratorInterface.js
 * @venus-code ../src/Configurator.js
 */

describe('configurator', function () {

    var c;

    beforeEach(function () {
        c = new Sy.Configurator();
    });

    it('should set a value', function () {
        expect(c.set('foo.bar.baz', 'bar')).toEqual(c);
        expect(c.has('foo.bar.baz')).toBe(true);
        expect(c.get('foo.bar.baz')).toEqual('bar');
    });

    it('should set the global object', function () {
        expect(c.set({foo: 'bar', baz: 'foobar'})).toEqual(c);
        expect(c.has('foo')).toBe(true);
        expect(c.has('baz')).toBe(true);
        expect(c.get('foo')).toEqual('bar');
        expect(c.get('baz')).toEqual('foobar');
    });

});

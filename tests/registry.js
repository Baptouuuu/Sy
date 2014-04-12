/**
 * @venus-library jasmine
 * @venus-include ../src/functions.js
 * @venus-include ../src/RegistryInterface.js
 * @venus-code ../src/Registry.js
 */

describe('registry', function () {

    it('should set an element', function () {

        var r = new Sy.Registry();

        r.set('foo', 'bar');

        expect(r.has('foo')).toBe(true);

    });

    it('should get an element', function () {

        var r = new Sy.Registry();

        r.set('foo', 'bar');

        expect(r.get('foo')).toEqual('bar');

    });

    it('should return that the element is set', function () {

        var r = new Sy.Registry();

        r.set('foo', 'bar');

        expect(r.has('foo')).toBe(true);

    });

    it('should return that the element is not set', function () {

        var r = new Sy.Registry();

        r.set('foo', 'bar');

        expect(r.has('bar')).toBe(false);

    });

    it('should remove an element', function () {

        var r = new Sy.Registry();

        r.set('foo', 'bar');
        r.set('bar', 'baz');

        r.remove('foo');

        expect(r.has('bar')).toBe(true);

    });

    it('should remove elements set', function () {

        var r = new Sy.Registry();

        r.set('foo', 'bar');
        r.set('bar', 'baz');

        r.remove(['foo']);

        expect(r.has('bar')).toBe(true);

    });

    it('should remove all elements', function () {

        var r = new Sy.Registry();

        r.set('foo', 'bar');
        r.set('bar', 'baz');

        r.remove();

        expect(r.has('foo')).toBe(false);
        expect(r.has('bar')).toBe(false);

    });

    it('should return the length of the registry', function () {
        var r = new Sy.Registry();

        expect(r.length()).toEqual(0);

        r.set('foo', 'bar');

        expect(r.length()).toEqual(1);

        r.remove('foo');

        expect(r.length()).toEqual(0);
    });

});
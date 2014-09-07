/**
 * @venus-library jasmine
 * @venus-include ../src/functions.js
 * @venus-include ../src/EntityInterface.js
 * @venus-code ../src/Entity.js
 */

describe('entity', function () {

    it('should set an attribute', function () {

        var e = new Sy.Entity();

        e.set('foo', 'bar');

        expect(e.get('foo')).toEqual('bar');

    });

    it('should initialize the entity with the given data object', function () {
        var e = new Sy.Entity();
        e.set({
            foo: 'bar',
            bar: 'baz'
        });

        expect(e.get('foo')).toEqual('bar');
        expect(e.get('bar')).toEqual('baz');
    });

    it('should return itself', function () {

        var e = new Sy.Entity();

        expect(e.set('foo', 'bar')).toEqual(e);

    });

});
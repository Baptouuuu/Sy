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

    it('should lock the entity properties', function () {

        var f = function () {
                Sy.Entity.call(this);
            },
            e;

        f.prototype = Object.create(Sy.Entity.prototype);

        e = new f();

        e.lock(['foo', 'bar']);

        expect(Object.isSealed(e.attributes)).toBe(true);

    });

    it('should prevent a property to be set when entity locked', function () {

        var f = function () {
                Sy.Entity.call(this);
            },
            e;

        f.prototype = Object.create(Sy.Entity.prototype);

        e = new f();

        e.lock(['foo', 'bar']);
        e.set('baz', 'baz');

        expect(e.get('baz')).toEqual(undefined);

    });

    it('should throw if locking without specifying wrong attributes list', function () {
        expect(function () {
            var e = new Sy.Entity();
            e.lock('foo');
        }).toThrow();
    });

    it('should not change the locked attributes', function () {
        var e = new Sy.Entity();

        e.lock(['foo']);
        e.lock(['bar']);
        e.set('foo', 'foo');
        e.set('bar', 'bar');

        expect(e.get('foo')).toEqual('foo');
        expect(e.get('bar')).toEqual(undefined);
    });

    it('should return all attributes', function () {
        var e = new Sy.Entity();
        e.set('foo', 'bar');

        expect(e.get()).toEqual({foo: 'bar'});
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
        expect(e.lock(['foo'])).toEqual(e);

    });

});
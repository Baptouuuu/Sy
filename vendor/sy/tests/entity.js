/**
 * @venus-library jasmine
 * @venus-include ../src/functions.js
 * @venus-include ../src/EntityInterface.js
 * @venus-include ../src/Entity.js
 */

describe('entity', function () {

    it('should set an attribute', function () {

        var e = new Sy.Entity();

        e.set('foo', 'bar');

        expect(e.get('foo')).toEqual('bar');

    });

    it('should register a new index', function () {

        var e = new Sy.Entity();

        e.register('foo');

        expect(e.indexes.indexOf('foo')).not.toEqual(-1);

    });

    it('should register a connection to another entity', function () {

        var e = new Sy.Entity();

        namespace('App.Bundle.Foo.Entity');

        App.Bundle.Foo.Entity.Bar = function () {};
        App.Bundle.Foo.Entity.Bar.prototype = Object.create(Sy.Entity.prototype);

        e.register('foobar', 'Foo::Bar');

        expect(e.indexes.indexOf('foo')).not.toEqual(-1);
        expect(e.connections.foobar).toEqual(App.Bundle.Foo.Entity.Bar);

    });

    it('should throw an error when entity relation alias name format is invalid', function () {

        var e = new Sy.Entity();

        expect(function () {
            e.register('foobaz', 'invalidFormat');
        }).toThrow('Invalid entity name format');

    });

    it('should lock the entity properties', function () {

        var f = function () {},
            e;

        f.prototype = Object.create(Sy.Entity.prototype);

        e = new f();

        e.lock(['foo', 'bar']);

        expect(e.lockedAttributes).toEqual(['uuid', 'foo', 'bar']);

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

    it('should return a plain object of entity data', function () {

        var e = new Sy.Entity();

        e.set('uuid', 'foo');
        e.set('foo', 'bar');

        expect(e.getRaw()).toEqual({uuid: 'foo', foo: 'bar'});

    });

    it('should return itself', function () {

        var e = new Sy.Entity();

        expect(e.set('foo', 'bar')).toEqual(e);
        expect(e.register('foo')).toEqual(e);
        expect(e.lock(['foo'])).toEqual(e);

    });

});
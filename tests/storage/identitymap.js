/**
 * @venus-library jasmine
 * @venus-include ../../vendor/Reflection.js/reflection.min.js
 * @venus-include ../../src/functions.js
 * @venus-code ../../src/Storage/IdentityMap.js
 */

describe('storage identity map', function () {
    var entity = function () {},
        im;

    beforeEach(function () {
        im = new Sy.Storage.IdentityMap();
    });

    it('should set a definition', function () {
        expect(im.set('foo', function () {})).toEqual(im);
        expect(im.hasAlias('foo')).toBe(true);
    });

    it('should lock the map', function () {
        im.lock();
        im.set('foo', function () {});
        expect(im.hasAlias('foo')).toBe(false);
    });

    it('should say the entity is defined', function () {
        im.set('foo', entity);

        expect(im.hasEntity(new entity())).toBe(true);
    });

    it('should return the alias of the entity', function () {
        im.set('foo', entity);

        expect(im.getAlias(new entity())).toEqual('foo');
    });

    it('should return the entity constructor', function () {
        im.set('foo', entity);

        expect(im.getConstructor('foo')).toEqual(entity);
    });

    it('should return the entity key', function () {
        im.set('foo', entity, 'bar');
        expect(im.getKey('foo')).toEqual('bar');
    });
});

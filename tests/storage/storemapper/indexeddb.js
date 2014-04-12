/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Storage/StoreMapperInterface.js
 * @venus-code ../../../src/Storage/StoreMapper/IndexedDBMapper.js
 */

describe('storage store mapper indexeddb', function () {

    var mapper = new Sy.Storage.StoreMapper.IndexedDBMapper();

    it('should return a valid store metadata', function () {
        var meta = {
            name: 'Foo::Bar',
            indexes: [],
            uuid: 'uuid'
        };

        expect(mapper.transform(meta).alias).toEqual('Foo::Bar');
        expect(mapper.transform(meta).name).toEqual('foo::bar');
        expect(mapper.transform(meta).indexes).toEqual([]);
        expect(mapper.transform(meta).identifier).toEqual('uuid');
    });

});

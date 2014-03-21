namespace('Sy.Storage.StoreMapper');

/**
 * Localstorage store mapper
 *
 * @package Sy
 * @subpackage Storage.StoreMapper
 * @class
 * @implements {Sy.Storage.StoreMapperInterface}
 */

Sy.Storage.StoreMapper.LocalstorageMapper = function () {};
Sy.Storage.StoreMapper.LocalstorageMapper.prototype = Object.create(Sy.Storage.StoreMapperInterface.prototype, {

    /**
     * @inheritDoc
     */

    transform: {
        value: function (meta) {

            var store = {};

            store.alias = meta.name;
            store.name = meta.name.toLowerCase();
            store.identifier = meta.uuid;
            store.indexes = meta.indexes;

            return store;

        }
    }

});

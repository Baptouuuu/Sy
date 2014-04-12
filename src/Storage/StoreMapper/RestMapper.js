namespace('Sy.Storage.StoreMapper');

/**
 * Rest store mapper
 *
 * @package Sy
 * @subpackage Storage.StoreMapper
 * @class
 * @implements {Sy.Storage.StoreMapperInterface}
 */

Sy.Storage.StoreMapper.RestMapper = function () {};
Sy.Storage.StoreMapper.RestMapper.prototype = Object.create(Sy.Storage.StoreMapperInterface.prototype, {

    /**
     * @inheritDoc
     */

    transform: {
        value: function (meta) {

            var store = {};

            store.alias = meta.name;
            store.name = meta.name.toLowerCase().replace('::', '/');
            store.identifier = meta.uuid;
            store.indexes = meta.indexes;

            return store;

        }
    }

});

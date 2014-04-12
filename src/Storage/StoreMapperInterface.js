namespace('Sy.Storage');

/**
 * Interface to define how to transform entities metadata
 * into store informations readable by a storage engine
 *
 * @package Sy
 * @subpackage Storage
 * @interface
 */

Sy.Storage.StoreMapperInterface = function () {};
Sy.Storage.StoreMapperInterface.prototype = Object.create(Object.prototype, {

    /**
     * Transform an entity metadata into store metadata
     *
     * @param {Object} meta
     *
     * @return {Object}
     */

    transform: {
        value: function (meta) {}
    }

});

namespace('Sy.Storage.Dbal');

/**
 * Factory to build a storage driver instance
 *
 * @package Sy
 * @subpackage Storage
 * @interface
 */

Sy.Storage.Dbal.DriverFactoryInterface = function () {};
Sy.Storage.Dbal.DriverFactoryInterface.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Build a driver instance
     *
     * @param {String} dbname
     * @param {Integer} version
     * @param {Array} stores
     * @param {Object} options
     *
     * @return {Sy.Storage.Dbal.DriverFactoryInterface} self
     */

    make: {
        value: function (dbname, version, stores, options) {}
    }

});

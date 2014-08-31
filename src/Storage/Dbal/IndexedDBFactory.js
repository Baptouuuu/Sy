namespace('Sy.Storage.Dbal');

/**
 * IndexedDB driver factory
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverFactoryInterface}
 */

Sy.Storage.Dbal.IndexedDBFactory = function () {
    this.meta = [];
    this.logger = null;
};
Sy.Storage.Dbal.IndexedDBFactory.prototype = Object.create(Sy.Storage.Dbal.DriverFactoryInterface.prototype, {

    /**
     * Set all the defined entities
     *
     * @param {Array} meta
     *
     * @return {Sy.Storage.Dbal.IndexedDBFactory} self
     */

    setEntitiesMeta: {
        value: function (meta) {
            this.meta = meta;

            return this;
        }
    },

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.Dbal.IndexedDBFactory} self
     */

    setLogger: {
        value: function (logger) {
            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (dbname, version, stores, options) {
            var driver = new Sy.Storage.Dbal.IndexedDB();

            driver
                .setName(dbname)
                .setVersion(version)
                .setConnection(
                    window.indexedDB ||
                    window.webkitIndexedDB ||
                    window.mozIndexedDB ||
                    window.msIndexedDB
                )
                .setTransaction(
                    window.IDBTransaction ||
                    window.webkitIDBTransaction
                )
                .setKeyRange(
                    window.IDBKeyRange ||
                    window.webkitIDBKeyRange
                )
                .setLogger(this.logger);

            for (var i = 0, l = this.meta.length; i < l; i++) {
                if (stores.length === 0 || stores.indexOf(this.meta[i].alias) !== -1) {
                    driver.setStore(
                        this.meta[i].alias,
                        this.meta[i].alias.toLowerCase(),
                        this.meta[i].uuid,
                        this.meta[i].indexes
                    );
                }
            }

            return driver.open();
        }
    }

});

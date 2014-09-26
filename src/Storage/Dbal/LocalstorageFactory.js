namespace('Sy.Storage.Dbal');

/**
 * LocalStorage driver factory
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverFactoryInterface}
 */

Sy.Storage.Dbal.LocalstorageFactory = function () {
    this.meta = [];
};
Sy.Storage.Dbal.LocalstorageFactory.prototype = Object.create(Sy.Storage.Dbal.DriverFactoryInterface.prototype, {

    /**
     * Set all the defined entities
     *
     * @param {Array} meta
     *
     * @return {Sy.Storage.Dbal.LocalstorageFactory} self
     */

    setEntitiesMeta: {
        value: function (meta) {
            this.meta = meta;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (dbname, version, stores, options) {
            var driver = new Sy.Storage.Dbal.Localstorage();

            driver
                .setName(dbname)
                .setConnection(
                    options.temporary === true ?
                        localStorage :
                        sessionStorage
                );

            for (var i = 0, l = this.meta.length; i < l; i++) {
                if (stores.length === 0 || stores.indexOf(this.meta[i].alias) !== -1) {
                    driver.setStore(
                        this.meta[i].alias,
                        this.meta[i].alias.toLowerCase(),
                        this.meta[i].uuid
                    );
                }
            }

            return driver.open();
        }
    }

});

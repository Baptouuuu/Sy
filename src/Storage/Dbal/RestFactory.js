namespace('Sy.Storage.Dbal');

/**
 * Rest driver factory
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.Storage.Dbal.DriverFactoryInterface}
 */

Sy.Storage.Dbal.RestFactory = function () {
    this.meta = [];
    this.rest = null;
};
Sy.Storage.Dbal.RestFactory.prototype = Object.create(Sy.Storage.Dbal.DriverFactoryInterface.prototype, {

    /**
     * Set all the defined entities
     *
     * @param {Array} meta
     *
     * @return {Sy.Storage.Dbal.RestFactory} self
     */

    setEntitiesMeta: {
        value: function (meta) {
            this.meta = meta;

            return this;
        }
    },

    /**
     * Set the REST engine
     *
     * @param {Sy.HTTP.REST} rest
     *
     * @return {Sy.Storage.Dbal.RestFactory} self
     */

    setREST: {
        value: function (rest) {
            if (!(rest instanceof Sy.HTTP.REST)) {
                throw new TypeError('Invalid rest engine');
            }

            this.rest = rest;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (dbname, version, stores, options) {
            var driver = new Sy.Storage.Dbal.Rest();

            driver
                .setURLPattern(options.pattern)
                .setVersion(version)
                .setConnection(this.rest);

            if (options.headers instanceof Array) {
                for (var id = 0, l = options.headers.length; i < l; i++) {
                    driver.setHeader(
                        options.headers[0],
                        options.headers[1]
                    );
                }
            }

            for (var i = 0, l = this.meta.length; i < l; i++) {
                if (stores.length === 0 || stores.indexOf(this.meta[i].alias) !== -1) {
                    driver.setStore(
                        this.meta[i].alias,
                        this.meta[i].bundle,
                        this.meta[i].name,
                        this.meta[i].uuid
                    );
                }
            }

            return driver;
        }
    }

});

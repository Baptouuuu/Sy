namespace('Sy.Storage.Dbal');

/**
 * Factory that leverage storage drivers factories to build a specific driver
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.Dbal.Factory = function () {
    this.factories = null;
    this.defaultConnection = 'default';
    this.connections = {};
};
Sy.Storage.Dbal.Factory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set a registry to hold drivers factories
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.Dbal.Factory} self
     */

    setFactoriesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.factories = registry;

            return this;
        }
    },

    /**
     * Set a new driver factory
     *
     * @param {String} name Driver name
     * @param {Sy.Storage.Dbal.DriverFactoryInterface} factory
     *
     * @return {Sy.Storage.Dbal.Factory} self
     */

    setDriverFactory: {
        value: function (name, factory) {
            if (!(factory instanceof Sy.Storage.Dbal.DriverFactoryInterface)) {
                throw new TypeError('Invalid driver factory');
            }

            if (this.factories.has(name)) {
                throw new ReferenceError('Can\'t redefine the driver factory "' + name + '"');
            }

            this.factories.set(
                name,
                factory
            );

            return this;
        }
    },

    /**
     * Set the default connection name
     *
     * @param {String} name
     *
     * @return {Sy.Storage.Dbal.Factory} self
     */

    setDefaultConnectionName: {
        value: function (name) {
            this.defaultConnection = name || 'default';

            return this;
        }
    },

    /**
     * Set the list of available connections
     *
     * @param {Object} connections
     *
     * @return {Sy.Storage.Dbal.Factory} self
     */

    setConnections: {
        value: function (connections) {
            this.connections = connections || {};

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (name) {
            if (!this.connections.hasOwnProperty(name)) {
                throw new ReferenceError('No connection defined with the name "' + name + '"');
            }

            var conn = this.connections[name],
                factory,
                driver;

            if (!this.factories.has(conn.driver)) {
                throw new ReferenceError('Unknown driver "' + conn.driver + '"');
            }

            factory = this.factories.get(conn.driver);
            driver = factory.make(
                conn.dbname,
                conn.version,
                conn.stores
            );

            if (!(driver instanceof Sy.Storage.Dbal.DriverInterface)) {
                throw new TypeError('Invalid driver instance');
            }

            return driver;
        }
    }

});

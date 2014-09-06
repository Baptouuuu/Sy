namespace('Sy.Storage');

/**
 * Build entity manager instances
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.ManagerFactory = function () {
    this.definitions = {};
    this.dbals = null;
    this.repoFactory = null;
};
Sy.Storage.ManagerFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the managers definitions
     *
     * @param {Object} definitions
     *
     * @return {Sy.Storage.ManagerFactory} self
     */

    setDefinitions: {
        value: function (definitions) {
            this.definitions = definitions || {};

            return this;
        }
    },

    /**
     * Set the factory to build dbals
     *
     * @param {Sy.Storage.Dbal.Factory} factory
     *
     * @return {Sy.Storage.ManagerFactory} self
     */

    setDbalFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.Dbal.Factory)) {
                throw new TypeError('Invalid dbal factory');
            }

            this.dbals = factory;

            return this;
        }
    },

    /**
     * Set the repository factory
     *
     * @param {Sy.Storage.RepositoryFactory} factory
     *
     * @return {Sy.Storage.ManagerFactory} self
     */

    setRepositoryFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.RepositoryFactory)) {
                throw new TypeError('Invalid repository factory');
            }

            this.repoFactory = factory;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (name) {
            if (!this.definitions.hasOwnProperty(name)) {
                throw new ReferenceError('Unknown manager definition');
            }

            var manager = new Sy.Storage.Manager();

            return manager
                .setDriver(this.dbals.get(
                    this.definitions[name].connection
                ))
                .setRepositoryFactory(this.repoFactory)
                .setMappings(
                    this.definitions[name].mappings || []
                );
        }
    }

});

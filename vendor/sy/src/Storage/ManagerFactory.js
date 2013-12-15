namespace('Sy.Storage');

/**
 * Build new storage managers
 *
 * @package Sy
 * @subpackage Storage
 * @implements {Sy.FactoryInterface}
 * @class
 */

Sy.Storage.ManagerFactory = function () {

    this.engineFact = null;
    this.repositoryFact = null;

};

Sy.Storage.ManagerFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the engine factory
     *
     * @param {Sy.Storage.EngineFactory} factory
     *
     * @return {Sy.Storage.ManagerFactory}
     */

    setEngineFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.Storage.EngineFactory)) {
                throw new TypeError('Invalid engine factory');
            }

            this.engineFact = factory;

            return this;

        }
    },

    /**
     * Set the Repository factory
     *
     * @param {Sy.Storage.RepositoryFactory} factory
     *
     * @return {Sy.Storage.ManagerFactory}
     */

    setRepositoryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.Storage.RepositoryFactory)) {
                throw new TypeError('Invalid repository factory');
            }

            this.repositoryFact = factory;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, args) {

            if (this.engines[args.type] === undefined) {
                throw new ReferenceError('Unknown engine "' + args.type + '"');
            }

            var manager = new Sy.Storage.Manager(),
                engine = this.engineFact.make(args.type, args.version);

            manager
                .setRepositoryFactory(this.repositoryFact)
                .setMapping(args.mapping || []);

            return manager;

        }
    }

});
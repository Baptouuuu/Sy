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
     * @param {Sy.Storage.EngineFactory.Core} factory
     *
     * @return {Sy.Storage.ManagerFactory}
     */

    setEngineFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.Storage.EngineFactory.Core)) {
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
        value: function (name, args, entitiesMeta) {

            var manager = new Sy.Storage.Manager(),
                meta = [],
                engine;

                args.mapping = args.mapping || [];

            for (var i = 0, l = entitiesMeta.length; i < l; i++) {
                if (args.mapping.length === 0 || args.mapping.indexOf(entitiesMeta[i].name) !== -1) {
                    meta.push(entitiesMeta[i]);
                }
            }

            engine = this.engineFact.make(args.type, args.version, meta);

            manager
                .setRepositoryFactory(this.repositoryFact)
                .setMapping(args.mapping)
                .setEngine(engine);

            return manager;

        }
    }

});
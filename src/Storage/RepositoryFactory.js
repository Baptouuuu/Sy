namespace('Sy.Storage');

/**
 * Factory that generates entities repository
 *
 * @package Sy
 * @subpackage Storage
 * @implements {Sy.FactoryInterface}
 * @class
 */

Sy.Storage.RepositoryFactory = function () {
    this.meta = null;
    this.loaded = null;
    this.uowFactory = null;
    this.registryFactory = null;
};

Sy.Storage.RepositoryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.Storage.RepositoryFactory}
     */

    setRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.RegistryFactory)) {
                throw new TypeError('Invalid registry factory');
            }

            this.meta = factory.make();
            this.loaded = factory.make();
            this.registryFactory = factory;

            return this;

        }
    },

    /**
     * Set the informations about repositories
     *
     * @param {Array} list
     *
     * @return {Sy.Storage.RepositoryFactory}
     */

    setMeta: {
        value: function (list) {

            for (var i = 0, l = list.length; i < l; i++) {
                this.meta.set(
                    list[i].name,
                    {
                        repository: list[i].repository,
                        entity: list[i].entity,
                        indexes: list[i].indexes,
                        uuid: list[i].uuid
                    }
                );
            }

            return this;

        }
    },

    /**
     * Set the UnitOfWork factory
     *
     * @param {Sy.Storage.UnitOfWorkFactory} factory
     *
     * @return {Sy.Storage.RepositoryInterface}
     */

    setUOWFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.Storage.UnitOfWorkFactory)) {
                throw new TypeError('Invalid factory');
            }

            this.uowFactory = factory;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (alias) {

            if (this.loaded.has(alias)) {
                return this.loaded.get(alias);
            }

            if (!this.meta.has(alias)) {
                throw new ReferenceError('Unknown repository "' + alias + '"');
            }

            var meta = this.meta.get(alias),
                repo = new meta.repository(),
                uow = this.uowFactory.make(alias, meta.uuid);

            if (!(repo instanceof Sy.Storage.RepositoryInterface)) {
                throw new TypeError('Invalid repository "' + alias + '"');
            }

            repo
                .setName(alias)
                .setEntityKey(meta.uuid)
                .setEntityConstructor(meta.entity)
                .setIndexes(meta.indexes)
                .setUnitOfWork(uow)
                .setCacheRegistry(this.registryFactory.make());

            this.loaded.set(alias, repo);

            return repo;

        }
    }

});
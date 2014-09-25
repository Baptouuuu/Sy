namespace('Sy.Storage');

/**
 * Build a repository for the specified alias
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.RepositoryFactory = function () {
    this.metadata = null;
    this.loaded = null;
};
Sy.Storage.RepositoryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set a registry to hold entities metadata
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.RepositoryFactory} self
     */

    setMetadataRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.metadata = registry;

            return this;
        }
    },

    /**
     * Set a registry to hold loaded repositories
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.RepositoryFactory} self
     */

    setRepositoriesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.loaded = registry;

            return this;
        }
    },

    /**
     * Set a new entity definition
     *
     * @param {String} alias
     * @param {Function} repository Repository constructor
     *
     * @return {Sy.Storage.RepositoryFactory} self
     */

    setRepository: {
        value: function (alias, repository) {
            this.metadata.set(alias, repository);

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (em, alias) {
            if (this.loaded.has(alias)) {
                return this.loaded.get(alias);
            }

            if (!this.metadata.has(alias)) {
                throw new ReferenceError('Unknown entity alias "' + alias + '"');
            }

            var repo = new (this.metadata.get(alias))(
                em,
                alias
            );

            if (!(repo instanceof Sy.Storage.Repository)) {
                throw new TypeError('Invalid repository');
            }

            this.loaded.set(alias, repo);

            return repo;
        }
    }

});

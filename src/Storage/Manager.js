namespace('Sy.Storage');

/**
 * Handles a set of Entities Repository and control when to apply
 * changes to the engine
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.Manager = function () {

    this.repositoryFact = null;
    this.mapping = [];
    this.engine = null;

};

Sy.Storage.Manager.prototype = Object.create(Object.prototype, {

    /**
     * Set the repository factory
     *
     * @param {Sy.Storage.RepositoryFactory} factory
     *
     * @return {Sy.Storage.Manager}
     */

    setRepositoryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.Storage.RepositoryFactory)) {
                throw new TypeError('Invalid repository factory type');
            }

            this.repositoryFact = factory;

            return this;

        }
    },

    /**
     * Set the list of repository that the manager can handle
     *
     * If set to an empty array, there will be no restrictions
     *
     * @param {Array} list
     *
     * @return {Sy.Storage.Manager}
     */

    setMapping: {
        value: function (list) {

            if (!(list instanceof Array)) {
                throw new TypeError('Invalid argument');
            }

            this.mapping = list;

            return this;

        }
    },

    /**
     * Set the engine associated to the manager
     *
     * @param {Sy.Storage.EngineInterface} engine
     *
     * @return {Sy.Storage.Manager}
     */

    setEngine: {
        value: function (engine) {

            if (!(engine instanceof Sy.Storage.EngineInterface)) {
                throw new TypeError('Invalid engine');
            }

            this.engine = engine;

            return this;

        }
    },

    /**
     * Return the engine
     * Can be useful when the dev want to add the headers for the http engine
     *
     * @return {Sy.Storage.EngineInterface}
     */

    getEngine: {
        value: function () {
            return this.engine;
        }
    },

    /**
     * Return an entity repository
     *
     * @param {string} alias
     *
     * @return {Sy.Storage.Repository}
     */

    getRepository: {
        value: function (alias) {

            if (this.mapping.length > 0 && this.mapping.indexOf(alias) === -1) {
                throw new ReferenceError('The manager does not handle "' + alias + '"');
            }

            var repo = this.repositoryFact.make(alias);

            repo.setEngine(this.engine);

            return repo;

        }
    }

});
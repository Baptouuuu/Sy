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

            return this.repositoryFact.make(alias);

        }
    }

});
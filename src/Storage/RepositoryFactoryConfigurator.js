namespace('Sy.Storage');

/**
 * Extract necessary information from entities metadata
 * and inject properly the repositories definition in the factory
 *
 * @package Sy
 * @subpackage Storage
 * @class
 */

Sy.Storage.RepositoryFactoryConfigurator = function () {
    this.metadata = null;
};
Sy.Storage.RepositoryFactoryConfigurator.prototype = Object.create(Object.prototype, {

    /**
     * Set the entities metadata
     *
     * @param {Array} metadata
     */

    setMetadata: {
        value: function (metadata) {
            this.metadata = metadata;
        }
    },

    /**
     * Inject the repositories definitions in the factory
     *
     * @param {Sy.Storage.RepositoryFactory} factory
     */

    configure: {
        value: function (factory) {
            if (!(factory instanceof Sy.Storage.RepositoryFactory)) {
                throw new TypeError('Invalid repository factory');
            }

            for (var i = 0, l = this.metadata.length; i < l; i++) {
                factory.setRepository(
                    this.metadata[i].alias,
                    this.metadata[i].repository || Sy.Storage.Repository
                );
            }
        }
    }

});

namespace('Sy.Storage');

/**
 * Create a generic unit of work
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.UnitOfWorkFactory = function () {
    this.identityMap = new Sy.Storage.IdentityMap();
    this.registryFactory = null;
};
Sy.Storage.UnitOfWorkFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set all entities metadata
     *
     * @param {Array} metadata
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setEntitiesMetadata: {
        value: function (metadata) {
            for (var i = 0, l = metadata.length; i < l; i++) {
                this.identityMap.set(
                    metadata[i].alias,
                    metadata[i].entity,
                    metadata[i].uuid
                );
            }

            this.identityMap.lock();

            return this;
        }
    },

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setRegistryFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.RegistryFactory)) {
                throw new TypeError('Invalid registry factory');
            }

            this.registryFactory = factory;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function () {
            var uow = new Sy.Storage.UnitOfWork();

            return uow
                .setIdentityMap(this.identityMap);
        }
    }

});

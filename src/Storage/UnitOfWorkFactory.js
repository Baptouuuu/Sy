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
    this.stateRegistryFactory = null;
    this.propertyAccessor = null;
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
     * Set the state registry factory
     *
     * @param {Sy.StateRegistryFactory} factory
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setStateRegistryFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.StateRegistryFactory)) {
                throw new TypeError('Invalid state registry factory');
            }

            this.stateRegistryFactory = factory;

            return this;
        }
    },

    /**
     * Set a property accessor
     *
     * @param {Sy.PropertyAccessor} accessor
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setPropertyAccessor: {
        value: function (accessor) {
            if (!(accessor instanceof Sy.PropertyAccessor)) {
                throw new TypeError('Invalid property accessor');
            }

            this.propertyAccessor = accessor;

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
                .setIdentityMap(this.identityMap)
                .setEntitiesRegistry(this.stateRegistryFactory.make())
                .setStatesRegistry(this.stateRegistryFactory.make())
                .setPropertyAccessor(this.propertyAccessor);
        }
    }

});

namespace('Sy.Storage.EngineFactory');

/**
 * Master factory to generate any king of engine based on other engine factories
 *
 * @package Sy
 * @subpackage Storage.EngineFactory
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.EngineFactory.Core = function () {
    this.engines = null;
};
Sy.Storage.EngineFactory.Core.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set a registry to hold engine facctories
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Storage.EngineFactory.Core}
     */

    setRegistry: {
        value: function (registry) {

            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.engines = registry;

            return this;

        }
    },

    /**
     * Set a new engine factory
     *
     * @param {String} name Engine name it generates
     * @param {Sy.FactoryInterface} factory Engine factory
     * @param {Sy.Storage.StoreMapperInterface} mapper
     *
     * @return {Sy.Storage.EngineFatory.Core}
     */

    setEngineFactory: {
        value: function (name, factory, mapper) {

            if (this.engines.has(name)) {
                throw new ReferenceError('Factory "' + name + '" already defined');
            }

            if (!(factory instanceof Sy.FactoryInterface)) {
                throw new TypeError('Invalid factory');
            }

            if (!(mapper instanceof Sy.Storage.StoreMapperInterface)) {
                throw new TypeError('Invalid mapper');
            }

            this.engines.set(name, {
                factory: factory,
                mapper: mapper
            });

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (managerConf, entitiesMetadata) {

            var name = managerConf.type;

            if (!this.engines.has(name)) {
                throw new ReferenceError('Unknown factory named "' + name + '"');
            }

            var factory = this.engines.get(name).factory,
                mapper = this.engines.get(name).mapper,
                stores = [],
                engine;

            for (var i = 0, l = entitiesMetadata.length; i < l; i++) {
                stores.push(mapper.transform(entitiesMetadata[i]));
            }

            engine = factory.make(
                managerConf.storageName,
                managerConf.version,
                stores
            );

            return engine;

        }
    }

});

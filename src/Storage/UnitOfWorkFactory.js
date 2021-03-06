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
    this.stateRegistryFactory = null;
    this.propertyAccessor = null;
    this.logger = null;
    this.generator = null;
    this.dispatcher = null;
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
            if (!(metadata instanceof Array)) {
                throw new TypeError('Invalid metadata array');
            }

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
     * Set a logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setLogger: {
        value: function (logger) {
            if (!(logger instanceof Sy.Lib.Logger.Interface)) {
                throw new TypeError('Invalid logger');
            }

            this.logger = logger;

            return this;
        }
    },

    /**
     * Set a generator
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setGenerator: {
        value: function (generator) {
            if (!(generator instanceof Sy.Lib.Generator.Interface)) {
                throw new TypeError('Invalid generator');
            }

            this.generator = generator;

            return this;
        }
    },

    /**
     * Set the event dispatcher
     *
     * @param {Sy.EventDispatcher.EventDispatcherInterface} dispatcher
     *
     * @return {Sy.Storage.UnitOfWorkFactory} self
     */

    setDispatcher: {
        value: function (dispatcher) {
            if (!(dispatcher instanceof Sy.EventDispatcher.EventDispatcherInterface)) {
                throw new TypeError('Invalid event dispatcher');
            }

            this.dispatcher = dispatcher;

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
                .setStatesRegistry(
                    this.stateRegistryFactory
                        .make()
                        .setStrict()
                )
                .setPropertyAccessor(this.propertyAccessor)
                .setLogger(this.logger)
                .setGenerator(this.generator)
                .setDispatcher(this.dispatcher);
        }
    }

});

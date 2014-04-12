namespace('Sy.Storage');

/**
 * Generates UnitOfWork objects
 *
 * @package Sy
 * @subpackage Storage
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.UnitOfWorkFactory = function () {
    this.generator = null;
    this.stateRegistryFactory = null;
};
Sy.Storage.UnitOfWorkFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the common generator for all unit of works
     *
     * @param {Sy.Lib.Generator.Interface} generator
     *
     * @return {Sy.Storage.UnitOfWorkFactory}
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
     * Set the state registry factory
     *
     * @param {Sy.StateRegistry} factory
     *
     * @return {Sy.Storage.UnitOfWorkFactory}
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
     * @inheritDoc
     */

    make: {
        value: function (name, entityKey) {

            var uow = new Sy.Storage.UnitOfWork();

            uow
                .setStateRegistry(this.stateRegistryFactory.make())
                .setGenerator(this.generator)
                .setName(name)
                .setEntityKey(entityKey);

            return uow;

        }
    }

});

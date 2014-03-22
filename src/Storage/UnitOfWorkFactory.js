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
    this.queueFactory = null;
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
     * Set the queue factory
     *
     * @param {Sy.QueueFactory} factory
     *
     * @return {Sy.Storage.UnitOfWorkFactory}
     */

    setQueueFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.QueueFactory)) {
                throw new TypeError('Invalid queue generator');
            }

            this.queueFactory = factory;

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
                .setQueue(this.queueFactory.make())
                .setGenerator(this.generator)
                .setName(name)
                .setEntityKey(entityKey);

            return uow;

        }
    }

});

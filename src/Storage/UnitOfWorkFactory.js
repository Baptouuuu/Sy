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
        value: function (generator) {}
    },

    /**
     * Set the queue factory
     *
     * @param {Sy.QueueFactory} factory
     *
     * @return {Sy.Storage.UnitOfWorkFactory}
     */

    setQueueFactory: {
        value: function (factory) {}
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (engine, entityKey) {}
    }

});

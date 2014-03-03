namespace('Sy');

/**
 * Factory generating queue objects
 *
 * @package Sy
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.QueueFactory = function () {

    this.registryFactory = null;

};
Sy.QueueFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the registry factory
     *
     * @param {Sy.RegistryFactory} factory
     *
     * @return {Sy.QueueFactory}
     */

    setRegistryFactory: {
        value: function (factory) {

            if (!(factory instanceof Sy.RegistryFactory)) {
                throw new TypeError('Invalid factory');
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

            var q = new Sy.Queue();

            q.setRegistryFactory(this.registryFactory);

            return q;

        }
    }

});
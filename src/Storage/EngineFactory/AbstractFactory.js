namespace('Sy.Storage.EngineFactory');

/**
 * Abstract factory doing nothing, it juste centralize logger + mediator setters
 *
 * @package Sy
 * @subpackage Storage.EngineFactory
 * @class
 * @implements {Sy.FactoryInterface}
 * @abstract
 */

Sy.Storage.EngineFactory.AbstractFactory = function () {
    this.logger = null;
    this.mediator = null;
};
Sy.Storage.EngineFactory.AbstractFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the logger
     *
     * @param {Sy.Lib.Logger.Interface} logger
     *
     * @return {Sy.Storage.EngineFactory.IndexedDBFactory}
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
     * Set the mediator
     *
     * @param {Sy.Lib.Mediator} mediator
     *
     * @return {Sy.Storage.EngineFactory.IndexedDBFactory}
     */

    setMediator: {
        value: function (mediator) {

            if (!(mediator instanceof Sy.Lib.Mediator)) {
                throw new TypeError('Invalid mediator');
            }

            this.mediator = mediator;

            return this;

        }
    }

});

namespace('Sy.Storage.EngineFactory');

/**
 * Generates an instance of a rest storage engine
 *
 * @package Sy
 * @subpackage Storage.EngineFactory
 * @class
 * @extends {Sy.Storage.EngineFactory.AbstractFactory}
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.EngineFactory.RestFactory = function () {
    Sy.Storage.EngineFactory.AbstractFactory.call(this);
    this.manager = null;
    this.pattern = '/api/{{version}}/{{path}}/{{key}}';     //right now the pattern is not customisable
};
Sy.Storage.EngineFactory.RestFactory.prototype = Object.create(Sy.Storage.EngineFactory.AbstractFactory.prototype, {

    /**
     * Set the rest manager
     *
     * @param {Sy.HTTP.REST} manager
     *
     * @return {Sy.Storage.EngineFactory.RestFactory}
     */

    setManager: {
        value: function (manager) {

            if (!(manager instanceof Sy.HTTP.REST)) {
                throw new TypeError('Invalid rest manager');
            }

            this.manager = manager;

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, version, stores) {

            version = version || 1;
            stores = stores || [];

            var engine = new Sy.Storage.Engine.Rest(version);

            for (var i = 0, l = stores.length; i < l; i++) {
                engine.setStore(
                    stores[i].alias,
                    stores[i].name,
                    stores[i].indetifier,
                    stores[i].indexes
                );
            }

            if (this.mediator) {
                engine.setMediator(this.mediator);
            }

            engine
                .setManager(this.manager)
                .setPattern(this.pattern);

            return engine;

        }
    }

});

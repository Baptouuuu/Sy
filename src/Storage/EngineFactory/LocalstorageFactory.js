namespace('Sy.Storage.EngineFactory');

/**
 * Generates an instance of a Localstorage engine
 *
 * @package Sy
 * @subpackage Storage.EngineFactory
 * @class
 * @extends {Sy.Storage.EngineFactory.AbstractFactory}
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.EngineFactory.LocalstorageFactory = function () {
    Sy.Storage.EngineFactory.AbstractFactory.call(this);
};
Sy.Storage.EngineFactory.LocalstorageFactory.prototype = Object.create(Sy.Storage.EngineFactory.AbstractFactory.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, version, stores) {

            name = name || 'app::storage';
            version = version || 1;
            stores = stores || [];

            var engine = new Sy.Storage.Engine.Localstorage(version);

            for (var i = 0, l = stores.length; i < l; i++) {
                engine.setStore(
                    stores[i].alias,
                    stores[i].name,
                    stores[i].identifier,
                    stores[i].indexes
                );
            }

            if (this.mediator) {
                engine.setMediator(this.mediator);
            }

            engine
                .setStorage(window.localStorage)
                .open();

            return engine;

        }
    }

});

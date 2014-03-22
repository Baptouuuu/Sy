namespace('Sy.Storage.EngineFactory');

/**
 * Generates an instance of an indexedDB storage engine
 *
 * @package Sy
 * @subpackage Storage.EngineFactory
 * @class
 * @extends {Sy.Storage.EngineFactory.AbstractFactory}
 * @implements {Sy.FactoryInterface}
 */

Sy.Storage.EngineFactory.IndexedDBFactory = function () {
    Sy.Storage.EngineFactory.AbstractFactory.call(this);
};
Sy.Storage.EngineFactory.IndexedDBFactory.prototype = Object.create(Sy.Storage.EngineFactory.AbstractFactory.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, version, stores) {

            name = name || 'app::storage';
            version = version || 1;
            stores = stores || [];

            var engine = new Sy.Storage.Engine.IndexedDB(version);

            for (var i = 0, l = stores.length; i < l; i++) {
                engine.setStore(
                    stores[i].alias,
                    stores[i].name,
                    stores[i].indetifier,
                    stores[i].indexes
                );
            }

            if (this.logger) {
                engine.setLogger(this.logger);
            }

            if (this.mediator) {
                engine.setMediator(this.mediator);
            }

            engine
                .setConnection(
                    window.indexedDB ||
                    window.webkitIndexedDB ||
                    window.mozIndexedDB ||
                    window.msIndexedDB
                )
                .setTransaction(
                    window.IDBTransaction ||
                    window.webkitIDBTransaction
                )
                .setKeyRange(
                    window.IDBKeyRange ||
                    window.webkitIDBKeyRange
                )
                .open();

            return engine;

        }
    }

});

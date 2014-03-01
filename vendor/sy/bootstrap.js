namespace('Sy');

Sy.config = new Sy.Configurator();

Sy.config.set({
    env: 'prod',
    parameters: {},
    storage: {
        engines: {
            rest: function (version, entitiesMeta) {

                var engine = new Sy.Storage.Engine.Rest(version);

                engine.setManager(Sy.service.get('sy::core::http::rest'));
                engine.setPattern('/api/{{version}}/{{path}}/{{key}}');

                for (var i = 0, l = entitiesMeta.length; i < l; i++) {
                    engine.setStore(
                        entitiesMeta[i].name,
                        entitiesMeta[i].name.toLowerCase().replace('::', '/'),
                        entitiesMeta[i].uuid,
                        entitiesMeta[i].indexes
                    );
                }

                return engine;

            },
            indexeddb: function (version, entitiesMeta) {

                var engine =  new Sy.Storage.Engine.IndexedDB(version);

                for (var i = 0, l = entitiesMeta.length; i < l; i++) {
                    engine.setStore(
                        entitiesMeta[i].name,
                        entitiesMeta[i].name.toLowerCase(),
                        entitiesMeta[i].uuid,
                        entitiesMeta[i].indexes.concat(entitiesMeta[i].uuid)
                    );
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
                    .setLogger(
                        Sy.service.get('sy::core::logger')
                    )
                    .open();

                return engine;

            },
            localstorage: function (version, entitiesMeta) {

                var engine = new Sy.Storage.Engine.Localstorage(version);

                for (var i = 0, l = entitiesMeta.length; i < l; i++) {
                    engine.setStore(
                        entitiesMeta[i].name,
                        entitiesMeta[i].name.toLowerCase(),
                        entitiesMeta[i].uuid,
                        entitiesMeta[i].indexes
                    );
                }

                engine.setStorage(window.localStorage);
                engine.open();

                return engine;

            }
        }
    }
});

Sy.service = new Sy.ServiceContainer('sy::core');

Sy.service
    .setParameters(Sy.config.get('parameters'))
    .set({
        'sy::core::generator::uuid': {
            constructor: 'Sy.Lib.Generator.UUID'
        },
        'sy::core::mediator': {
            constructor: 'Sy.Lib.Mediator',
            calls: [
                ['setGenerator', ['@sy::core::generator::uuid']],
                ['setLogger', ['@sy::core::logger']]
            ]
        },
        'sy::core::http::rest': {
            constructor: 'Sy.HTTP.REST',
            calls: [
                ['setManager', ['@sy::core::http']]
            ]
        },
        'sy::core::registry::factory': {
            constructor: 'Sy.RegistryFactory'
        },
        'sy::core::queue::factory': {
            constructor: 'Sy.QueueFactory',
            calls: [
                ['setRegistryFactory', ['@sy::core::registry::factory']]
            ]
        },
        'sy::core::view::template::engine': {
            constructor: 'Sy.View.TemplateEngine'
        },
        'sy::core::view::parser': {
            constructor: 'Sy.View.Parser'
        },
        'sy::core::view::factory::list': {
            constructor: 'Sy.View.ListFactory',
            calls: [
                ['setTemplateEngine', ['@sy::core::view::template::engine']]
            ]
        },
        'sy::core::view::factory::layout': {
            constructor: 'Sy.View.LayoutFactory',
            calls: [
                ['setParser', ['@sy::core::view::parser']],
                ['setTemplateEngine', ['@sy::core::view::template::engine']],
                ['setRegistryFactory', ['@sy::core::registry::factory']],
                ['setListFactory', ['@sy::core::view::factory::list']]
            ]
        },
        'sy::core::view::factory::viewscreen': {
            constructor: 'Sy.View.ViewScreenFactory',
            calls: [
                ['setParser', ['@sy::core::view::parser']],
                ['setTemplateEngine', ['@sy::core::view::template::engine']],
                ['setRegistryFactory', ['@sy::core::registry::factory']],
                ['setLayoutFactory', ['@sy::core::view::factory::layout']]
            ]
        }
    });

Sy.service.set('sy::core::logger', function () {

    var logger = new Sy.Lib.Logger.CoreLogger('core'),
        info = new Sy.Lib.Logger.Handler.Console(logger.INFO),
        debug = new Sy.Lib.Logger.Handler.Console(logger.DEBUG),
        error = new Sy.Lib.Logger.Handler.Console(logger.ERROR),
        log = new Sy.Lib.Logger.Handler.Console(logger.LOG);

    logger.setHandler(info, logger.INFO);
    logger.setHandler(debug, logger.DEBUG);
    logger.setHandler(error, logger.ERROR);
    logger.setHandler(log, logger.LOG);

    return logger;

});

Sy.service.set('sy::core::http', function () {

    var parser = new Sy.HTTP.HeaderParser(),
        manager = new Sy.HTTP.Manager();

    manager.setParser(parser);
    manager.setGenerator(this.get('sy::core::generator::uuid'));
    manager.setRegistry(this.get('sy::core::registry::factory').make());

    return manager;

});

Sy.service.set('sy::core::storage', function () {

    var meta = [
            {
                name: 'DefaultBundle::Todo',
                repository: Sy.Storage.Repository,
                entity: App.Bundle.DefaultBundle.Entity.Todo,
                indexes: [],
                uuid: 'uuid'
            }
        ],
        storage = new Sy.Storage.Core(),
        managerFact = new Sy.Storage.ManagerFactory(),
        repositoryFact = new Sy.Storage.RepositoryFactory(),
        engineFact = new Sy.Storage.EngineFactory(),
        conf = Sy.config.get('storage'),
        registryFact = this.get('sy::core::registry::factory');

    storage.setRegistry(registryFact.make());

    repositoryFact
        .setMetaRegistry(registryFact.make())
        .setRepoRegistry(registryFact.make())
        .setQueueFactory(this.get('sy::core::queue::factory'))
        .setMeta(meta)
        .setGenerator(Sy.service.get('sy::core::generator::uuid'));

    for (var engineName in conf.engines) {
        if (conf.engines.hasOwnProperty(engineName)) {
            engineFact.setEngine(engineName, conf.engines[engineName]);
        }
    }

    managerFact
        .setEngineFactory(engineFact)
        .setRepositoryFactory(repositoryFact);

    for (var name in conf.managers) {
        if (conf.managers.hasOwnProperty(name)) {
            var manager = managerFact.make(name, conf.managers[name], meta);

            storage.setManager(name, manager);
        }
    }

    return storage;

});

Sy.service.set('sy::core::translator', function () {
    var translator = new Sy.Translator();
    translator
        .setRegistry(this.get('sy::core::registry::factory').make())
        .setQueueFactory(this.get('sy::core::queue::factory'));
    return translator;
});

Sy.service
    .set('sy::core::viewport', function () {

        var viewport = new Sy.View.ViewPort();

        return viewport
            .setNode(
                document.querySelector('.viewport')
            )
            .setViewManager(
                this.get('sy::core::view::manager')
            );

    })
    .set('sy::core::view::manager', function () {

        var manager = new Sy.View.Manager();

        return manager
            .setViewsRegistry(
                this.get('sy::core::registry::factory').make()
            )
            .setViewScreenFactory(
                this.get('sy::core::view::factory::viewscreen')
            );

    });

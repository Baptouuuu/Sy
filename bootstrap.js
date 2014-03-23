namespace('Sy');

Sy.config = new Sy.Configurator();

Sy.config.set({
    env: 'prod',
    parameters: {
        app: {
            meta: {
                viewscreens: [] //array of objects containing `name` and `creator` attributes
            }
        },
        storage: {
            engines: [
                {
                    name: 'indexeddb',
                    factory: 'sy::core::storage::factory::engine::indexeddb',
                    mapper: 'sy::core::storage::storemapper::indexeddb'
                },
                {
                    name: 'localstorage',
                    factory: 'sy::core::storage::factory::engine::localstorage',
                    mapper: 'sy::core::storage::storemapper::localstorage'
                },
                {
                    name: 'rest',
                    factory: 'sy::core::storage::factory::engine::rest',
                    mapper: 'sy::core::storage::storemapper::rest'
                }
            ]
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
                ['setLayoutFactory', ['@sy::core::view::factory::layout']],
                ['setDefinedWrappers', ['%app.meta.view.viewscreens%']]
            ]
        },
        'sy::core::storage::factory::engine::indexeddb': {
            constructor: 'Sy.Storage.EngineFactory.IndexedDBFactory',
            calls: [
                ['setLogger', ['@sy::core::logger']],
                ['setMediator', ['@sy::core::mediator']]
            ]
        },
        'sy::core::storage::factory::engine::localstorage': {
            constructor: 'Sy.Storage.EngineFactory.LocalstorageFactory',
            calls: [
                ['setLogger', ['@sy::core::logger']],
                ['setMediator', ['@sy::core::mediator']]
            ]
        },
        'sy::core::storage::factory::engine::rest': {
            constructor: 'Sy.Storage.EngineFactory.RestFactory',
            calls: [
                ['setLogger', ['@sy::core::logger']],
                ['setMediator', ['@sy::core::mediator']],
                ['setManager', ['@sy::core::http::rest']]
            ]
        },
        'sy::core::storage::storemapper::indexeddb': {
            constructor: 'Sy.Storage.StoreMapper.IndexedDBMapper'
        },
        'sy::core::storage::storemapper::localstorage': {
            constructor: 'Sy.Storage.StoreMapper.LocalstorageMapper'
        },
        'sy::core::storage::storemapper::rest': {
            constructor: 'Sy.Storage.StoreMapper.RestMapper'
        },
        'sy::core::storage::unitofwork::factory': {
            constructor: 'Sy.Storage.UnitOfWorkFactory',
            calls: [
                ['setGenerator', ['@sy::core::generator::uuid']],
                ['setQueueFactory', ['@sy::core::queue::factory']]
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

Sy.service.set('sy::core::storage::factory::engine::core', function () {

    var factory = new Sy.Storage.EngineFactory.Core(),
        factories = this.getParameter('storage.engines');

    factory.setRegistry(
        this.get('sy::core::registry::factory').make()
    );

    for (var i = 0, l = factories.length; i < l; i++) {
        factory.setEngineFactory(
            factories[i].name,
            this.get(factories[i].factory),
            this.get(factories[i].mapper)
        );
    }

    return factory;

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
        engineFact = this.get('sy::core::storage::factory::engine::core'),
        conf = Sy.config.get('storage'),
        registryFact = this.get('sy::core::registry::factory');

    storage.setRegistry(registryFact.make());

    repositoryFact
        .setMetaRegistry(registryFact.make())
        .setRepoRegistry(registryFact.make())
        .setUOWFactory(this.get('sy::core::storage::unitofwork::factory'))
        .setMeta(meta);

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
    .set('sy::core::view::template::engine', function () {
        var engine = new Sy.View.TemplateEngine();

        return engine
            .setRegistry(
                this.get('sy::core::registry::factory').make()
            )
            .setGenerator(
                this.get('sy::core::generator::uuid')
            );
    })
    .set('sy::core::viewport', function () {

        var viewport = new Sy.View.ViewPort();

        return viewport
            .setNode(
                document.querySelector('.viewport')
            )
            .setViewManager(
                this.get('sy::core::view::manager')
            )
            .setMediator(
                this.get('sy::core::mediator')
            );

    })
    .set('sy::core::view::manager', function () {

        var manager = new Sy.View.Manager(),
            viewscreens = this.get('sy::core::view::parser').getViewScreens();

        manager
            .setViewsRegistry(
                this.get('sy::core::registry::factory').make()
            )
            .setViewScreenFactory(
                this.get('sy::core::view::factory::viewscreen')
            );

        for (var i = 0, l = viewscreens.length; i < l; i++) {
            manager.setViewScreen(viewscreens[i]);

            if (!DOM(viewscreens[i]).isChildOf('.viewport')){
                viewscreens[i].parentNode.removeChild(viewscreens[i]);
            }
        }

        return manager;

    });

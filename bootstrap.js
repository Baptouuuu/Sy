namespace('Sy');

Sy.kernel = new Sy.Kernel.Core();
Sy.kernel.getConfig().set({
    env: 'prod',
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
    },
    controllers: {
        cache: true
    },
    logger: {
        level: {
            info: Sy.Lib.Logger.CoreLogger.prototype.INFO,
            debug: Sy.Lib.Logger.CoreLogger.prototype.DEBUG,
            error: Sy.Lib.Logger.CoreLogger.prototype.ERROR,
            log: Sy.Lib.Logger.CoreLogger.prototype.LOG,
        }
    }
});

Sy.kernel.getContainer()
    .setParameters(Sy.kernel.getConfig())
    .set({
        'sy::core::generator::uuid': {
            constructor: 'Sy.Lib.Generator.UUID'
        },
        'mediator': '@sy::core::mediator',
        'sy::core::mediator': {
            constructor: 'Sy.Lib.Mediator',
            calls: [
                ['setGenerator', ['@sy::core::generator::uuid']],
                ['setLogger', ['@sy::core::logger']]
            ]
        },
        'rest': '@sy::core::http::rest',
        'sy::core::http::rest': {
            constructor: 'Sy.HTTP.REST',
            calls: [
                ['setManager', ['@sy::core::http']]
            ]
        },
        'sy::core::registry::factory': {
            constructor: 'Sy.RegistryFactory'
        },
        'registry': '@sy::core::registry',
        'sy::core::registry': {
            constructor: 'Sy.Registry',
            factory: ['sy::core::registry::factory', 'make'],
            prototype: true
        }
        'sy::core::stateregistry::factory': {
            constructor: 'Sy.StateRegistryFactory',
            calls: [
                ['setRegistryFactory', ['@sy::core::registry::factory']]
            ]
        },
        'stateregistry': '@sy::core::stateregistry',
        'sy::core::stateregistry': {
            constructor: 'Sy.StateRegistry',
            fatory: ['sy::core::stateregistry::factory', 'make'],
            prototype: true
        }
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
                ['setStateRegistryFactory', ['@sy::core::stateregistry::factory']]
            ]
        },
        'sy::core::storage::repository::factory': {
            constructor: 'Sy.Storage.RepositoryFactory',
            calls: [
                ['setRegistryFactory', ['@sy::core::registry::factory']],
                ['setUOWFactory', ['@sy::core::storage::unitofwork::factory']],
                ['setMeta', ['%app.meta.entities%']]
            ]
        },
        'sy::core::form': {
            constructor: 'Sy.Form.Builder',
            calls: [
                ['setValidator', ['@sy::core::validator']]
            ]
        },
        'logger': '@sy::core::logger',
        'sy::core::logger': {
            constructor: 'Sy.Lib.Logger.CoreLogger',
            calls: [
                ['setName', ['core']],
                ['setHandler', ['@sy::core::logger::handler::info', '%logger.level.info%']],
                ['setHandler', ['@sy::core::logger::handler::debug', '%logger.level.debug%']],
                ['setHandler', ['@sy::core::logger::handler::error', '%logger.level.error%']],
                ['setHandler', ['@sy::core::logger::handler::log', '%logger.level.log%']],
            ]
        },
        'sy::core::logger::handler::info': {
            constructor: 'Sy.Lib.Logger.Handler.Console',
            calls: [
                ['setLevel', ['%logger.level.info%']]
            ],
            private: true
        },
        'sy::core::logger::handler::debug': {
            constructor: 'Sy.Lib.Logger.Handler.Console',
            calls: [
                ['setLevel', ['%logger.level.debug%']]
            ],
            private: true
        },
        'sy::core::logger::handler::error': {
            constructor: 'Sy.Lib.Logger.Handler.Console',
            calls: [
                ['setLevel', ['%logger.level.error%']]
            ],
            private: true
        },
        'sy::core::logger::handler::log': {
            constructor: 'Sy.Lib.Logger.Handler.Console',
            calls: [
                ['setLevel', ['%logger.level.log%']]
            ],
            private: true
        },
        'http': '@sy::core::http',
        'sy::core::http': {
            constructor: 'Sy.HTTP.Manager',
            calls: [
                ['setParser', ['@sy::core::http::parser']],
                ['setGenerator', ['@sy::core::generator::uuid']],
                ['setRegistry', ['@sy::core::registry']],
                ['setLogger', ['@sy::core::logger']]
            ]
        },
        'sy::core::http::parser': {
            constructor: 'Sy.HTTP.HeaderParser',
            private: true
        },
        'translator': '@sy::core::translator',
        'sy::core::translator': {
            constructor: 'Sy.Translator',
            calls: [
                ['setRegistry', ['@sy::core::registry']],
                ['setStateRegistryFactory', ['@sy::core::stateregistry::factory']]
            ]
        },
        'sy::core::view::template::engine': {
            constructor: 'Sy.View.TemplateEngine',
            calls: [
                ['setRegistry', ['@sy::core::registry']],
                ['setGenerator', ['@sy::core::generator::uuid']]
            ]
        },
        'sy::core::viewport': {
            constructor: 'Sy.View.ViewPort',
            calls: [
                ['setNode', [document.querySelector('.viewport')]],
                ['setViewManager', ['@sy::core::view::manager']],
                ['setMediator', ['@sy::core::mediator']]
            ]
        },
        'sy::core::view::manager': {
            constructor: 'Sy.View.Manager',
            configurator: ['sy::core::view::managerconfigurator', 'configure']
            calls: [
                ['setViewsRegistry', ['@sy::core::registry']],
                ['setViewScreenFactory', ['@sy::core::view::factory::viewscreen']]
            ],
        },
        'sy::core::view::managerconfigurator': {
            constructor: 'Sy.View.ManagerConfigurator',
            calls: [
                ['setParser', ['@sy::core::view::parser']]
            ]
        },
        'validator': '@sy::core::validator',
        'sy::core::validator': {
            constructor: 'Sy.Validator.Core',
            calls: [
                ['setRulesRegistry', ['@sy::core::registry']],
                ['setContextFactory', ['@sy::core::validator::executioncontextfactory']],
                ['setConstraintFactory', ['@sy::core::validator::constraintfactory']]
            ]
        },
        'sy::core::validator::executioncontextfactory': {
            constructor: 'Sy.Validator.ExecutionContextFactory',
            calls: [
                ['setConstraintValidatorFactory', ['@sy::core::validator::constraintvalidatorfactory']]
            ]
            private: true
        },
        'sy::core::validator::constraintvalidatorfactory': {
            constructor: 'Sy.Validator.ConstraintValidatorFactory',
            private: true
        },
        'sy::core::validator::constraintfactory': {
            constructor: 'Sy.Validator.ConstraintFactory',
            private: true
        }
    })
    .set('sy::core::storage::factory::engine::core', function () {

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

    })
    .set('sy::core::storage', function () {

        var meta = this.getParameter('app.meta.entities'),
            storage = new Sy.Storage.Core(),
            managerFact = new Sy.Storage.ManagerFactory(),
            engineFact = this.get('sy::core::storage::factory::engine::core'),
            conf = this.getParameter('storage.managers'),
            registryFact = this.get('sy::core::registry::factory');

        storage.setRegistry(registryFact.make());

        managerFact
            .setEngineFactory(engineFact)
            .setRepositoryFactory(this.get('sy::core::storage::repository::factory'));

        for (var name in conf) {
            if (conf.hasOwnProperty(name)) {
                var manager = managerFact.make(name, conf[name], meta);

                storage.setManager(name, manager);
            }
        }

        return storage;
    });

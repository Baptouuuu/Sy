namespace('Sy');

Sy.kernel = new Sy.Kernel.Core();
Sy.kernel.getConfig().set({
    env: 'prod',
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
    },
    storage: {
        dbal: {
            defaultConnection: 'idb',
            connections: {
                idb: {
                    driver: 'indexeddb',
                    dbname: 'sy::app',
                    version: 1
                },
                local: {
                    driver: 'localstorage',
                    dbname: 'sy::app',
                    options: {
                        temporary: false
                    }
                },
                rest: {
                    driver: 'http',
                    version: 1,
                    options: {
                        pattern: '/{version}/{bundle}/{name}/',
                        headers: [
                            ['X-API-VERSION', 'vendor/1']
                        ]
                    }
                }
            }
        },
        orm: {
            defaultManager: 'default',
            managers: {
                default: {
                    connection: 'idb',
                    mappings: []
                }
            }
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
        },
        'sy::core::storage::dbal::factory': {
            constructor: 'Sy.Storage.Dbal.Factory',
            private: true,
            calls: [
                ['setFactoriesRegistry', ['@sy::core::registry']],
                ['setDefaultConnectionName', ['%storage.dbal.defaultConnection%']],
                ['setConnections', ['%storage.dbal.connections%']]
            ]
        },
        'sy::core::storage::dbal::driver_factory::indexeddb': {
            constructor: 'Sy.Storage.Dbal.IndexedDBFactory',
            private: true,
            calls: [
                ['setEntitiesMeta', ['%app.meta.entities%']],
                ['setLogger', ['@sy::core::logger']]
            ],
            tags: [
                {name: 'storage.driver_factory', alias: 'indexeddb'}
            ]
        },
        'sy::core::storage::dbal::driver_factory::localstorage': {
            constructor: 'Sy.Storage.Dbal.LocalstorageFactory',
            private: true,
            calls: [
                ['setEntitiesMeta', ['%app.meta.entities%']],
                ['setLogger', ['@sy::core::logger']]
            ],
            tags: [
                {name: 'storage.driver_factory', alias: 'localstorage'}
            ]
        },
        'sy::core::storage::dbal::driver_factory::rest': {
            constructor: 'Sy.Storage.Dbal.RestFactory',
            private: true,
            calls: [
                ['setEntitiesMeta', ['%app.meta.entities%']],
                ['setLogger', ['@sy::core::logger']]
            ],
            tags: [
                {name: 'storage.driver_factory', alias: 'rest'}
            ]
        },
        'storage': '@sy::core:storage',
        'sy::core::storage': {
            constructor: 'Sy.Storage.Core',
            calls: [
                ['setManagersRegistry', ['@sy::core::registry']],
                ['setDefaultManager', ['%storage.orm.defaultManager%']],
                ['setManagerFactory', ['@sy::core::storage::factory::manager']]
            ]
        },
        'sy::core::storage::factory::manager': {
            constructor: 'Sy.Storage.ManagerFactory',
            private: true,
            calls: [
                ['setDefinitions', ['%storage.orm.managers%']],
                ['setDbalFactory', ['@sy::core::storage::dbal::factory']],
                ['setRepositoryFacctory', ['@sy::core::storage::factory::repository']],
                ['setUnitOfWorkFactory', ['@sy::core::storage::factory::unitofwork']]
            ]
        },
        'sy::core::storage::factory::repository': {
            constructor: 'Sy.Storage.RepositoryFactory',
            private: true,
            configurator: ['sy::core::storage::repofactconfigurator', 'configure'],
            calls: [
                ['setMetadatRegistry', ['@sy::core::registry']],
                ['setRepositoriesRegistry', ['@sy::core::registry']]
            ]
        },
        'sy::core::storage::repofactconfigurator': {
            constructor: 'Sy.Storage.RepositoryFactoryConfigurator',
            private: true,
            calls: [
                ['setMetadata', ['%app.meta.entities%']]
            ]
        },
        'sy::core::storage::factory::unitofwork': {
            constructor: 'Sy.Storage.UnitOfWorkFactory',
            private: true,
            calls: [
                ['setRegistryFactory', ['@sy::core::registry::factory']],
                ['setStateRegistryFactory', ['@sy::core::stateregistry::factory']]
            ]
        }
    });

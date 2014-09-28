namespace('Sy.StorageBundle.Config');

/**
 * Register storage services
 *
 * @package Sy
 * @subpackage StorageBundle
 * @class
 */

Sy.StorageBundle.Config.Service = function () {};
Sy.StorageBundle.Config.Service.prototype = Object.create(Object.prototype, {
    define: {
        value: function (container) {
            container.set({
                'sy::core::storage::dbal::factory': {
                    constructor: 'Sy.Storage.Dbal.Factory',
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
                        ['setEntitiesMeta', ['%app.meta.entities%']]
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
                        ['setREST', ['@sy::core::http::rest']]
                    ],
                    tags: [
                        {name: 'storage.driver_factory', alias: 'rest'}
                    ]
                },
                'storage': '@sy::core::storage',
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
                        ['setRepositoryFactory', ['@sy::core::storage::factory::repository']],
                        ['setUnitOfWorkFactory', ['@sy::core::storage::factory::unitofwork']]
                    ]
                },
                'sy::core::storage::factory::repository': {
                    constructor: 'Sy.Storage.RepositoryFactory',
                    private: true,
                    configurator: ['sy::core::storage::repofactconfigurator', 'configure'],
                    calls: [
                        ['setMetadataRegistry', ['@sy::core::registry']],
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
                        ['setStateRegistryFactory', ['@sy::core::stateregistry::factory']],
                        ['setGenerator', ['@sy::core::generator::uuid']],
                        ['setLogger', ['@sy::core::logger']],
                        ['setMediator', ['@sy::core::mediator']],
                        ['setPropertyAccessor', ['@sy::core::propertyaccessor']],
                        ['setEntitiesMetadata', ['%app.meta.entities%']]
                    ]
                }
            });

            container.addPass(
                new Sy.StorageBundle.CompilerPass.RegisterDriverFactoryPass()
            );
        }
    }
});
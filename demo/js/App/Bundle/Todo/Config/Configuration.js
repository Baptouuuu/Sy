namespace('App.Bundle.Todo.Config');

App.Bundle.Todo.Config.Configuration = function () {};
App.Bundle.Todo.Config.Configuration.prototype = Object.create(Object.prototype, {
    define: {
        value: function (config) {
            config
                .set('env', 'dev')
                .set('name', 'TodoMVC')
                .set('storage.dbal', {
                    defaultConnection: 'indexeddb',
                    connections: {
                        indexeddb: {
                            driver: 'indexeddb',
                            dbname: 'todos',
                            version: 1
                        }
                    }
                })
                .set('storage.orm', {
                    defaultManager: 'default',
                    managers: {
                        default: {
                            connection: 'indexeddb',
                            mapping: []
                        }
                    }
                })
                .set('api.basePath', '/api/path');
        }
    }
});
namespace('App.Bundle.AddressBook.Config');

App.Bundle.AddressBook.Config.Configuration = function () {};
App.Bundle.AddressBook.Config.Configuration.prototype = Object.create(Object.prototype, {

    define: {
        value: function (config) {
            config
                .set('routes', {
                    home: {
                        path: '/',
                        parameters: {_viewscreen: 'home'}
                    },
                    create: {
                        path: '/profile/create',
                        parameters: {_viewscreen: 'create'}
                    },
                    edit: {
                        path: '/profile/{id}',
                        parameters: {_viewscreen: 'edit'},
                        requirements: {
                            id: '\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12}'
                        }
                    }
                })
                .set('storage.dbal', {
                    defaultConnection: 'addressbook',
                    connections: {
                        addressbook: {
                            driver: 'indexeddb',
                            dbname: 'addressbook',
                            version: 2
                        }
                    }
                })
                .set('storage.orm', {
                    defaultManager: 'main',
                    managers: {
                        main: {
                            connection: 'addressbook',
                            mapping: []
                        }
                    }
                });
        }
    }

});
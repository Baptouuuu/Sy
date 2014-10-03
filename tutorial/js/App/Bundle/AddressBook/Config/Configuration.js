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
                    edit: {
                        path: '/profile/{id}',
                        parameters: {_viewscreen: 'edit'}
                    }
                })
                .set('storage.dbal', {
                    defaultConnection: 'addressbook',
                    connections: {
                        addressbook: {
                            driver: 'indexeddb',
                            dbname: 'addressbook',
                            version: 1
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
(function( window ) {
	'use strict';

	Sy.kernel.getConfig()
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

    try {
        Sy.kernel.boot();

        Sy.kernel.getContainer()
            .get('listener::repo::task')
            .boot();
    } catch (e) {
        console.log(e);
    }

})( window );

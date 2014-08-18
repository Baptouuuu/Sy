(function( window ) {
	'use strict';

	Sy.kernel.getConfig()
        .set('env', 'dev')
        .set('name', 'TodoMVC')
        .set('storage.managers', {
            main: {
                type: 'localstorage',
                version: 1,
                mapping: []
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

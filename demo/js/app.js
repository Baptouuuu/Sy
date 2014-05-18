(function( window ) {
	'use strict';

	Sy.kernel.getConfig()
        .set('env', 'dev')
        .set('name', 'TodoMVC')
        .set('parameters.storage.managers', {
            main: {
                type: 'localstorage',
                version: 1,
                mapping: []
            }
        })
        .set('parameters.api.basePath', '/api/path');

    try {
        Sy.kernel.boot();

        Sy.kernel.getServiceContainer()
            .get('sy::core::viewport')
            .display('Todo::Main');
        Sy.kernel.getServiceContainer()
            .get('listener::repo::task')
            .boot();
    } catch (e) {
        console.log(e);
    }

})( window );
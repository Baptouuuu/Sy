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
        });

    try {
        Sy.kernel.boot();

        Sy.kernel.getServiceContainer()
            .get('sy::core::viewport')
            .display('main');
    } catch (e) {
        console.log(e);
    }

})( window );

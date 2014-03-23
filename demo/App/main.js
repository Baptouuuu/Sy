Sy.kernel.getConfig()
    .set('env', 'dev')
    .set('name', 'My App Name')
    .set('storage.managers', {
        main: {
            type: 'rest',
            version: 1,
            mapping: [
                'DefaultBundle::Todo'
            ]
        }
    });

Sy.kernel.boot();
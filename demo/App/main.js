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

try {
    Sy.kernel.boot();
} catch (error) {
    //thrown if the browser does not support some features required by the framework
    //see which one with `error.message`
}

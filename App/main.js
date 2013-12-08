Sy.config.set({
    env     : 'dev',
    name    : 'My App Name',
    storage : {
        managers: {
            main: {
                type: 'rest',
                version: 1,
                mapping: [
                    'DefaultBundle::Todo'
                ]
            }
        }
    }
});
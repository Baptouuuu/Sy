Sy.config.set({
    env     : 'dev',
    name    : 'My App Name',
    storage : {
        default: {
            type: 'rest',
            version: 1,
            mapping: [
                'DefaultBundle::Todo'
            ]
        }
    }
});
namespace('App');

App.config = new Sy.Configurator();

App.config.set({
    env     : 'dev',
    name    : 'My App Name',
    api: {
        headers: {
            'X-Authorization': 'token'
        }
    }
});

Sy.init();
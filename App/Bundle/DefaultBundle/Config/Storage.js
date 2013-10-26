namespace('App.Bundle.DefaultBundle.Config');

App.Bundle.DefaultBundle.Config.Storage = function () {

    Sy.Configurator.call(this);

};

App.Bundle.DefaultBundle.Config.prototype = Object.create(Sy.Configurator.prototype, {

    define: {
        value: function () {

            return [
                {
                    name    : 'todo',
                    type    : 'server',
                    path    : '/api/path',
                    entity  : 'Todo'
                    /*headers: {} //headers setted here will override the ones setted in App.config declared in main.js*/
                }
            ];

        }
    }

});
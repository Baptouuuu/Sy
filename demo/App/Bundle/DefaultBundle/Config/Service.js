namespace('App.Bundle.DefaultBundle.Config');

App.Bundle.DefaultBundle.Config.Service = function () {

    Sy.Configurator.call(this);

};

App.Bundle.DefaultBundle.Config.Service.prototype = Object.create(Sy.Configurator.prototype, {

    define: {
        value: function () {

            return [
                {
                    name        : 'my::service',        /*beware of your services naming, those are global to your app*/
                    object      : 'MyService',
                    dependencies: [
                        'another'
                    ]
                },
                {
                    name    : 'another',
                    object  : 'Another'
                }
            ];

        }
    }

});
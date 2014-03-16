namespace('App.Bundle.DefaultBundle.Config');

App.Bundle.DefaultBundle.Config.Service = function () {};
App.Bundle.DefaultBundle.Config.Service.prototype = Object.create(Object.prototype, {

    define: {
        value: function () {

            return [
                {
                    name        : 'my::service',        /*beware of your services naming, those are global to your app*/
                    constructor : 'App.Bundle.DefaultBundle.Service.MyService',
                    calls       : [
                        ['setter', ['arg']]
                    ]
                },
                {
                    name    : 'another',
                    creator : function () {
                        return {};
                    }
                }
            ];

        }
    }

});
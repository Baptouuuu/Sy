namespace('App.Bundle.Todo.Config');

App.Bundle.Todo.Config.Service = function () {};
App.Bundle.Todo.Config.Service.prototype = Object.create(Object.prototype, {

    define: {
        value: function () {

            return [
                {
                    name: 'listener::repo::task',
                    constructor: 'App.Bundle.Todo.Service.TaskRepoListener',
                    calls: [
                        ['setRest', ['@sy::core::http::rest']],
                        ['setMediator', ['@sy::core::mediator']],
                        ['setApiPath', ['%api.basePath%']]
                    ]
                }
            ];

        }
    }

});
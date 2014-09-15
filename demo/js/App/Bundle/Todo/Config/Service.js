namespace('App.Bundle.Todo.Config');

App.Bundle.Todo.Config.Service = function () {};
App.Bundle.Todo.Config.Service.prototype = Object.create(Object.prototype, {

    define: {
        value: function (container) {

            container.set({
                'listener::repo::task': {
                    constructor: 'App.Bundle.Todo.Service.TaskRepoListener',
                    calls: [
                        ['setRest', ['@sy::core::http::rest']],
                        ['setApiPath', ['%api.basePath%']]
                    ],
                    tags: [
                        {name: 'event.subscriber'}
                    ]
                },
                'todo::viewscreen::main': {
                    constructor: 'App.Bundle.Todo.ViewScreen.Main',
                    tags: [
                        {name: 'view.viewscreen', alias: 'Todo::Main'}
                    ]
                }
            });

        }
    }

});
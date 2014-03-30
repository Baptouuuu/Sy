namespace('App.Bundle.Todo.Service');

App.Bundle.Todo.Service.TaskRepoListener = function () {
    this.rest = null;
    this.mediator = null;
    this.basePath = null;
};
App.Bundle.Todo.Service.TaskRepoListener.prototype = Object.create(Object.prototype, {

    setRest: {
        value: function (rest) {
            this.rest = rest;
        }
    },

    setMediator: {
        value: function (mediator) {
            this.mediator = mediator;
        }
    },

    setApiPath: {
        value: function (path) {
            this.basePath = path;
        }
    },

    boot: {
        value: function () {
            this.mediator.subscribe({
                channel: 'app::storage::on::post::create',
                fn: this.create,
                context: this,
                async: true
            });
            this.mediator.subscribe({
                channel: 'app::storage::on::post::update',
                fn: this.update,
                context: this,
                async: true
            });
            this.mediator.subscribe({
                channel: 'app::storage::on::post::remove',
                fn: this.remove,
                context: this,
                async: true
            });
        }
    },

    create: {
        value: function (storeName, data) {

            return;

            this.rest.post({
                uri: this.basePath + '/task',
                data: data
            });

        }
    },

    update: {
        value: function (storeName, identifier, data) {

            return;

            this.rest.put({
                uri: this.basePath + '/task/' + identifier,
                data: data
            });

        }
    },

    remove: {
        value: function (storeName, identifier) {

            return;

            this.rest.remove({
                uri: this.basePath + '/task/' + identifier
            });

        }
    }

});
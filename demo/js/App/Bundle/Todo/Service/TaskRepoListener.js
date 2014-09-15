namespace('App.Bundle.Todo.Service');

App.Bundle.Todo.Service.TaskRepoListener = function () {
    this.rest = null;
    this.basePath = null;
};
App.Bundle.Todo.Service.TaskRepoListener.prototype = Object.create(Sy.EventSubscriberInterface.prototype, {

    setRest: {
        value: function (rest) {
            this.rest = rest;
        }
    },

    setApiPath: {
        value: function (path) {
            this.basePath = path;
        }
    },

    getSubscribedEvents: {
        value: function () {
            return {
                Sy.Storage.LifeCycleEvent.prototype.POST_CREATE: {
                    method: 'create'
                },
                Sy.Storage.LifeCycleEvent.prototype.POST_UPDATE: {
                    method: 'update'
                },
                Sy.Storage.LifeCycleEvent.prototype.POST_REMOVE: {
                    method: 'remove'
                }
            };
        }
    },

    create: {
        value: function (event) {

            return;

            this.rest.post({
                uri: this.basePath + '/task',
                data: event.getEntity()
            });

        }
    },

    update: {
        value: function (event) {

            return;

            this.rest.put({
                uri: this.basePath + '/task/' + identifier,
                data: event.getEntity()
            });

        }
    },

    remove: {
        value: function (event) {

            return;

            this.rest.remove({
                uri: this.basePath + '/task/' + event.getEntity().get('uuid')
            });

        }
    }

});
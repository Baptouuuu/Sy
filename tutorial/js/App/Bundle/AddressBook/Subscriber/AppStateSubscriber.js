namespace('App.Bundle.AddressBook.Subscriber');

App.Bundle.AddressBook.Subscriber.AppStateSubscriber = function () {
    this.viewManager = null;
    this.storage = null;
};
App.Bundle.AddressBook.Subscriber.AppStateSubscriber.prototype = Object.create(Sy.EventSubscriberInterface.prototype, {

    /**
     * @inheritDoc
     */

    getSubscribedEvents: {
        value: function () {
            return {
                'appstate.change': {
                    method: 'onChange',
                    priority: -1
                }
            };
        }
    },

    /**
     * Set the view manager
     *
     * @param {Sy.View.Manager} manager
     */

    setViewManager: {
        value: function (manager) {
            this.viewManager = manager;
        }
    },

    /**
     * Set the storage mechanism
     *
     * @param {Sy.Storage.Core} storage
     */

    setStorage: {
        value: function (storage) {
            this.storage = storage;
        }
    },

    /**
     * Pre-render the viewscreen when accessing home page
     *
     * @param {Sy.AppState.AppStateEvent} event
     */

    onChange: {
        value: function (event) {
            var route = event.getState().getRoute(),
                viewscreen = this.viewManager
                    .getViewScreen(
                        event.getRoute().getParameter('_viewscreen')
                    );
            if (route === 'home') {
                this.storage
                    .getManager()
                    .getDriver()
                    .whenOpened()
                    .then(function () {
                        return this.storage
                            .getManager()
                            .getRepository('AddressBook::Profile')
                            .findAll();
                    }.bind(this))
                    .then(function (profiles) {
                        viewscreen
                            .getLayout('body')
                            .getList('contacts')
                            .render(profiles);
                    });
            } else if (route === 'create') {
                viewscreen
                    .getLayout('toolbar')
                    .render({
                        title: 'New profile'
                    });
            }
        }
    }

});
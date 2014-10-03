namespace('App.Bundle.AddressBook.Config');

App.Bundle.AddressBook.Config.Service = function () {};
App.Bundle.AddressBook.Config.Service.prototype = Object.create(Object.prototype, {

    define: {
        value: function (container) {
            container.set({
                'addressbook::subscriber::appstate': {
                    constructor: 'App.Bundle.AddressBook.Subscriber.AppStateSubscriber',
                    calls: [
                        ['setViewManager', ['@sy::core::view::manager']],
                        ['setStorage', ['@storage']]
                    ],
                    tags: [
                        {name: 'event.subscriber'}
                    ]
                }
            });
        }
    }

});
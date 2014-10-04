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
                        ['setStorage', ['@storage']],
                        ['setHomeRenderer', ['@addressbook::homerenderer']]
                    ],
                    tags: [
                        {name: 'event.subscriber'}
                    ]
                },
                'addressbook::formtype::profile': {
                    constructor: 'App.Bundle.AddressBook.FormType.Profile',
                    tags: [
                        {name: 'form.type'}
                    ]
                },
                'addressbook::viewscreen::create': {
                    constructor: 'App.Bundle.AddressBook.ViewScreen.Create',
                    tags: [
                        {name: 'view.viewscreen', alias: 'create'}
                    ]
                },
                'addressbook::homerenderer': {
                    constructor: 'App.Bundle.AddressBook.HomeRenderer',
                    calls: [
                        ['setViewManager', ['@sy::core::view::manager']],
                        ['setRouter', ['@router']]
                    ]
                }
            });
        }
    }

});
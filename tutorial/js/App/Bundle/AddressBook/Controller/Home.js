namespace('App.Bundle.AddressBook.Controller');

App.Bundle.AddressBook.Controller.Home = function () {
    this.repo = null;
    this.renderer = null;
};
App.Bundle.AddressBook.Controller.Home.prototype = Object.create(Sy.Controller.prototype, {

    init: {
        value: function () {
            this.repo = this.getStorage()
                .getManager()
                .getRepository('AddressBook::Profile');
            this.renderer = this.container.get('addressbook::homerenderer');
        }
    },

    searchAction: {
        value: function (event) {
            this.repo
                .findBy('fullname', [event.target.value, undefined])
                .then(function (profiles) {
                    this.renderer
                        .renderProfiles(profiles);
                }.bind(this));
        }
    }

});
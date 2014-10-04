namespace('App.Bundle.AddressBook.Controller');

App.Bundle.AddressBook.Controller.Home = function () {
    this.repo = null;
};
App.Bundle.AddressBook.Controller.Home.prototype = Object.create(Sy.Controller.prototype, {

    init: {
        value: function () {
            this.repo = this.getStorage()
                .getManager()
                .getRepository('AddressBook::Profile');
        }
    },

    searchAction: {
        value: function (event) {
            this.repo
                .findBy('fullname', event.target.value)
                .then(function (profiles) {
                    this.viewscreen
                        .getLayout('body')
                        .getList('contacts')
                        .render(profiles);
                }.bind(this));
        }
    }

});
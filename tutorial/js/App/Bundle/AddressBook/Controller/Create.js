namespace('App.Bundle.AddressBook.Controller');

App.Bundle.AddressBook.Controller.Create = function () {};
App.Bundle.AddressBook.Controller.Create.prototype = Object.create(Sy.Controller.prototype, {

    createAction: {
        value: function (event) {
            var form = this.createForm('profile');

            form.handle(
                this.viewscreen.getForm()
            )

            if (form.isValid()) {
                this.getStorage()
                    .getManager()
                    .persist(
                        form.getObject()
                    )
                    .flush();
            } else {
                this.viewscreen
                    .displayErrorMessage();
            }
        }
    }

});
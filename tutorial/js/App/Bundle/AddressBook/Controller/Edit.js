namespace('App.Bundle.AddressBook.Controller');

App.Bundle.AddressBook.Controller.Edit = function () {
    this.profile = null;
    this.appstate = null;
};
App.Bundle.AddressBook.Controller.Edit.prototype = Object.create(Sy.Controller.prototype, {

    init: {
        value: function () {
            this
                .getStorage()
                .getManager()
                .getDriver()
                .whenOpened()
                .then(function () {
                    return this
                        .getStorage()
                        .getManager()
                        .find(
                            'AddressBook::Profile',
                            this.appstate
                                .getCurrentState()
                                .getVariables()
                                .id
                        );
                }.bind(this))
                .then(function (profile) {
                    this.profile = profile;
                }.bind(this));
            this.appstate = this.container.get('appstate');
        }
    },

    /**
     * Save the new informations
     */

    saveAction: {
        value: function (event) {
            var form = this.createForm('profile', this.profile);

            form.handle(
                this.viewscreen.getForm()
            )

            if (form.isValid()) {
                if (this.profile.hasPicture()) {
                    this.profile.setPictureFile(
                        this.viewscreen.getPictureFile()
                    );
                }

                this.getStorage()
                    .getManager()
                    .flush();

                this.viewscreen
                    .displaySaveMessage()
                    .updateToolbar(this.profile)
                    .updatePicture(this.profile);
            } else {
                this.viewscreen
                    .displayErrorMessage();
            }
        }
    }

});
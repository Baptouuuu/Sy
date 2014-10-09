namespace('App.Bundle.AddressBook.ViewScreen');

App.Bundle.AddressBook.ViewScreen.Edit = function () {
    App.Bundle.AddressBook.ViewScreen.Create.call(this);
};
App.Bundle.AddressBook.ViewScreen.Edit.prototype = Object.create(App.Bundle.AddressBook.ViewScreen.Create.prototype, {

    /**
     * Display a message saying the profile has been updated
     */

    displaySaveMessage: {
        value: function () {
            this.findOne('paper-toast.saved').show();

            return this;
        }
    },

    /**
     * Update the fullname in the toolbar
     */

    updateToolbar: {
        value: function (profile) {
            this.getLayout('toolbar').render({profile: profile});

            return this;
        }
    },

    /**
     * Update the profile picture
     */

    updatePicture: {
        value: function (profile) {
            this.engine.render(
                this.findOne('.profile-picture'),
                {profile: profile}
            );

            return this;
        }
    }

});
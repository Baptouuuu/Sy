namespace('App.Bundle.AddressBook.ViewScreen');

App.Bundle.AddressBook.ViewScreen.Create = function () {
    Sy.View.ViewScreen.call(this);
};
App.Bundle.AddressBook.ViewScreen.Create.prototype = Object.create(Sy.View.ViewScreen.prototype, {

    /**
     * Return the form element
     *
     * @return {HTMLFormElement}
     */

    getForm: {
        value: function () {
            return this.findOne('form');
        }
    },

    /**
     * Display the paper toast containing the error message
     */

    displayErrorMessage: {
        value: function () {
            this.findOne('paper-toast').show();
        }
    },

    /**
     * Reset all the input of the form
     */

    resetForm: {
        value: function () {
            this.getForm().reset();
        }
    },

    /**
     * Extract the blob file from the form input
     *
     * @return {File}
     */

    getPictureFile: {
        value: function () {
            return this.findOne('#picture')
                .files[0];
        }
    }

});
namespace('App.Bundle.AddressBook.FormType');

App.Bundle.AddressBook.FormType.Profile = function () {};
App.Bundle.AddressBook.FormType.Profile.prototype = Object.create(Sy.Form.FormTypeInterface.prototype, {

    /**
     * @inheritDoc
     */

    buildForm: {
        value: function (builder, options) {
            builder
                .add('firstname')
                .add('lastname')
                .add('picture')
                .add('phone')
                .add('address')
                .add('zipcode')
                .add('city');
        }
    },

    /**
     * @inheritDoc
     */

    setDefaultOptions: {
        value: function (options) {
            options.set({
                dataClass: 'App.Bundle.AddressBook.Entity.Profile'
            });
        }
    },

    /**
     * @inheritDoc
     */

    getName: {
        value: function () {
            return 'profile';
        }
    }

});
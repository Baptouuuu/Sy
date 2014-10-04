namespace('App.Bundle.AddressBook.Config');

App.Bundle.AddressBook.Config.Validation = function () {};
App.Bundle.AddressBook.Config.Validation.prototype = Object.create(Object.prototype, {

    define: {
        value: function (validator) {
            validator.registerRules({
                'App.Bundle.AddressBook.Entity.Profile': {
                    properties: {
                        firstname: {
                            NotBlank: {}
                        },
                        lastname: {
                            NotBlank: {}
                        },
                        phone: {
                            Length: {
                                min: 10,
                                max: 10
                            }
                        },
                        zipcode: {
                            Length: {
                                min: 5,
                                max: 5
                            }
                        }
                    }
                }
            });
        }
    }

});
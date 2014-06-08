namespace('App.Bundle.Todo.Config');

/**
 * Register the constraint sets for classes
 */

App.Bundle.Todo.Config.Validation = function () {};
App.Bundle.Todo.Config.Validation.prototype = Object.create(Object.prototype, {

    define: {
        value: function (validator) {

            validator.registerRules({
                'App.Bundle.Todo.Entity.Task': {
                    getters: {
                        someMethod: {
                            True: {}
                        }
                    },
                    properties: {
                        foo: {
                            NotBlank: {}
                        }
                    }
                }
            });

        }
    }

});

# Validation

[< Previous chapter (Configuration)](config.md) | [Next chapter (Form) >](form.md)

The data validation is an important part inside an application, that's why Sy comes with a component dedicated to this. In order to understand how the component works, please refer to its [documentation](../Validation.md).

Inside your application you can access the validator via the service named `validator` (alias of `sy::core::validator`).

## Validation rules

If you looked at the validator documentation, you understood that you need to register a set of rules in order to validate an object.

At boot time the framework will parse your bundles and look for a class named `Validation` inside the `Config` of your bundle. If one is defined, which is not necessary, must be defined like below.

```js
namespace('App.Bundle.BundleName.Config');

App.Bundle.BundleName.Config.Validation = function () {};
App.Bundle.BundleName.Config.Validation.prototype = Object.create(Object.prototype, {
    define: {
        value: function (validator) {
            validator.registerRules({
                //here goes your rules
            });
        }
    }
});
```

# Form

[< Previous chapter (Validation)](validation.md)

Please refer to the component [documentation](../Form.md) for full understanding.

In the framework you can use the component via the service named `sy::core::form`. To ease a bit the creation of a form wrapper from your controller, you have access to 2 methods called: `createFormBuilder` and `createForm`. There are shortcuts to the one available via the service, and share the same signature.

Example:
```js
MyController.prototype = Object.create(Sy.Controller.prototype, {

    myAction: {
        value: function () {
            this.createForm('form name');
            // identical to
            this.container
                .get('sy::core::form')
                .createForm('form name');

            this.createFormBuilder({});
            // identical to
            this.container
                .get('sy::core::form')
                .createFormBuilder({});
        }
    }

});
```

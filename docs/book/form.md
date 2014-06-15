# Form

[< Previous chapter (Validation)](validation.md) | [Next chapter (Event subscribers) >](event-subscribers.md)

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

## Registering form types

As you've seen in the [form](../Form.md) documentation, you need to register your form types to the builder to easily access them afterward. To ease this process, the framework gives you a handy way to do it via the service container, it use services tags to find you form types and automatically register them at boot time.

Example:
```js
container.set({
    'my::form::type': {
        constructor: 'String.Path.To.FormType.Class',
        tags: [
            {name: 'form.type'}
        ]
    }
});
```
That's it! You only need to create a service with a tag named `form.type` and the framework will add it to the form builder. To know where to register your services, refer to the [service container](service-container.md) documentation.

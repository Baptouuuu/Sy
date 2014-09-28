# Service container

[< Previous chapter (Storage)](storage.md) | [Next chapter (Config) >](config.md)

The service container is one of the biggest part of the framework. Every dependency management inside the core is done via a single instance of the `ServiceContainer`. And you should leverage it to organize your code inside your bundles to loose coupling. As you've seen in the controller chapter you have an easy access to it via `this.container` wherever inside your controllers.

This chapter is here to walk you through on how to define your services. To see exactly what's at your disposal with the service container please read its own [documentation](../Service-container.md).

## In the app bootstrap

The first approach to define your services would be in the bootstrap file of your app, it's easy there as you can easily access to the container via `app.getContainer()`.

It's a good place as you would define your services alongside of your app configuration, but as your app will grow you'll want to split those definitions and keep them inside your bundles so it woult be easier to reuse them inside other projects.

## In your bundle

As you know now, when the framework kernel boots, it parses your app. When parsing it also looks for a class where you can define your services.

You can create such class like this:
```js
namespace('App.Bundle.Foo.Config');

App.Bundle.Foo.Config.Service = function () {};
App.Bundle.Foo.Config.Service.prototype = Object.create(Object.prototype, {

    define: {
        value: function (container) {

            container.set({
                'listener::repo::task': {
                    constructor: 'App.Bundle.Foo.Service.Bar',
                    calls: [
                        ['setRest', ['@some::service']]
                    ]
                }
            });

        }
    }

});
```
If the framework find this class, it will instanciate it and call the `define` method, passing the global service container so you can easily define your services.

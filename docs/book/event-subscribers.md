# Event subscribers

[< Previous chapter (Form)](form.md) | [Next chapter (Routing)](routing.md)

The [mediator](../Mediator.md) is used a lot in the framework, and is a good way to keep your code loosely coupled in your app. However, it's not really clear where you should register to channels and how you should organize all these subscribers.

The framework allows you to register them automatically by registering a [service](service-container.md) tagged with the name `event.subscriber`. Such service must implement the interface [`Sy.EventSubscriberInterface`](../../src/EventSubscriberInterface.js).

By convention you should put these services classes in `App.Bundle.{BundleName}.Subscriber` namespace.

Example:
```js
namespace('App.Bundle.Foo.Subscriber');

App.Bundle.Foo.Subscriber.MySubscriber = function () {};
App.Bundle.Foo.Subscriber.MySubscriber.prototype = Object.create(Sy.EventSubscriberInterface.prototype, {

    getSubscribedEvents: {
        value: function () {

            return {
                'channel name': {
                    method: 'methodName', //required
                    priority: 1, //optional
                    async: false //optional
                }
            };

        }
    },

    methodName: {
        value: function () {
            //this method will be called every time 'channel name' is published
        }
    }

});
```

And register it in the service container in the file `App.Bundle.{BundleName}.Config.Service` like this:
```js
App.Bundle.Foo.Config.Service = function () {};
App.Bundle.Foo.Config.Service.prototype = Object.create(Object.prototype, {

    define: {
        value: function (container) {
            container.set({
                'my::subscriber': {
                    constructor: 'App.Bundle.Foo.Subscriber.MySubscriber',
                    tags: [{name: 'event.subscriber'}]
                }
            });
        }
    }

});
```
At boot time, the framework will search for services tagged with `event.subscriber` and will automatically subscribe to the defined channels.

Moreover, the method context, meaning the `this` keyword, is set to the instance of the subscriber class (alias the service instance), so you can call other methods defined in the subscriber class. What's very useful is that as a service you can easily inject dependencies in your subscriber like any other services.

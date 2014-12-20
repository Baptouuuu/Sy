# Event subscribers

[< Previous chapter (Form)](form.md) | [Next chapter (Routing)](routing.md)

The [event dispatcher](../EventDispatcher.md) is used a lot in the framework, and is a good way to keep your code loosely coupled in your app. However, it's not really clear where you should register to events and how you should organize all these subscribers.

The framework allows you to register them automatically by registering a [service](service-container.md) tagged with the name `event.subscriber` or `event.listener`.

By convention you should put these services classes in `App.Bundle.{BundleName}.Subscriber` namespace.

[Register your service](service-ontainer.md) like this:
```js
container.set({
    'my::listener': {
        constructor: 'Path.To.Listener.Class',
        tags: [{name: 'event.listener', event: 'event name', method: 'method name', priority: 1}]
    }
});
```
This way you can defined as many events listeners as you wish by simply adding another tag.

If your class inherits `EventSubscriberInterface`, your tag must look like `{name: 'event.subscriber'}`.

At boot time, the framework will search for services with these tags and will automatically subscribe to the defined events. The really nicething about this is that your listeners/subscribers services will be loaded only when the event is first fired. So you can add complex dependencies to your listeners without slowing down your app at boot time.

This way, even by declaring as `event.listener`, your methods will be bind to the service instance (meaning `this` in your listener will point to your service instance).

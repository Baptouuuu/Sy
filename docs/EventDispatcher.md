# EventDispatcher

The `EventDispatcher` is a tool to let you easily extend your application behaviour without altering original code. The goal is that when you need to add a set of code when something happen in your application, instead of adding directly the code in the function handling the action, fire an event and then create a listener where you put your code; it acomplishes the same thing but now you can easily add new code when this event is fired, and it also help keep things loosely coupled.

This component is here to help you do just that.

## Creation

```js
var dispatcher = new Sy.EventDispatcher.EventDispatcher();
```
Can't be more simple :) (if you use the full framework, you already have a instance available through the service `sy::core::event_dispatcher`).

## Events

As described in the introduction, the goal is to fire an event, that's represented by the object [`Sy.EventDispatcher.Event`](../src/EventDispatcher/Event.js).

To dispatch an event, once again it's pretty straightforward :
```js
var event = new Sy.EventDispatcher.Event();
dispatcher.dispatch('event name', event);
```

The `event` object will be passed as argument to every listeners of the event `event name`. Through this object you can access the name of the event being dispatched (`event.getName()`), the dispatcher used to handle the event (`event.getDispatcher()`).

You can also tell the dispatcher to stop calling other listeners by calling `event.stopPropagation()`.

With the example above, there's is no real point of creating an empty event as you don't pass any data to it, in such case you an omit the event argument and just call `dispatcher.dispatch('event name')` and it will do the exact same thing.

When you want to pass data to your listeners you can create an event via [`Sy.EventDispatcher.GenericEvent`](../src/EventDispatcher/GenericEvent.js). This object takes 2 arguments when creating it: the subject and the arguments. The first one can be any type of data, but usually it is the object assoiated with the event (ie: an entity before/after it's saved). The last one is an object literal, representing a set of named arguments; you can set anything you like in it.

Example:
```js
var magrathea = new Planet('Magrathea'),
    event = new Sy.EventDispatcher.GenericEvent(magrathea, {answer: 42});
dispatcher.dispatch('whatever', event);
```
In this case, a listener an retrieve `magrathea` via the method `event.getSubject()` and can get the arguments through `event.getArguments()` or a single one via `event.getArgument('answer')`.

A listener can also add arguments to your event via `event.setArgument('name', data)` or replace all of the data via `event.setArguments({foo: 'bar'})`.
This can be useful when you fire an event to give a chance to your listeners to give you an answer. For example, you could throw an event and let your listeners calculate some data that you need in your function but want to put too many calculations in the same place.

Of course, if you want a custom event object with your own specific getters and setters you can do so by simply creating a class inheriting from `Sy.EventDispatcher.Event` and pass an instance of it to the dispatcher `dispatch` method.

Example:
```js
var PlanetEvent = function (planet) {
    this.planet = planet;
};
PalanetEvent.prototype = Object.create(Sy.EventDispatcher.Event.prototype, {
    getPlanet: {
        value: function () {
            return this.planet;
        }
    }
});

dispatcher.dispatch('whatever', new PlanetEvent(new Planet('magrathea')));
```

## Listeners

Now that you know how to throw events, you need to catch them.

Example:
```js
dispatcher.addListener('event name', function (event, eventName, dispatcher) {
    // do whatever you want with this event
});
```
Every time you will dispatch the event `event name`, the function above will be called. Note that as arguments you also have access to the event name and the dispatcher, these values are the same as the ones returned by `event.getName()` and `event.getDispatcher()`.

"Hey, but what if I want to prioritize my listeners?" Don't worry! it's covered. `addListener` can take a third argument which is the priority integer (default to `0`). Highest called first.

In case you want to stop your function of being called when an event is fired, call the method `removeListener` with the event name and the function you passed to `addListener` as arguments.

## Subscribers

In some cases you'll want to use a method of an object to be used as the listener. To do this, you can either add the method as listener and bind the object instance to it (ie: `addListener('foo', inst.method.bind(inst))`) but it's not very pretty; or you an define the class of this object as an event subscriber like so:

```js
var SomeClass = function () {};
SomeClass.prototype = Object.create(Sy.EventDispatcher.EventSubscriberInterface.prototype, {
    getSubscribedEvents: {
        value: function () {
            return {
                'event name': 'method'
            };
        }
    },
    method: {
        value: function (event) {
            // this is your listener
        }
    }
});

dispatcher.addSubscriber(new SomeClass());
```

The code above will add the function `method` as a listener (with the `this` keyword attached to the instance of `SomeClass`). In the object returned by `getSubscribedEvents`, you can set as many events as you wish.

The variable attached to the event name can be of 3 types:

* a string, the name of the method to call
* an object, of the form `{method: 'method name', priority: integer}`
* an array, a list of object like the one on the line above

Like with listeners, you can remove a subscriber with `dispatcher.removeSubscriber(subscriberInstance)`.

## Informations

You can check if an event has listeners by calling `dispatcher.hasListeners('event name')` (will return a boolean).

You can also retrieve all the listeners for an event by calling `dispatcher.getListeners('event name')` (will return an array).

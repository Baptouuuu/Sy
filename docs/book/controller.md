# Controller

[< Previous chapter (UI)](ui.md) | [Next chapter (Storage) >](storage.md)

Once your UI is ready, place to interaction with the controllers. In Sy, one viewscreen is handled by only one controller. To load your controllers, the framework listen to the viewport changes, and when a new viewscreen is displayed the associated controller will be loaded.

Now, what should you do in this controller? Its goal is to catch user interactions (click events and so on) and decide what to do with that. In general it means retrieve some data and render it, or the other way extract data and save it. In other words it's the control center of your app.

## Bootstrap

First let's define a new controller, do it like so:
```js
namespace('App.Bundle.YourBundleName.Controller');

App.Bundle.YourBundleName.Controller.ControllerName = function () {
    Sy.Controller.call(this);
};
App.Bundle.YourBundleName.Controller.ControllerName.prototype = Object.create(Sy.Controller.prototype, {

    someControllerMethod: {
        value: function () {}
    }

});
```

Now to link this controller to a viewscreen, you simply have to add a new attribute on it:
```html
<section data-sy-view="viewscreen name" data-sy-controller="YourBundleName::ControllerName"></section>
```
When the controller manager listen to the viewport change, it reads this attribute and can easily determine the path to your controller.

## Lifecycle

### Instanciation

When first loading a controller the framework automatically inject a set of dependencies:

* the `Mediator` (setter: `setMediator`, attribute: `mediator`)
* the `ServiceContainer` (setter: `setServiceContainer`, attribute: `container`)
* the `ViewScreen` (setter: `setViewScreen`, attribute: `viewscreen`)

*Each of this setters can be overidden, so you can modify the attributes where those are saved in your controller.*

The service container injected in each controller is the same as the one returned by the kernel (via `app.getContainer()`).

The viewscreen is the wrapper of the node being displayed and that the controller is related to.

When all the dependencies are injected, the kernel call the method `init` on your controller. It's via this method you now your object is fully ready, so if you need to retrieve any other dependency, you should do it in this method.

### Sleep

A controller is put to *sleep* by the framework when the viewscreen it's related to is taken off the viewport. This happens via the `sleep` method of your controller. By default this method will pause any channel subscribed inside your controller via the `listen` method. This is done in order to prevent unwanted background job inside your controller (as it's not supposed to do anything anymore).

If you directly subscribe to a channel via the mediator, it will be up to you to handle what to do when the controller is put to sleep. To do that you need to override the `sleep` method, but don't forget to call the parent method to prevent any further work done by the framework.

### Wakeup

As opposed to the sleep *event*, the wakeup happens when the controller has been instanciated before and the viewscreen it's related to is taken back inside the viewport. By default, the framework will call the `wakeup` method on your controller, which will unpause any channel subscribed via the `listen` method.

Once again, if you subscribed to channels directly on the mediator, it will be up to you to handle what to do by overriding the `wakeup` method.

### Destroy

This last *event* happens when the framework drops the instance of your controller. It's here to properly remove the controller to leave no trace of its existance. By default, it will unsubscribe all channel subscribed via the `listen` method, but as always you can override it if you want to gracefully remove the actions of your controller from the rest of your app.

This event happens if the number of controllers instances exceed the cache limit you defined. (see [cache](#cache) section) (destroyed by FIFO principle)

## Default methods

### Mediator

Each controller come with 2 default methods related to the mediator, one called `listen` refering to the `subscribe` on the mediator and the other one `broadcast` refers to `publish`.

The first one takes only two arguments: the channel name and the function callback. What it does in background is that it call the `subscribe` method on the mediator and use the channel and function you passed and the most important it sets your controller as the context of the callback (aka the `this` keyword). It also save the identifier of this subscriber in an array, so it can be paused when the controller is put to sleep.

The `broadcast` is nothing more than a shortcut as it only applies the arguments you pass to the `publish` method on the mediator.

### Storage

To give a quicker access to the storage engine, a controller ships with a method called `getStorage`, pretty straightforward. Not that much magic behind it, it only retrieve the service called `sy::core::storage` (aliased with `storage`).

### Forms

The controller also gives you a quicker access to build forms via 2 methods: `createForm` and `createFormBuilder`. These have the same signature and behaviour as the ones of the form component (learn more about [forms](../Form.md)).

## Actions

As said in the description, the controller is here to handle user interactions. In order you don't have to write many `addEventListener` statements, the framework allows you to define easily your event listeners in the DOM.

For example, let's add a `submit` event on a `form`:
```html
<form data-sy-action="method|submit">
    <!-- inner html-->
</form>
```
This attribute tells the framework to bind the `submit` event of this form to the method named `methodAction` of your controller. The `Action` suffix is here to help you visualise in your controller which methods are directly bound to a html element. In case you want to register additional event to the same node, you simply have to add a pipe and the name of the event to the attribute (ie: `method|submit|click`).

If you don't like this approach (meaning putting method references in your DOM), you can still add listener in vanilla JS by retrieving the viewscreen node and calling `addEventListener`:
```js
this.viewscreen
    .getNode()
    .findOne('#my-div')
    .addEventListener('eventName', fn.bind(this), false);
```
Obviously you should do this inside the `init` method of your controller (so the listeners are added only once).

By using the feature offered by the framework, it gives you access to 2 new channels published before and after the action function is called:

* `controller::on::pre::action`
* `controller::on::post::action`

Each one is published with an instance of [`Sy.Event.ControllerEvent`](../../src/Event/ControllerEvent.js). It can help you listen to events on your controller from elsewhere in your app, without adding code inside the controller method.

**Important**: there's a restriction with `data-sy-action` you can't place one on elements inside a list. This behaviour is intended to prevent creating too many listeners. Instead you should place one listener on the list container and then filter the element click (or something else) inside the controller action.

## Cache

By default the framework will keep a reference of every controller it instanciate, so when a viewscreen is displayed back it's quicker to get the corresponding controller up and running. However, the more you have controllers, the more there will be objects; in very large applications it can become a performance problem.

That's why you can configure how many controllers the framework can keep reference to.
```js
app.getConfig().set('controllers.cacheLength', cacheLengthInteger);
```
This configuration must be set before the kernel boots.

If you don't want cache at all, you can disable it like so:
```js
app.getConfig().set('controllers.cache', false);
```
Once again, it must be set before kernel boot.

**Note**: you can still put this configuration in a bundle configuration as bundles are loaded before the controller manager is built.

# Sy fundamentals

[Next chapter (UI) >](ui.md)

This is a MVC framework built for large, offline first, application. It helps the developer, aka *you*, keep its code organized around a strong code structure (that should feel familiar to Symfony developers).

## Loosely coupling

A good practice in software development is to keep your code lossely coupled. That's why from the start this framework has been built around the principle each component could be used independently from the rest of the framework.

The loosely coupled principle is taken a step further, by taking applying it to the separation of employees jobs. It's applicable to the storage and view components, and is more explained in their own documentation. But the goal is to help you do your work without affecting the one of designers and backend colleagues.

## Service/Event centric

Almost every part of the framework is accessible through a service (see the [`ServiceContainer`](../Service-container.md) doc). It helps bootstrap complex mechanism by easily resolving dependencies, and by keeping an abtraction between each component. Think: "I want to use this, and don't want to care how to build you".

Javascript is an event based, asynchronous, language and so is this framework. Events is a good way to keep your code loosely coupled, that's why Sy comes with a component called [`Mediator`](../Mediator.md) to help you create/subscribe to channels (aka *events*).

## MVC

But what those letters really mean in the context of client side code?

The Model is the representation of the data in the form of entities (handled by the storage engine).

The View is an abstraction layer between your controller and the actual *view* that is your DOM. Any manipulation to the DOM should be done inside this abstraction layer.

The Controller is here to pilot the other 2 parts. Meaning retrieve data (and save it on user interactions) and apply this data via the View (not the *view*, see above).

# Bundles

Your app must be organised by bundles. A bundle is a regroupment of your code, where you'll find controllers, entities, services, etc... It's just a way to organize your work and segment code of your app. Plus the framework relies on this structure to discover where are located your classes. For php developers, you'll find the same notion in the [Symfony](http://symfony.com) framework.

To see where to put a class, please refer to the appropriate section.

## Namespacing

If you have written some javascript before, you probably know the problem of global variables that can be easily overriden. To avoid this problem, many developers use self contained functions so the variables are contained in this restricted scope. The problem with this approach is that it creates many closures, and one of the goals of this framework is to avoid them as much as possible.

That's where namespacing shines. With this framework, your global footprint is reduced to 2 global objects (and 6 global functions):

* `App`: where all *your* code is put
* `Sy`: where all the framework code is contained

Everything inside `App` is only classes declarations, every object instanciation will be contained inside `Sy.kernel` which is the instanciation of [`Sy.Kernel.Core`](../../src/Kernel/Core.js).

To resume, by using namespaces you can avoid the problem of global variables **and** avoid the heavy memory cost of closures (and its impact on garbage collection).

*Note*: Google has a [section](https://developers.google.com/speed/articles/optimizing-javascript) about closures and their drawbacks (section *Avoiding pitfalls with closures*).

## App bootstrap

In the other chapters you'll see how to define your classes inside your bundles, but it does not tell you how to initiate your application.

Usually, it's done inside a small file added in last inside your html page, this one will be responsible to define your [app configuration](config.md), boot the framework kernel and display the first viewscreen.

Example:
```js
Sy.kernel.getConfig()
    .set('some.config', 'value');

try {
    Sy.kernel.boot();

    Sy.kernel.getContainer()
        .get('sy::core::viewport')
        .display('home');
} catch (error) {
    //error if the browser is not supported by the framework
}
```
This is a typical file on how to launch your app. Remember to call the `boot` method *only and only* when everything is loaded (all your app files) and configured; otherwise some configuration may not affect the framework the way you'd expect.

Please take a look at the working demo available at the root of this repository for a real example.


## What is does not

### Routing

This framework is built with app in minds, ones that can be run outside a browser context, meaning one where there is no url bar. So it has been decided to not implement a feature that has no real meaning in certain contexts. (After all, did you see a route in your Photoshop to remember where you were last time you used it?)

### Two way data binding

Javascript is not yet fully ready to implement such feature. At this time it would mean to implement a data dirty check at a regular set of times; that would be implemented by `setTimeout` our `setInterval`. But this means to consume CPU even when there is no data change; this is a behaviour that cannot be acceptable for mobile usage with limited battery life.

So until `Object.observe` is implemented by all major browsers, this feature won't be integrated in the roadmap.
# Sy fundamentals

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

## What is does not

### Routing

This framework is built with app in minds, ones that can be run outside a browser context, meaning one where there is no url bar. So it has been decided to not implement a feature that has no real meaning in certain contexts. (After all, did you see a route in your Photoshop to remember where you were last time you used it?)

### Two way data binding

Javascript is not yet fully ready to implement such feature. At this time it would mean to implement a data dirty check at a regular set of times; that would be implemented by `setTimeout` our `setInterval`. But this means to consume CPU even when there is no data change; this is a behaviour that cannot be acceptable for mobile usage with limited battery life.

So until `Object.observe` is implemented by all major browsers, this feature won't be integrated in the roadmap.
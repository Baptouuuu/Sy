# Storage

[< Previous chapter (Controller)](controller.md) | [Next chapter (Service container) >](service-container.md)

The third big part of your application is of course your data. The framework comes with a library to help you abstract as mush as possible the work needed to persist your data. It also helps you move from one type of storage to another with just a one liner change in your code. The storage mechanism with 3 types of storage:

* `localStorage`
* `IndexedDB`
* `HTTP` (REST calls more specifically)

Those have been chosen for a specific reason, as said in the description of the framework it's here to build offline applications and so you need browser storage. That's why for the `IndexedDB` part, now the `localStorage` is here just in case the browser running your app does not yet support this technology. Finally, `HTTP` because at some point you'll want to send your data back to your server.

Even if your app is offline first or not, those 3 engines give another advantage: you don't rely on backend code before you can start coding the front. By that I mean, here again, loosely coupled jobs. Say, front and backend code developers are separated team and the api available for storing data is not yet ready, as user of this framework you could choose an offline storage first, then when the backend api is ready, just switch to use the http engine and your done.
It really helps you *not* rely on another team to do your job.

## Entities

First things first, before jumping to the part on how to define the storage and persist data, let's begin with how to represent your data in the app. The framework takes the notion of `entity` to represent a data object, it just a simple object with a bunch of method wrapping your raw data.

Here's how an entity looks like:
```js
namespace('App.Bundle.Foo.Entity');

App.Bundle.Foo.Entity.Bar = function () {
    Sy.Entity.call(this);
};
App.Bundle.Foo.Entity.Bar.prototype = Object.create(Sy.Entity.prototype);
```
Inside the framework, every entity must be declared inside the namespace `Entity` of your bundle (so the framework can automatically discover them).

In the example above you don't see any attribute declared for your entity. That's *normal* as by default the engine works schemaless, but if you want to force a set of attributes you can do it like in the example below; note that even if you specify them the underlying storage engine don't care at all about the structure (it's always schemaless).

```js
App.Bundle.Foo.Entity.Bar = function () {
    Sy.Entity.call(this);
    this.lock([
        'uuid',  //don't forget this one, it's required by the framework
        'attr1',
        //...
        'attrN'
    ]);
};
```
What this will do is initialize every attribute to null on your object and seal the object where there're stored so no attribute can be added or removed (only modified). Inside your entity, the data is stored under the attribute `attributes`, you must **never** touch directly this object!

To add or retrieve data from your entity, you have access to 2 methods:

* `entity.set('attr', 'value')` (if value is an object, it will loop over it to set data)
* `entity.get('attr')`

Obviously you can define your own getters and setters in the prototype of your entity, but you should not override the default `get` and `set` methods.

## Managers

Now that you know how to declare your entities, let's see how to handle them to the storage. As you'll see with the next sections, it goes through multiple layers. And the first one is the manager.

A manager is a way to define the storage engine you want to use for a set of entity types. You define one in the global config object:
```js
Sy.kernel.getConfig()
    .set('parameters.storage.managers', {
        main: {
            type: 'indexeddb', //or localstorage or http
            storageName: 'app::storage',  //optional
            version: 1,
            mapping: []
        }
    });
```
Here we say to the engine that all our entities will be saved to an IndexedDB storage. The version is used by IndexedDB to tell the engine if there're been any changes in the structure of entities, meaning if you add entity definitions or add new indexes to any entity (see below) you must increment the version number.

The `mapping` array tells the manager which type of entities it can handle, so if you leave it empty it will accept any entity. If you do want to restrain the manager to a set of entities you add them to the array with the form `BundleName::EntityName` (ie: `Foo::Bar` for the entity described above).

The `storageName` is an optional key to configure manager and is defaulted to `app::storage`. It's here in case you want to use multiple times the same engine type across multiple managers (otherwise it would be overriden); it most cases you won't need to bother, but now you know it's there.

As you can see, from this little configuration you can decide where you data will be persisted. I wasn't lying before when I said one liner change.


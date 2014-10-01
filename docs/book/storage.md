# Storage

[< Previous chapter (Controller)](controller.md) | [Next chapter (Service container) >](service-container.md)

The third big part of your application is of course your data. The framework comes with a library to help you abstract as mush as possible the work needed to persist your data. It also helps you move from one type of storage to another with just a one liner change in your code. The storage mechanism comes with 3 types of storage:

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

In the example above you don't see any attribute declared for your entity. That's *normal* as the engine works schemaless.

To add or retrieve data from your entity, you have access to 2 methods:

* `entity.set('attr', 'value')` (if value is an object, it will loop over it to set data)
* `entity.get('attr')`

Obviously you can define your own getters and setters in the prototype of your entity, but you should not override the default `get` and `set` methods.

## Managers

Now that you know how to declare your entities, let's see how to handle them to the storage. As you'll see with the next sections, it goes through multiple layers. And the first one is the manager.

A manager is a way to define the storage engine you want to use for a set of entity types. You define one in the global config object:
```js
app.getConfig()
    .set('storage.dbal.connections.myconn', {
        driver: 'indexeddb',
        version: 1,
        dbname: 'my app'
    })
    .set('storage.orm.managers', {
        main: {
            connection: 'myconn',
            mappings: []
        }
    });
```
Here we say to the engine that all our entities will be saved to an IndexedDB storage. The version is used by IndexedDB to tell the engine if there're been any changes in the structure of entities, meaning if you add new indexes to any entity (see below) you must increment the version number.

The `mappings` array tells the manager which type of entities it can handle, so if you leave it empty (or omit it) it will accept any entity. If you do want to restrain the manager to a set of entities you add them to the array with the form `BundleName::EntityName` (ie: `Foo::Bar` for the entity described above).

As you can see, from this little configuration you can decide where your data will be persisted. I wasn't lying before when I said one liner change.

## Repository

The entity alias used to access a repository (or anywhere it's used) takes the form of `BundleName::EntityName`.

### Custom repository

In some cases you'll want to create functions on a repository, like for example to reduce the number of entities returned based on your own algorithm. Thankfully, you can define your own entity repository so you can centralize some code.

To define one, you do it like this:
```js
namespace('App.Bundle.Foo.Repository');

App.Bundle.Foo.Repository.Bar = function () {
    Sy.Storage.Repository.call(this);
};
App.Bundle.Foo.Repository.Bar.prototype = Object.create(Sy.Storage.Repository.prototype, {

    myCustomMethod: {
        value: function () {}
    }

});
```
The name of your repository *must* have the same one as the entity it will handle.

*Note*: you should not override the existing methods, as it may evolves in future versions it could break your code.

## Storage engine

### Create your own

The framework comes built in with 3 storage types, but you can easily add your own in case you're not fully satisfied with the ones available at your disposition. This process involves 2 types of objects: the actual storage engine and its factory.

The storage must be created as follow:
```js
namespace('Wherever.You.Want');

Wherever.You.Want.MyStorage = function () {};
Wherever.You.Want.MyStorage.prototype = Object.create(Sy.Storage.Dbal.DriverInterface.prototype, {
    //implement the methods here
});
```
To know how to implement the storage methods please refer to the file [`DriverInterface.js`](../src/Storage/Dbal/DriverInterface.js) and read the docblocks for each method.

The next step is to create the factory, as its name suggest it's used to build an instance of your driver. Usually you'll inject the variable `app.meta.entities` from the config as it contains all the entities declaration found in the app.

```js
namespace('Wherever.You.Want');

Wherever.You.Want.MyFactory = function () {};
Wherever.You.Want.MyFactory.prototype = Object.create(Sy.Storage.Dbal.DriverFactoryInterface.prototype, {
    make: {
        value: function (dbname, version, stores, options) {
            //build your engine here and return it
        }
    }
});
```
All the parameters can be declared inside the config object of the connection.

Now that all the classes has been defined, let's tell the framework about our new driver.
```js
app.getContainer()
    .set({
        'our::factory::service::name': {
            constructor: 'Wherever.You.Want.MyFactory'
            tags: [
                {name: 'storage.driver_factory', alias: 'driver identifier'}
            ]
        }
    });
```
And... done! Now you can specify a connection driver with `driver identifier`.

*Note*: read the [service container](service-container.md) chapter to see how to define these services inside your bundle.

As you can see, you can easily build your own engine and distibute it so it can be reused inside other projects.
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

## Repository

### Persisting

At this point you're full and ready to start persisting your data. And this is done through the repositories. A repository is an abstraction to query the engine for a specific entity type.

So to access a repository it's done via the manager like so:
```js
var repo = serviceContainer.get('sy::core::storage')
    .getManager('main')
    .getRepository('Foo::Bar');
```
The repository for the entity described above can be accessed via this code. In this case we specify the manager name `main`, but as it's the default name in the engine it can be omitted. The `Foo::Bar` string represent the entity alias (as you should now be familiar with); as always the form is `BundleName::EntityName`.

So now that you have access to the repo, persist an entity:
```js
var entity = new App.Bundle.Foo.Entity.Bar();
repo.persist(entity);
repo.flush();
```
What the code above does is first (obviously) create your entity and then call the `persist` method, this last one does not actually persist directly your data, it only plans it for being persisted. Here you don't need to wonder if an entity is to be created or updated, the underlying code of persist will handle it for you; it looks for the `uuid` attribute, if it's empty it means the entity is new and will plan it for creation and at the same time will create a value for this attribute.

The `flush` method is the trigger to really persist the data to the storage. This approach to split the process in two is useful in case for example you loop over a huge array , modify your entities and then save it to the database. Instead of calling multiple times the storage, here you only call it once.

In case you want to remove an entity from the storage, it's also a 2 steps process:
```js
repo.remove(entity);
repo.flush();
```
*Note*: In case you persist a new entity (not flushed yet) and then call `remove` it will remove it from the entities planned for creation.

### Retrieving

To retrieve your entities from the storage, you can do it through 2 methods: `findOneBy` and `findBy`.

The first one accept an object as argument:
```js
{
    index: 'attributeName',
    value: 'value to search',
    callback: functionToCall
}
```

The second one accept the same object except you can also specify a limit of objects returned. In fact `findOneBy` is like calling `findBy` and setting the `limit` to `1`, except if the index specified is the entity's `uuid`, in this case it will invoke the callback with the entity as argument instead of an array of entities.

**Important**: If you use the `indexeddb` storage type, you need to specify the indexes inside your entities contructor via the method `register` (ie: `this.register('title');`).

The `value` you can search does not have necessarily have to be a single value, you can also search for a range of value by setting an array of 2 values. The first value is the lower bound and the second one the upper bound.

Examples:

* `[1, 10]` equivalent to `1 <= index <= 10`
* `['a', 'f']` equivalent to `'a' <= index <= 'f'` (be careful with string comparison like this)
* `[undefined, 10]` equivalent to `index <= 10`
* `[1, undefined]` equivalent to `1 <= index`

### Custom repository

In some cases you'll want to create functions on a repository, like for example specify an update date before persisting the entity. Thankfully, you can define your own entity repository so you can centralize some code.

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

### Unit of Work

Each repository use what's called a Unit of Work (uow for short) to manage the entities that will be persisted/removed. You can access it via the method `getUnitOfWork` on your repository.

This objet is useful if you want to know if a specific entity is planned for creation/update/removal. You can check this with these methods:

* `is ScheduledForCreation`
* `is ScheduledForUpdate`
* `is ScheduledForRemoval`

Each one accept an entity as argument and will return a boolean.

The uow is also responsible for extracting the data out of the entity and then send it to the storage engine. Internally it looks the keys set in the `attributes` object inside your entities , loop on it and will call a getter to get the data for each key. It use reflection to check if you defined a specific getter for an attribute, say you have an attribute `foo` in your entity, the uow will check if the entity has a `getFoo` method, if it does it will use this method to get the data; otherwise it use the generic method `get` with the attribute name as argument.

## Storage engine

### Create your own

The framework comes built in with 3 storage types, but you can easily add your own in case you're not fully satisfied the ones available at your disposition. This process involves 3 types of objects: the actual storage engine, a factory to build one and a store mapper.

The storage must be created as follow:
```js
namespace('Wherever.You.Want');

Wherever.You.Want.MyStorage = function () {
    Sy.Storage.EngineInterface.call(this);
};
Wherever.You.Want.MyStorage.prototype = Object.create(Sy.Storage.EngineInterface.prototype, {
    //implement the methods here
});
```
To know how to implement the storage methods please refer to the file `src/Storage/EngineInterface.js` and read the docblocks for each method.

The next step is to create a store mapper, this kind of object is used to transform the entities metadata objects into objects understandable by the storage engine.
```js
namespace('Wherever.You.Want');

Wherever.You.Want.MyMapper = function () {
    Sy.Storage.StoreMapperInterface.call(this);
};
Wherever.You.Want.MyMapper.prototype = Object.create(Sy.Storage.StoreMapperInterface.prototype, {
    transform: {
        value: function (meta) {
            var store = {};

            store.alias = meta.name;
            store.name = meta.name.toLowerCase().replace('::', '/');
            store.identifier = meta.uuid;
            store.indexes = meta.indexes;

            return store;
        }
    }
});
```
Here, the only modification you should do is how the `store.name` is set. The code above is the one used by the rest mapper and transform the alias `Foo::Bar` to `foo/bar` so the full url called to create the entity would look like `/path/to/api/foo/bar/`.

Next, the engine factory:
```js
namespace('Wherever.You.Want');

Wherever.You.Want.MyFactory = function () {
    Sy.FactoryInterface.call(this);
};
Wherever.You.Want.MyFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {
    make: {
        value: function (name, version, stores) {
            //build your engine here and return it
        }
    }
});
```
The `name` is the one specified in your manager conf under the name `storageName` (default to `app::storage`); the `version` is also the one specified in the manager conf.
The `stores` is an array of definition that will be handled by this engine. It contains the objects created by your store mapper. Basically it indicates you to create a *container* for each type of entity data that will be managed via your engine. It's the exact same notion used by the native *IndexedDB* api.

Now that all the classes has been defined, let's register all this in the framework. First you need to define your factory and store mapper as services:
```js
Sy.kernel.getContainer()
    .set({
        'factory::service::name': {
            constructor: 'Wherever.You.Want.MyFactory'
        },
        'storemapper::service::name': {
            constructor: 'Wherever.You.Want.MyMapper'
        }
    });
```
*Note*: read the [service container](service-container.md) chapter to see how to define these services inside your bundle.

Once you registered them, you need to add you engine type to the configuration like so:
```js
Sy.kernel.getConfig()
    .get('parameters.storage.engines')
    .push({
        name: 'engineName',
        factory: 'factory::service::name',
        mapper: 'storemapper::service::name'
    });
```
And that's all! Now you can specify `engineName` as the engine type used by your managers.

As you understood, `parameters.storage.engines` is a simple array predefined with the 3 builtin engines. So if you only want to change the store mapper of one of them, you can simply change the value of `mapper` for the engine you want and point it to the mapper service you've built.

As you can see, you can easily build your own engine and distibute it so it can be reused inside other projects.

### Rest engine

This engine as a specifity compared to the 2 other ones, it's about the security. As it makes calls to your server you may want to add a header containing a token to identify a user.

You can add set of headers that will be added to each requests the engine makes via the method `setHeaders` (it accept an object as parameter).

Example:
```js
storage.getManager().getEngine().setHeaders({
    'X-Authentication': 'user secret token' //could be an oauth token
});
```

To work properly you also need to specify the url structure for the engine requests, this one is defined in the kernel config (`Sy.kernel.getConfig()`) under the name `parameters.api.basePath`. Example: `/api/{{version}}/{{path}}/{{key}}`.
The `{{path}}` and `{{key}}` placeholders are required; the first one is replaced by the `store.name` as you've seen in the previous section with the store mapper, the second one will be replaced by the entity `uuid`.
The `{{version}}` placeholder, if defined, will be replaced by the version number defined in the manager configuration.

With the path described above you could have those HHTP requests:

* `GET /api/1/foo/bar/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`: get the data for the entity with the uuid `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
* `POST /api/1/foo/bar/` create a new entity
* `PUT /api/1/foo/bar/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`: update the entity data with the uuid `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
* `DELETE /api/1/foo/bar/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`: remove the entity with the uuid `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
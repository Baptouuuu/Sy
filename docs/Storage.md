# Storage

The storage engine used in Sy is based on 6 layers:

* [Core](#core)
* [Manager](#manager)
* [Repository](#repository)
* [Entity](#entity)
* [Engine](#engine)
  * [Store](#store)

## Core

This is the main object to access the whole mechanism; it holds your managers. It is available as a service under the name `sy::core::storage`.

### Usage

```js
var storage = Sy.service.get('sy::core::storage');
storage.getManager('myManagerName');
```
**Note**: If no manager name specified it will look for a default one named `main`.

## Manager

A manager holds a set of entities repositories around a specific engine.

### Configuration

You configure your managers with the [configurator](Configurator.md) `Sy.config` with the key `storage.managers`:
```js
Sy.config.set('storage.managers', {
  main: {
    type: 'engine type', //available types: "rest", "indexeddb", "localstorage"
    storageName: 'app::storage',  //used by indexeddb and localstorage as key for the storage (optional)
    version: 1, //version number of the engine (especially used for indexeddb)
    mapping: [
      'repositoryName'
    ]
  }
});
```
In this case `main` is the name of your manager and can be changed to what fits you the best. If you use the storage inside the framework the `repositoryName` will be the alias of the entity (ie: `BundleName::EntityName`).

**Note**: You can leave the mapping array empty if you don't want to restrict the manager control; but the `mapping` key MUST be set with a blank array.

### Usage

```js
manager.getRepository('repositoryName');
```
If you try to get a repository not mapped to the manager it will raise a `ReferenceError`.


## Repository

The repository helps you manipulate a specific Entity type, like adding, updating, deleteing and finding entities.

### Usage

##### Create/Update

```js
repository.persist(entity);
repository.flush();
```
The `persist` method above will create the entity in the storage if does not exist yet, otherwise it will update it. However those modifications will not be applied directly, it will be done once you call `flush`.

**Note**: flushing all modification at once is not a real problem concerning performance as the engines provided are all asynchronous, so it will not freeze the UI.

#### Delete

```js
repository.remove(entity);
repository.flush();
```
The two line above demonstrate how you can remove an entity from the storage. If the entity has been persisted but not flushed yet, the `remove` method will prevent the entity from being created or updated; in this case you don't have to call `flush`.

#### Retrieve

```js
reposiotry.findOneBy({
  index: 'entity attribute to search',
  value: 'attribute value',
  callback: function (entity) {
    //do whatever you w ant with your entity
  }
});
repository.findBy({
  index: 'entity attribute to search',
  value: 'attribute value',
  limit: numberOfEntitiesToReturn,
  callback: function (arrayOfEntities) {
    //do whatever you w ant with your entities
  }
});
```

## Entity

An entity is a representation of your data. In order to work your entities MUST inherit from the object `Sy.Entity`.

### Definition

```js
App.Bundle.BundleName.Entity.MyEntity = function () {
  Sy.Entity.call(this);
};
App.Bundle.BundleName.Entity.MyEntity.prototype = Object.create(Sy.Entity.prototype, {
  UUID: {
    value: 'entityKey' //optional, by default the key is set to 'uuid'
  }
});
```
To allow the framework to automatically discover your entities, you MUST declare them in a bundle inside an `Entity` object.

### Indexes

In order to allow engines to allow search on attributes, you need to specify those searchable indexes like so:
```js
MyEntity = function () {
  Sy.Entity.call(this);
  this.register('indexableAttribute');
};
```

### Lock attributes

If you want to ensure only a set of attributes can be set to your entites (and so stored), you can `lock` available attributes like below:
```js
MyEntity = function () {
  Sy.Entity.call(this);
  this.lock['attribute1', 'attributeN'];
};
```
Like this only those attributes can be stored in your entity

### Relations

Often your entities are related to other ones, and so you can write those links like so:
```js
MyEntity = function () {
  Sy.Entity.call(this);
  this.register('attributeName', 'BundleName::EntityName');
};
```
To write those links allow the engine to automatically store the uuid of the traget entity under the name `attributeName`. But it won't reload the full target entity when you retrieve the `MyEntity` from the storage.

### Usage

To add or get data from/to your entity you only have two methods to know:
```js
entity.set('attributeName', 'value');
entity.get('attributeName'); //will return 'value'
```

If in some cases you want to get your entity data as a plain old javascript object, there's a method for that:
```js
entity.getRaw();
```


## Engine

An engine is an interface between the repository and the actual storage engine api. Sy comes by default with 3 engines: `rest`, `indexeddb` and `localstorage`. Each one implements the `Sy.Storage.EngineInterface` interface.

You can create your own engine by creating a factory (must implement `Sy.FactoryInterface`) generating it and then registering it by adding an object to the array defined in the configurator under `parameters.storage.engines`:
```js
Sy.config.get('parameters.storage.engines').push({
  name: 'your engine name',
  factory: 'engine::factory::name', //the factory is retrieved via a service
  mapper: 'storemapper::service'
});
```
The `mapper` defined above must be an object implementing `Sy.Storage.StoreMapperInterface`. It's used to transform entities metadata into store metada. take for example the entity metadata below:
```js
{
  name: 'BundleName::EntityName',
  repository: repositoryConstructor,
  entity: entityConstructor,
  uuid: 'identifier key',
  indexes: ['indexes registered in the entity']
}
```
The `rest` store mapper would transform it to an object like so:
```js
{
  alias: 'BundleName::EntityName',
  name: 'bundlename/entityname',
  indexes: ['indexes registered in the entity'],
  identifier: 'identifier key'
}
```

In a normal situation you won't have to deal with this level of the storage. But if you want to know how it works, you can look at the file `src/Storage/EngineInterface.js`.

**Important**: the three engines have been design to be independent from the rest of the storage mechanism, so you could use them as standalone in your projects. To understand how they are bootstraped you can look at there respective factories.

### Store

The notion of store is the raw data representation of the entity (the notion has been taken from the IndexedDB API). In all engines the name found in the entitiesMeta array is used as the store name.

**Important**: In the case of the `rest` engine the name is transformed as a url following the pattern: `/api/version/bundlename/entityname/`.


## Events

Last but not least, the three engines all use the mediator to notify you when your entities are created, updated and removed.

Channels name are:

* `app::storage::on::pre::create`, with the store name `BundleName::EntityName` and the raw data object as arguments
* `app::storage::on::post::create`, with the store name `BundleName::EntityName` and the raw data object as arguments
* `app::storage::on::pre::update`, with the store name `BundleName::EntityName`, the identifier and the raw data object as arguments
* `app::storage::on::post::update`, with the store name `BundleName::EntityName`, the identifier and the raw data object as argument
* `app::storage::on::pre::remove`, with the store name `BundleName::EntityName` and the identifier
* `app::storage::on::post::remove`, with the store name `BundleName::EntityName` and the identifier
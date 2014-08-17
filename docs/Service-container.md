# Service container

Sy is bundled with a service container object, a default instance can be retrieved from the framework kernel: `Sy.kernel.getContainer()`.

This component is here to build your objects and automatically manage the creation and injection of the dependencies.

## Creation

The process is pretty simple:
```js
var container = new Sy.ServiceContainer.Core();
```

Done!

## Adding a service

Once again it's very simple:
```js
container.set({
  serviceA: {
    constructor: 'Foo'
  },
  serviceB: {
    constructor: 'Bar'
  }
});
```

Here, you just created 2 services called `serviceA` and `serviceB`. When you'll call one of them (via `container.get('service name')`), internally the container will instantiate the constructor, meaning for the `serviceA` it will do `new Foo()` (the next time you'll call the service the same instance will be reused).

If you want to check afterward if a service is defined, you can call `container.has()`.

**Note**: a service is created only when you need it, so even if you declared lot of them it won't affect the page loading.

**Important**: when all the services are declared you must [compile](#compilation) the container.

## Injecting dependencies

The very interesting part of the container is to inject dependencies in your services, so you can keep your code loosely coupled. With this component it's done via setters, like so:

```js
container.set({
  serviceA: {
    constructor: 'Foo',
    calls: [
      ['setDependency', ['@serviceB']]
    ]
  },
  serviceB: {
    constructor: 'Bar'
  }
});
```

Now when the `serviceA` will be instanciated, it will call the method `setDependency` on it with the instance of `serviceB` as argument.

Of course you can add as many calls as you want, and as many arguments as you want.

## Parameters

A good practice is not to harcode some variables in your classes but centralize them in one place and then inject them in your classes.

This component provide a solution to this problem with the notion of parameters. It's an instance of `Sy.Configurator` that is injected in the container and them you can access it via a specific syntax.

```js
var params = new Sy.Configurator();

params.set({
  debug: true,
  sub: {
    level: 'info'
  }
});

container.setParameters(params);
container.set({
  serviceA: {
    constructor: 'Foo',
    calls: [
      ['setDebug', ['%debug%']],
      ['setInfo', ['%sub.level%']]
    ]
  }
});
```

Above you have an example how to inject a set of parameters in the container. You then have an access to them as arguments of your setters by using the syntax `%param.name%`. The dotted notation means a nested object.

You can event drop the reference to the `params` variable as you can retrieve the parameters from outside the container by calling `container.getParameter()` (you can even check if a parameter exist via `container.hasParameter()`).

## Private services

When you declare dependencies in the container you may not want them to be accessible from the outside world. To prevent this you must declare a dependency as `private` like so:

```js
container.set({
  serviceA: {
    constructor: 'Foo',
    calls: [
      ['setB', ['@serviceB']]
    ]
  },
  serviceB: {
    constructor: 'Bar',
    private: true
  }
});
```

Here your `serviceB` will be accessible as a dependency to `serviceA` but will not be accessible by directly calling it via `container.get('serviceB')`.

**Note**: the value of `private` is not important, it just has to be present.

## Factories

Some times, you'll want to have a greater control on how to create an instance of a class. This is where factories come into place, instead of the container building directly the instance, it will call your factory to build the wished instance.

```js
container.set({
  fooFactory: {
    constructor: 'FooFactory'
  },
  foo: {
    constructor: 'Foo',
    factory: ['fooFactory', 'make']
  }
});
```

Here when you'll access the service `foo`, the container will create an instance of `FooFactory` and will call the `make` method with `Foo` as argument. Passing the desired object class as an argument to the factory allow you to build generic factories.

The container will expect the factory to return an instance of `Foo`, if it does not it will throw a `TypeError`.

Because each of them are standard services, all the other services features are still available.

## Configurator

In some cases you'll need some complex code to bootstrap a service, for example if you need to transform data coming from another source or different service. Instead of injecting the other service and handling in your object the data transformation, you can use a configurator. It's goal is to decouple the process of data retrieval/transformation from your service; so you can keep your object clean and to the point.

```js
container.set({
  fooConfigurator: {
    constructor: 'FooConfigurator'
  },
  foo: {
    constructor: 'Foo',
    configurator: ['fooConfigurator', 'configure']
  }
});
```

When your service `foo` is fully instanciated (meaning you can add calls), the configurator is created and the method `configure` is called with the service `foo` as argument. It's the last chance to alter your service before it's returned.

## Prototype services

By default the container keep the instance of a service, so you can keep the number of objects low. But in some cases, you don't want this behaviour and instead need a new instance each time you access the service (ie: a new `Map` object as dependency for your objects).

```js
container.set({
  map: {
    constructor: 'Map',
    prototype: true
  }
});
```

Now, each time you call `container.get('map')` a new instance of `Map` will be created.

**Note**: the value of `prototype` is not important, it just has to be present.

## Service inheritance

In development it's not uncommon that many classes inherit from a parent one, you can achieve the same behaviour with the container.

```js
container.set({
  parent: {
    constructor: 'Parent',
    calls: [
      ['setter', ['some value']]
    ]
  },
  child: {
    constructor: 'Child',
    calls: [
      ['ownMethod', ['specific to the child']]
    ],
    parent: 'parent'
  }
});
```
When the container will be [compiled](#compilation), the definition of the parent will be applied to its children. In this case, when the `child` service is built, the method `setter` is called and then `ownMethod`.

A service can also inherit the `factory` and the `configurator`, only if the child has none specified.

In the case your parent is not a real service, you can omit its `constructor` and should flag it as `abstract` (so the container will remove it at compilation time).

**Note**: the value of `abstract` is not important, it just has to be present.

## Tagging

By themselves, tags don't have any meaning for the container. This feature is here to help you flag services having a specific meaning in your application.

Say for example you have a storage mechanism which support many storage adapter. You could set each adapter in the container and flag it with a tag of your own (a tag is just a string so you can use whatever you want).

```js
container.set({
  webStorage: {
    constructor: 'WebStorageAdapter',
    tags: [
      {name: 'storage.adapter'}
    ]
  },
  localStorage: {
    constructor: 'LocalStorageAdapter',
    tags: [
      {name: 'storage.adapter'}
    ]
  }
});
```

As you can see, you specify a tag inside an object under the `name` property (you can add aditionnal value in those objects). As `tags` is an array, you can specify as many tags as you want.

Now, you can find all the services flagged with your tag like so:

```js
container.findTaggedServiceIds('storage.adapter');
```

This will return an array, in our case it will look like this:

```js
[
  {
    id: 'webStorage',
    tags: [
      ['storage.adapter', {name: 'storage.adapter'}]
    ]
  },
  {
    id: 'localStorage',
    tags: [
      ['storage.adapter', {name: 'storage.adapter'}]
    ]
  }
]
```

With this information you could retrieve these services from the container and inject them in your storage mechanism.

As the data returned contain the full object used to declare the tags, you could in our case add an `alias` attribute (alongside `name`) that could then be used in your mechanism. The only limit with what you can with it is only your imagination.

## Aliasing

To avoid name conflicts in the container, it's a good practice to namespace the services name. But in can quickly be heavy to repeat a long string throughout your application to access your service. To overcome this problem, you can alias a service with a different name.

```js
container.set({
  'some::very::long::namespace': {
    constructor: 'Whatever'
  },
  'whatever': '@some::very::long::namespace'
});
```
Now, instead of calling your service with the very long name, you can go with `whatever`. This is intended for services used throughout your application, so only a few services should have an alias.

## Compilation

This is the most advanced topic about the service container, but still very simple to understand. This step is necessary before you can properly use your container (and is done by calling `container.compile()`.

**Note**: if you create your own instance of the container, you need to inject the compiler in the container: `container.setCompiler(new Sy.ServiceContainer.Compiler())`.

As you saw above, you can use the shortcuts `%param%` and `@service` as references to a parameter or a service. This magic is handled by 2 compiler passes.

The goal of a compiler pass is to alter the services definitions. For these 2, it will replace respectively the strings by instances of `Sy.ServiceContainer.Parameter` and `Sy.ServiceContainer.Reference`, this with these 2 that the container really understand to go pick a parameter or a service.

Usually you'll work with compiler passes when you work with tags.

To take back the tag example above, before we needed to build the storage mechanism and every adapter so they can be injected. The problem here is that even if the storage is not used it's fully initialized, so it take execution time and memory for nothing.

Instead, we could use a compiler pass to retrieve the tagged services definition and alter the definition of the storage mechanism. A such pass would look like this:

```js
var StorageAdapterPass = function () {};
StorageAdapterPass.prototype = Object.create(Sy.ServiceContainer.CompilerPassInterface.prototype, {
  /**
   * @inheritDoc
   */
  process: {
    value: function (container) {
      var ids = container.findTaggedServiceIds('storage.adapter'),
          storageDef = container.getDefinition('myStorage');

      ids.forEach(function (el) {
          storageDef.addCall('setStorageAdapter', ['@' + el.id]);
      });
    }
  }
});

container.addPass(new StorageAdapterPass());
```
The example above at compilation time look for every service tagged with `storage.adapter` and add a new call to the `myStorage` service. So when the latter will be called, it will automatically call `setStorageAdapter` with a instance of every adapter as argument.

This would allow to easily create a storage engine and share it with the rest of the world, and people could easily add their own adapters.

The `addPass` method allow a second parameter named `type`. The passes are devided into 5 groups, you can see them as constants of the `[CompilerPassInterface](../src/ServiceContainer/CompilerPassInterface.js)` interface.

* `[BEFORE_OPTIMIZATION](../src/ServiceContainer/CompilerPassInterface.js#L17)`, the default if no type specified when calling `addPass`
* `[OPTIMIZE](../src/ServiceContainer/CompilerPassInterface.js#L22)`
* `[BEFORE_REMOVING](../src/ServiceContainer/CompilerPassInterface.js#L27)`
* `[REMOVE](../src/ServiceContainer/CompilerPassInterface.js#L32)`
* `[AFTER_REMOVING](../src/ServiceContainer/CompilerPassInterface.js#L37)`

Internally the component use the second and fourth ones. When optimizing, it replace parameters and services placeholders and apply the parent definitions to the childs. And then remove the abstract definitions and replace alias definitions by the real service definition behind it.

Usually you'll stick with the default type (`BEFORE_OPTIMIZATION`).
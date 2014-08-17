# Service container

Sy is bundled with a service container object, a default instance can be retrieved from the framework kernel: `Sy.kernel.getContainer()`.

## Creation

If you want to create another service container in your application, the process is straightforward:

```js
var myContainer = new Sy.ServiceContainer('my container name');
myContainer.setParameters({
  foo: {
    bar: 42
  }
});
```

The name passed to the constructor has no real purpose, except to identify more easily your containers; as it's not used internally by the object you can omit it.

The parameters setted is used afterward when building your services. In the context of the framework, the parameters object is a reference to the object defined in the framework config under the path `parameters`.

## Adding a service

You can add services by two methods as described below.

### By definition

```js
myContainer.set({
  'service::name': {
    constructor: 'Path.To.Constructor.Function',
    calls: [
      ['setterFunctionName', ['arguments', 'list']]
    ]
  }
});
```
The code above will register a new service called `service::name`, when first called the container will instantiate a new object `Path.To.Constructor.Function` and then call the functions registered in the `calls` array.

In the arguments list of calls, the container allow you to define two type of shortcuts:

* `@another::service::name`: the container will transform this string to the appropriate service object
* `%param.name%`: the container will transform this path into the value defined in the parameters object


### By creator

Setting up a service require at least 2 parameters:

* a unique name
* a function that will return an object (your service object)

Example:
```js
myContainer.set('app::serviceName', function () {
  var service = new App.MyService();
  service.inject(this.get('app::otherService'));
  service.setParam(this.getParameter('param.name'));
  return service;
});
```
**Note**: the function constructing your service is not called when setting the service, but only the service time you access it via `myContainer.get()`. This is very useful when you have to inject services into other ones, so you don't have to wonder in which order to declare them, just do it in one place and then when accessed it will load what's needed.
The other advantage is that it won't load a whole service if it's never used in your app.

To ease the process of injecting other services, the `this` variable of the service constructor is set to the service container instance. So you can do something like `this.get('otherService')` in the constructor.
You also have access to the parameter object through the method `getParameter` taking your variable path string as argument.

**Restrictions**:

* the container will prevent you from overriding an existing service if you try to reuse a service name
* the service name must follow the regular expression: `^([a-z]+::|[a-z]+)+$`
* you can't directly set an object literal as a service (instead of the constructor function or the constructor path)

Those restrictions are shared by the two ways of defining services.

## Retrieving a service

Example:
```js
var service = myContainer.get('app::serviceName');
```

## Tags

Sometimes you'll want to flag certain types of services (ie: all event subscribers). For that purpose, the service container has a notion of tags. It's simply an array of objects that is attached to a service, each object must have a name to identify them (multiple objects can have the same name).

### By definition

```js
container.set({
  'foo': {
    constructor: 'Class.Path',
    tags: [
      {name: 'event_subscriber', event: 'foo'},
      {name: 'event_subscriber', event: 'bar'}
    ]
  }
});
```

### By creator

```js
container.set(
  'foo',
  function () {
    return new Class.Path();
  },
  [
    {name: 'event_subscriber', event: 'foo'},
    {name: 'event_subscriber', event: 'bar'}
  ]
);
```

### Filtering

You can retrieve a list of the services defined with one of the tags name set to a wished value, like so:
```js
var serviceNames = container.filter('event_subscriber');
```
With the services defined above, `serviceNames` would look like this `['foo']`.

### Service tags

You can also retrieve all the tags attached to a service.
```js
var tags = container.getTags('foo');
```
With the services defined above, `tags` would look like this:
```js
[
  {name: 'event_subscriber', event: 'foo'},
  {name: 'event_subscriber', event: 'bar'}
]
```

# Service container

Sy is bundled with a service container object, a default instance can be found in the object `Sy.service`.

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

The parameters setted is used afterward when building your services. In the context of the framework `Sy.service.parameters` is a reference to the object defined in `Sy.config` under the path `parameters`.

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

A 3rd argument is possible to the `set` method, it accept an array. This one will be used as a list of arguments to the service constructor function.

Example:
```js
myContainer.set('app:serviceName', function (defaultAnswer) {
  var service = new App.GreatQuestion();
  service.setAnswer(defaultAnswer);
  return service;
}, [42]);
```
This possibility can be useful to dynamically generate services (ie: from a config object) and using variables without creating closures.

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
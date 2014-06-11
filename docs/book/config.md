# Configuration

[< Previous chapter (Service container)](service-container.md) | [Next chapter (Validation) >](validation.md)

Another important point of the framework is the global config object. It's there that you put all your global variables used afterward by your services. It's a really useful features, as you can easily declare some sort of flags so you can quickly change the behaviour of your app when switching environments. An example of that is the `env` key used by the framework, in normal case the logger used by the framework handles every log level, but in the case where `env` is set to `prod` the framework kernel will disable all levels except the `ERROR` one, as you only care about errors happening in your prod environment.

But now, how to define those variables and where?

## App bootstrap

The first approach is to keep your global configuration is a neutral place (no context around). The perfect place for that is the file you use to *boot* the framework kernel ([see fundamentals](fundamentals.md#app-bootstrap)).

Here's an example:
```js
Sy.kernel.getConfig()
    .set('env', 'dev');

//... kernel boot
```
You should keep the config here to a minimal, avoid setting variables directly related to part of your code.

## In your bundle

It use the same principle as the service container one, at boot time the framework parse your app and will look for an object `Config.Configuration` inside your bundle. If it find one, it will instanciate it and call the method `define` and passing the config object ([`Sy.ConfiguratorInterface`](../../src/ConfiguratorInterface.js) instance).

Here's how you define such class:
```js
namespace('App.Bundle.BundleName.Config');

App.Bundle.BundleName.Config.Configuration = function () {};
App.Bundle.BundleName.Config.Configuration.prototype = Object.create(Object.prototype, {
    define: {
        value: function (config) {
            config.set('some.config', 'value');
        }
    }
});
```
As your app will grow you'll use more and more bundles and this approach will become more suitable to have your variables related to part of your code next to it. In this place you should put variables used by your services but not directly acting as global *flag* to your app. Of course you can still do it the way you want, but I think it's a good convention to use it like described.

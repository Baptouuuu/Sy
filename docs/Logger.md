# Logger

Sy comes with a simple logger with 4 levels of logs:

* `debug`: to be used only to traces bugs during development
* `log`: for various events, like the steps during app bootstrap
* `info`: for more important events
* `error`: for all errors that can occur in your app

The logger by itself does nothing, it uses `Handlers` to pass the informations. It's then up to the `Handler` to output the data wherever it wants. You need to specify one handler per log level.

By default Sy gives you only one handler called `Console`, outputting the data to the developer console.

At this point you could ask why do I need a logger when I have `console.(debug|log|info|error)` to do it. For a development environment that's OK but when your app goes to production you're not there to open the console and see what's going wrong.

That's here where the logger is helpful, especially with the notion of handlers. You could imagine setting the `Console` handler when you're in dev mode, and easily switch to another handler when you go to prod without modifying your code. (You could for example create a handler sending all errors to your server)

## Creation

```js
var logger = new Sy.Lib.Logger.CoreLogger('name');
```

The name specified in the constructor is used afterward in the handler, in the case of the `Console` one it prints this name alongside of the log level to identify more easily where it comes from.

**Note**: If you decide to create your own logger you should implement [`Sy.Lib.Logger.Interface`](../src/Lib/Logger/Interface.js) to keep the same logic as the framework.

## Attaching a handler

```js
var handler = new Sy.Lib.Logger.Handler.Console(logger.LOG);
logger.setHandler(handler, logger.LOG);
```

Like said before a handler handles only one log level, the one specified in the handler constructor. The `CoreLogger` provides the levels under the constants: `DEBUG`, `LOG`, `INFO` and `ERROR`.

When setting the handler into the logger, you specify once again the level so the logger knows the handler is specific to the specified level.

**Note**: If you decide to write your own handler for the `CoreLogger` it must implement [`Sy.Lib.Logger.Handler.Interface`](../src/Lib/Logger/Handler/Interface.js), otherwise the `setHandler` will fail.

## Usage

The second parameter can be whatever you want.
```js
logger.debug('some debug message', {attached: 'data'});
logger.log('some message', {attached: 'data'});
logger.info('some important message', {attached: 'data'});
logger.error('critical error', {attached: 'data'});
```

In the case of using the `CoreLogger` and the `Console` handler for each level, this will output:
```
[2014-01-19 13:37:00] name.DEBUG some debug message Object {attached: "data"}
[2014-01-19 13:37:00] name.LOG some message Object {attached: "data"}
[2014-01-19 13:37:00] name.INFO some important message Object {attached: "data"}
[2014-01-19 13:37:00] name.ERROR critical error Object {attached: "data"}
```
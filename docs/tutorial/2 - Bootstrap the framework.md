# Bootstarp the framework

For now we only have standard html that doesn't do much by itself. It's time to start working with the framework.

First include the js file and the dependencies. So put this at the end of the `body`:
```html
<script src="vendor/Reflection.js/reflection.min.js"></script>
<script src="vendor/moment/moment.js"></script>
<script src="vendor/observe-js/src/observe.js"></script>
<script src="vendor/underscore/underscore-min.js"></script>
<script src="vendor/sy/dist/framework.js"></script>
```

When you include the framework javascript, it only declares its classes under the global variable `Sy`. Meaning: it doesn't messup the `window` variable and it doesn't do anything by itself until you tell it to.

## Kernel

The first javascript you need to write is called the kernel. This is where all the pieces of the framework are tied together.

You can find the bare kernel needed as a [dist file](../../AppKernel.js.dist), copy it and put it in the file `js/App/Kernel.js`.

This file is where you declare all the bundles used. Reminder, a bundle is where you put your code, in a structured manner, related to a feature of your app.

For this app, we'll create a bundle called `AddressBook`. By convention a bundle is placed in the object `App.Bundle`.

So our kernel should look like this now:
```js
namespace('App');

App.Kernel = function (env, debug) {
    Sy.Kernel.Core.call(this, env, debug);
};
App.Kernel.prototype = Object.create(Sy.Kernel.Core.prototype, {
    registerBundles: {
        value: function () {
            return [
                ['SyFrameworkBundle', Sy.FrameworkBundle],
                ['SyHttpBundle', Sy.HttpBundle],
                ['SyFormBundle', Sy.FormBundle],
                ['SyStorageBundle', Sy.StorageBundle],
                ['SyTranslatorBundle', Sy.TranslatorBundle],
                ['SyValidatorBundle', Sy.ValidatorBundle],
                ['SyViewBundle', Sy.ViewBundle],
                ['SyAppStateBundle', Sy.AppStateBundle],
                ['AddressBook', App.Bundle.AddressBook]
            ];
        }
    }
});
```

Now we need to tell the framework to launch itself. You can do it in a `script` tag our in a new file put at the end of the html file.

The code needed:
```js
var app = new App.Kernel('dev', true);

try {
    app.boot();
} catch (e) {
    //if an error is thrown it may indicate
    //the framework doesn't work for this browser
}
```
Here we're launching the framework with the environment set to `dev` and the debug flag is set to `true`.

At this point the app won't work as we didn't created our bundle namespace. For now you can simply call `namespace('App.Bundle.AddressBook')` before booting the app.

## Behind the scenes

When you boot the kernel, the framework will do some checks to verify it can work correctly in the browser. Then it will look in each of the declared bundles the defined controllers, the defined entities, the services definitions, the configuration variables and the validation rules if any.

It also look for all the DOM elements containing the `data-sy-view` attribute and register these viewscreens.

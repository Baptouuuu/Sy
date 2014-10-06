# Routing

Now that we have the framework launched, let's start playing a bit with it.

The simplest thing to work with is the routing system. Here we'll simply wire up our viewscreens so we can easoly navigate between them.

## Configuration

To define routes, we do it via the global config object. To keep things organized, create a `Configuration` file in our bundle.

```js
namespace('App.Bundle.AddressBook.Config');

App.Bundle.AddressBook.Config.Configuration = function () {};
App.Bundle.AddressBook.Config.Configuration.prototype = Object.create(Object.prototype, {
    define: {
        value: function (config) {
            config.set('routes', {
                home: {
                    path: '/',
                    parameters: {_viewscreen: 'home'}
                },
                create: {
                    path: '/profile/create',
                    parameters: {_viewscreen: 'create'}
                },
                edit: {
                    path: '/profile/{id}',
                    parameters: {_viewscreen: 'edit'},
                    requirements: {
                        id: '\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12}'
                    }
                }
            });
        }
    }
});
```

Here we have defined our routes for our 3 viewscreens. Now the framework will automatically display the appropriate viewscreen when you visit one these url: `index.html`, 'index.html#/', `index.html#/profile/create` or `index.html#/profile/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`. It can do so because it detected the `_viewscreen` parameter on your route, if it doesn't find one, it won't do anything.

**Important**: in case you don't use requirements on route placeholders, be careful on the order you declare your routes. ie: here if `edit` was declared before `create`, the url '/profile/create' would have matched `edit` with an id of `create`.

**Note**: if you go try this code, you'll notice it doesn't work. If you open your console, there's a log telling you the framework can't find a controller for your viewscreen. You always need to declare a controller for a viewscreen. Head up to the next step to see how to declare a controller.

As the framework uses url hash to route in your app, you can use standard html in your viewscreen to point to another viewscreen. For example in the home toolbar you can wrap the add button in an anchor, the resulting should look like this:

```html
<a href="#/profile/create">
    <paper-icon-button icon="add"></paper-icon-button>
</a>
```

You can modify other buttons in the app to point to appropriate viewscreens (like the back button).
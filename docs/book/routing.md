# Routing

[< Previous chapter (Event subscribers)](event-subscribers.md)

For almost all front end framework the app start with the routing, in Sy it's the opposite. The routing system has been built last, so the mechanism can be totally decoupled from the rest of the framework, a key point in the pilosophy of this project (every component can be used outside the framework).

So in the full stack framework, the goal of this engine is to map a url to a [viewscreen](ui.md). When the url changes, the ui must update accordingly.

## Defining routes

First thing first, let's add our routes. You specify them in the [config](config.md) object:
```js
config.set('routes', {
    home: {
        path: '/',
        parameters: {
            _viewscreen: 'viewscreen name of your home page'
        }
    },
    about: {
        path: '/about',
        parameters: {
            _viewscreen: 'viewscreen name of the about page'
        }
    },
    article: {
        path: '/article/{id}',
        parameters: {_viewscreen: 'viewscreen nale'},
        requirements: {
            id: '\\d+'
        }
    }
});
```
Now when you'll go to `index.html` or `index.html#/`, it will map to the home route an the framework will automatically display the viewscreen specified as parameter via `_viewscreen`.

The other 2 routes are accessible via `index.html#/about` and `index.html#/article/42`. Using the url hash allows you to keep standard html in your viewscreen. For example in your home page you can have this standard anchor to route to the about page:

```html
<a href="#/about">About</a>
```

## Pre-rendering viewscreens

This mechanism allows you to pre-render your viewscreen if you subscribe to the appstate change event with a priority to `0`. It means your callback will be called before the one displaying the viewscreen. And it means you'll need to access the view engine to retrieve the viewscreen wrapper.

Or you can also just listen on the pre display event of the view engine and then access the current app state from this listener to get access to url params.

Of course both choices are valid and it's just a matter of taste.

It can be great to do this so you don't wait the viewscreen controller to load and then render the viewscreen. It will feel a bit better for your users.

## Autoboot

If the routes parameter is set in the configuration, the framework will automatically boot the appstate engine. So in the case you don't use routes, it won't add extra processing on your app.

# AppState

This component is here to help you bind an url (hashbang) to anything you want. It builds upon the history api (`replaceState` and `popstate`) and the changes made on the url hash.

For example, say you've defined a route named `profile` corresponding to the path `/profile/{id}`, when you'll navigate to `/path/to/index.html#/profile/42` the component will fire an event with an reference to the state related to the route and a referenec to the route definitions. Via this event you'll know you are on the route named `profile` and the url placeholder `id` is set to `42`. From there, you can do whatever you want, but you'll most likely whant to change the user UI.

**Note**: this component relies on the [generator](../src/Lib/Generator/UUID.js) to uniquely identify a state and the [mediator](Mediator.md) to fire the event.

Before jumping into how to use all this, let's start with a bit of naming conventions. The 2 main principles are the `Route` and the `State`.

The first one is static representation of a url path. It says, for a given name I have a given url with (or without) placeholders. You can event specify what a placeholder must look like (this called a requirement and takes the form of regular expression).

The state is when you access a specific route, it means that a new `State` object is created to reference the route matched and also contains the placeholders values if any.

## Entry point

The first interaction you'll have with the mechanism is via the engine [core](../src/AppState/Core.js) (in the framework it's accessible via the [service](Service-container.md) called `sy::core::appstate`).

On this object you have access 2 methods: `getUrl` and `getCurrentState`.

The firt one return the app path contained in the url hash. Use this method so you don't have to parse it yourself.

**Note**: the default path is always `/`, so even if there's no hash in the url it will fallback to `/`.

The second method return an instance of [`State`](../src/AppState/State.js). It always represent the url currently matched. From here, you have access to the route name matched and the variables contained in the path; respectively accessible via the methods `getRoute` and `getVariables`.

```js
var core = container.get('sy::core::appstate'),
    state core.getCurrentState(); //return an instance of Sy.AppState.State

state.getRoute(); //return the route name
state.getVariables(); //return a plain old js object
```

## Adding routes

Step back a moment. For the thing to work we actually need to specify routes. This is done via the route provider (you can access it via the service `sy::core::appstate::routeprovider`).

You specify a route like this:
```js
provider.setRoute(
    'the route name',
    '/path/to/your/{resource}',
    {
        resource: 'some value',
        extraValue: 'data related to the route'
    },
    {
        resource: 'regular expression string'
    }
);
```
The last 2 parameters are optional. The first object represent the *parameters*, if a key match a placeholder it will be used as default value when you generate the route; but you can also specify extra data (more is explained in the associated book entry).

The second object is where you specify the requirements on your placeholders. Say you have a path to display a profile page and you only want the id to be an integer; so you would have a path like this `/profile/{id}` and the associated requirements object like this `{id: '\\d+'}`. And as it uses regular expression you can restrict the placeholder the way you want.

**Important**: be careful about the order you specify your routes, for example if you specify a path `/{article}` and then `/edit/{article}`, if you reach the url `/edit/42` it will always match the first path and the `article` will be set to `edit/42`. So always remember the order you specify your routes and you should specify requirements as mush as possible to avoid this kind of *problem*.

Once a route is set you can retrieve it via the method `getRoute(routeName)` or check if one is defined via `hasRoute(routeName)`. You can also retrieve all routes at once as an array via `getRoutes()`.

## Listen for state change

Instead of manually listen to the url change, you can listen to the mediator channel `appstate.change` and you will receive an instance of [`AppStateEvent`](../src/AppState/AppStateEvent.js).

Example:
```js
mediator.subscribe({
    channel: 'appstate.change',
    fn: function (event) {
        event.getState(); //return the new state object
        event.getRoute(); //return the route definition associated to the state
    }
});
```

## Generate a url

You do this via the router (accessible via the service `sy::core::appstate::router`).

Example:
```js
provider.setRoute('editProfile', '/profile/edit/{id}', {id: 42}, {id: '\\d+'});
router.generate('editProfile', {id: 12}); // return '/profile/edit/12'
router.generate('editProfile'); //return '/profile/edit/42'
router.generate('editPtofile', {id: 'some string'}); //throw a SyntaxError as id doesn't fulfill its requirement
```

## Conclusion

As you can see, with very little code you can map a path to any code you want. And you can also be very strict on the url matching via the notion of requirements.
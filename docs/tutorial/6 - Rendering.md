# Rendering

So now that we can create, and save, profiles, we will look at displaying them back in the home page. As we want this list to always be fresh, we will render it each time the user go back to this page.

The best place to do this is in an appstate subscriber, because it's the only place you know when the user reach a specific route.

So create the file at `js/App/Bundle/AddressBook/Subscriber/AppStateSubscriber.js`:

```js
namespace('App.Bundle.AddressBook.Subscriber');

App.Bundle.AddressBook.Subscriber.AppStateSubscriber = function () {
    this.viewManager = null;
    this.storage = null;
};
App.Bundle.AddressBook.Subscriber.AppStateSubscriber.prototype = Object.create(Sy.EventDispatcher.EventSubscriberInterface.prototype, {

    /**
     * @inheritDoc
     */

    getSubscribedEvents: {
        value: function () {
            return {
                'appstate.change': {
                    method: 'onChange',
                    priority: -1
                }
            };
        }
    },

    /**
     * Set the view manager
     *
     * @param {Sy.View.Manager} manager
     */

    setViewManager: {
        value: function (manager) {
            this.viewManager = manager;
        }
    },

    /**
     * Set the storage mechanism
     *
     * @param {Sy.Storage.Core} storage
     */

    setStorage: {
        value: function (storage) {
            this.storage = storage;
        }
    },

    /**
     * Pre-render the viewscreen when accessing home page
     *
     * @param {Sy.AppState.AppStateEvent} event
     */

    onChange: {
        value: function (event) {
            var route = event.getState().getRoute(),
                viewscreen = this.viewManager
                    .getViewScreen(
                        event.getRoute().getParameter('_viewscreen')
                    );
            if (route === 'home') {
                this.storage
                    .getManager()
                    .getDriver()
                    .whenOpened()
                    .then(function () {
                        return this.storage
                            .getManager()
                            .getRepository('AddressBook::Profile')
                            .findAll();
                    }.bind(this))
                    .then(function (profiles) {
                        viewscreen
                            .getLayout('body')
                            .getList('contacts')
                            .render(profiles);
                    });
            }
        }
    }

});
```
And declare the service like this:
```js
container.set({
    'addressbook::subscriber::appstate': {
        constructor: 'App.Bundle.AddressBook.Subscriber.AppStateSubscriber',
        calls: [
            ['setViewManager', ['@sy::core::view::manager']],
            ['setStorage', ['@storage']]
        ],
        tags: [
            {name: 'event.subscriber'}
        ]
    }
});
```
**Note**: take a look at the [book](../book/service-container.md) to check where to define your services.

So now, if you look back at the `onChange` method on the subscriber, we check if we are on the `home` route, if so we retrieve all the entities with the alias `AddressBook::Profile` (this alias means the entity `Profile` from the bundle `AddressBook`).

In this code, there's a specificity as we use the indexeddb driver; as it opens the database asynchronously, we need to verify it's opened before requesting the database via the method `whenOpened` on the driver which return a `Promise`. For the other drivers you don't need this extra code, you can directly query the database via the manager. Meaning for `localStorage` and `http` you would simplify the code like this:

```js
this.storage
    .getManager()
    .getRepository('AddressBook::Profile')
    .findAll()
    .then(function (profiles) {
        viewscreen
            .getLayout('body')
            .getList('contacts')
            .render(profiles);
    });
```

It you test the code right now nothing changed in the UI. We need to modify the html to display our profiles.

Update the `contacts` section in your home viewscreen like this:

```html
<section class="contacts" data-sy-layout="body">
    <div data-sy-list="contacts" flex horizontal layout wrap>
        <div class="contact-card" horizontal layout>
            <a href="#/profile/{{uuid}}">
                <img src="{{pictureUrl}}" alt="" >
            </a>
            <div class="infos" flex self-center>
                <div class="line">{{firstname}} {{lastname}}</div>
                <div class="line">{{address}}</div>
                <div class="line">{{zipcode}} {{city}}</div>
                <div class="line">{{phone}}</div>
            </div>
            <paper-shadow z="1"></paper-shadow>
        </div>
    </div>
</section>
```
Many things changed here, first we added the `data-sy-layout` and `data-sy-list` attributes. The first one tell the view engine that the dom element flag with it is a sub-section of our viewscreen (it's a helper to segment logically your viewscreen, so you can render only sub-section instead of rendering the whole viewscreen each time). And the later one tells that we are not rendering a normal element but expect a list of elements, and so interprets the `list` children as a template for each element of the list we will render.

The second important part are the placeholders in the form of `{{name}}`, the value between the brackets correspond to an attribute of the object passed to the render method.

In our cases, if the variable `profiles`, which is an array, (in the subscriber) contains 2 profiles, it will create 2 nodes cloned from `.contact-card`. The first one will be rendered via the object `profiles[0]` and the second one with `profiles[1]`.

If you noticed, in the html we declared the placeholder `{{pictureUrl}}` but we don't have such attribute on our entity. But as the rendering engine is smart, we don't have to actually set this attribute on our entity, instead we'll use a getter to fool it. So in the `Profile` prototype add the folowing method:

```js
getPictureUrl: {
    value: function () {
        if (this.picture instanceof Blob) {
            return URL.createObjectURL(this.picture);
        } else {
            return 'http://www.gravatar.com/avatar/00000000000000000000000000000000?s=125';
        }
    }
}
```
Now the engine detects the object has a getter for the attribute `pictureUrl` and use it to retrieve the value. Above we said that if the user has uploaded a picture we create a local url to the blob (otherwise use a generic gravatar image).

Another attribute we didn't set ourselves is the `uuid` one, it's set by the storage engine when you persist your entity.

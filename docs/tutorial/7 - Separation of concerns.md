# Separation of concerns

In the actual code there's room for improvement to better separate concerns. The first one is about the creation form, for now we specify in our controller the fields we need to build our entity. But we know the same form is used in the edit page, and we surely don't want to duplicate our code.

So the best way to remove this knowledge off of the controller, is to create a form type. It's a class where you define the fields you want, you can also define the data class you want to handle and the validation groups you want to use.

So in our case we can create the file `js/App/Bundle/AddressBook/FormType/Profile.js`:

```js
namespace('App.Bundle.AddressBook.FormType');

App.Bundle.AddressBook.FormType.Profile = function () {};
App.Bundle.AddressBook.FormType.Profile.prototype = Object.create(Sy.Form.FormTypeInterface.prototype, {

    buildForm: {
        value: function (builder, options) {
            builder
                .add('firstname')
                .add('lastname')
                .add('picture')
                .add('phone')
                .add('address')
                .add('zipcode')
                .add('city');
        }
    },

    setDefaultOptions: {
        value: function (options) {
            options.set({
                dataClass: 'App.Bundle.AddressBook.Entity.Profile'
            });
        }
    },

    getName: {
        value: function () {
            return 'profile';
        }
    }

});
```

Like in the controller we specify our fields via a form builder, here in the `buildForm` method. In the `setDefaultOptions` method we tell the engine this form type to use our entity as a data class, it means it can automatically create the entity by itself. Finally the `getName` method must return a string corrsponding to the name we will use afterward in our controller to create the form.

So before using our form type, we must tell the framework about this class. We do it by registering a new service:

```js
container.set({
    'addressbook::formtype::profile': {
        constructor: 'App.Bundle.AddressBook.FormType.Profile',
        tags: [
            {name: 'form.type'}
        ]
    }
});
```

Now, let's go back to our `saveAction` method:

```js
saveAction: {
    value: function (event) {
        var form = this.createForm('profile');

        form.handle(document.querySelector('form'));

        if (form.isValid()) {
            this
                .getStorage()
                .getManager()
                .persist(
                    form.getObject() //return a new instance of Profile
                )
                .flush();

            this.redirect('home');
        } else {
            //display some errors
        }
    }
}
```
Now the controller only knows we're handling a profile form, but doesn't know anymore about it's built. The advantage is now that you can reuse the same formula to build the edit form.

Even if the controller code is cleaner, there's still one thing we can improve. It's the `document.querySelector('form')` part. The controller shouldn't be aware of the DOM structure, this responsibility should be left to the viewscreen wrapper.

Each viewscreen is handled by a generic wrapper, but you can instruct the framework to use your own wrapper (the same goes for the layouts and lists). By convention create your viewscreens wrapper inside the `ViewScreen` namespace inside your bundle.

Example for the create page:
```js
namespace('App.Bundle.AddressBook.ViewScreen');

App.Bundle.AddressBook.ViewScreen.Create = function () {
    Sy.View.ViewScreen.call(this);
};
App.Bundle.AddressBook.ViewScreen.Create.prototype = Object.create(Sy.View.ViewScreen.prototype, {

    /**
     * Return the form element
     *
     * @return {HTMLFormElement}
     */

    getForm: {
        value: function () {
            return this.findOne('form');
        }
    }

});
```
And you need to register it via a service:
```js
container.set({
    'addressbook::viewscreen::create': {
        constructor: 'App.Bundle.AddressBook.ViewScreen.Create',
        tags: [
            {name: 'view.viewscreen', alias: 'create'}
        ]
    }
});
```
**Note**: the alias in the tag must match the viewscreen name.

Now from our controller `this.viewscreen` is no longer an instance of `Sy.View.ViewScreen` but is one of `App.Bundle.AddressBook.ViewScreen.Create`. Consequently we can update our controller action method like this:

```js
form.handle(this.viewscreen.getForm());
```

In the end we have a clean method where we only ask what we need, whitout knowing how everything's built. It's a lot safier now if you want to change something as everything is in its own place.

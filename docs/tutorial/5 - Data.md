# Data

In the previous step we left at a point where we have retrieved data from the form and want to save it. Now you'll learn how to do data handling properly via Sy.

The first step in the data process is the representation of our data, meaning declaring an entity. An entity is an instance of a specific class that wrap your data.

In our case we need to declare the entity `Profile` in the file `js/App/Bundle/AddressBook/Entity/Profile.js`:

```js
namespace('App.Bundle.AddressBook.Entity');

App.Bundle.AddressBook.Entity.Profile = function () {
    Sy.Entity.call(this);
    this.firstname = null;
    this.lastname = null;
    this.fullname = null;
    this.address = null;
    this.zipcode = null;
    this.city = null;
    this.phone = null;
    this.picture = null;
};
App.Bundle.AddressBook.Entity.Profile.prototype = Object.create(Sy.Entity.prototype);
```

Now that we have our representation, we need to ask ourself where do we want to save our data. As our app handles profile pictures, we'll use `IndexedDB` as it can handle saving files.

I'm sure at this point you're saying "oh no! not indexeddb, its API is awfully complex". But don't be afraid folks, you'll see it's very easy with Sy.

So first let's configure our connection to the database. We add configuration in our configuration object (`App.Bundle.AddressBook.Config.Configuration`) like so:

```js
config
    .set('storage.dbal', {
        defaultConnection: 'addressbook',
        connections: {
            addressbook: {
                driver: 'indexeddb',
                dbname: 'addressbook',
                version: 1
            }
        }
    })
    .set('storage.orm', {
        defaultManager: 'main',
        managers: {
            main: {
                connection: 'addressbook',
                mapping: []
            }
        }
    });
```
So here we've told the framework to create a connection to IndexedDB on the database `addressbook`; and told we want to manage all our entities via this connection.

So now let's update our `saveAction` from the controller in the previous chapter.

```js
saveAction: {
    value: function (event) {
        var profile = new App.Bundle.AddressBook.Entity.Profile(),
            form = this.createFormBuilder(profile)
                .add('firstname')
                .add('lastname')
                .add('picture')
                .add('phone')
                .add('address')
                .add('zipcode')
                .add('city')
                .getForm();

        form.handle(document.querySelector('form'));

        if (form.isValid()) {
            this
                .getStorage()
                .getManager()
                .persist(form.getObject())
                .flush();

            this.rediect('home');
        } else {
            //display some errors
        }
    }
}
```
And just like that you save data to indexeddb. Told you there was nothing to be scared of.

But if you look at the saved data, you'll notice the picture is not saved but instead a fake path to the picture. This is due to how work the form, it accesses the `value` attribute on inputs but the actual image is accessible via `files` attribute. So you need to inject the file in your entity from your controller; you should do it just before persisiting the entity.

Next, look at how to retrieve all the profiles and display them on the home page.

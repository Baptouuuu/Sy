# Controller

No we have the routes but the app still doesn't work due to missing controllers.

To declare one involves 2 steps, creation of the file and name declaration on the viewscreen.

The controller file:
```js
namespace('App.Bundle.AddressBook.Controller');

App.Bundle.AddressBook.Controller.Home = function () {};
App.Bundle.AddressBook.Controller.Home.prototype = Object.create(Sy.Controller.prototype, {

});
```
This example is the controller for the home viewscreen, create the other 2.

For now these are empty and does nothing, but will see later their use.

Now to associate this controller, we do it on the DOM node:

```html
<section data-sy-view="home" data-sy-controller="AddressBook::Home">
    <!-- inner html -->
</section>
```
The value in the `data-sy-controller` attribute is always on the same format, the bundle name (the one given in the kernel) followed by `::` and then the name of the controller.

**Note**: this last one should always be close to the viewscreen name to avoid confusion.

Now that all our controllers are defined, go try again those routes.

## Actions

Now that we have our controllers it's time to work with them. To refresh, the goal of a controller is to handle the user interactions with the DOM.

As we do not have any profile yet in our app, we'll start with the create page. We need to associate an action on the submit button to a method in the controller.

You do this by adding a new attribute on your element like so:

```html
<paper-icon-button icon="check" data-sy-action="save|click"></paper-icon-button>
```
This instruct the framework to listen for a `click` event on this element, that will be dispatched to the method `saveAction` in your controller.

A method mapped to a DOM event must be suffixed with `Action` in order to distinguish methods in your controllers mapped to an event to those that are not. It's a reminder that you shouldn't call these actions methods yourself.

In the `saveAction` method we need to extract the data off the form and save it somewhere for later use. In the past we used to do it manually (or for the jQuery guys, serialize the array and send it directly via ajax to the server). The framework use a more elegant, and evolution proof, mechanism simply called `Form`.

Via the form component we declare what field in our form we need to be extracted, and then the engine will validate the form data and extract it in a new object.

For our form, the method should look like this:

```js
saveAction: {
    value: function (event) {
        var form = this.createFormBuilder({})
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
            var data = form.getObject();
            //save the data object

            this.rediect('home');
        } else {
            //display some errors
        }

    }
}
```
Above when you call `form.handle` it will look for each declared field and inject the data from the form elemnts to the object passed as argument of `createFormBuilder`.

You check if the form is valid via `form.isValid()`, if it's the case you can save the data, otherwise alert the user of the errors. Once the data saved you can redirect to the `home` viewscreen.

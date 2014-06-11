# User Interface

[< Previous chapter (Fundamentals)](fundamentals.md) | [Next chapter (Controller) >](controller.md)

The User Interface is surely the first thing you'll do when building your app. You need to know what will be your interface before starting to structure your data and how to animate the whole.

Sy took the concept of a viewport where you'll inject a so called viewscreen. The viewport is simply a DOM node, it's the only one that should be displayed to the user. But as the framework don't come with any CSS, it's up to you to choose how to hide every things that's outside of this node.

For example:
```html
<body>
    <section class="viewport"></section>
    <div>foo</div>
</body>
```
The `foo` text should never be displayed.

But why should you do that? Simple, the framework don't handle any DOM outside of the viewport. So, except if it's just a canvas for the whole app, you should keep everything inside of your viewscreens.

Now the viewscreens, each one is a representation of a "page" of your app (say the home of your app, a profile or login screen, etc...); and they can be layered in sub-sections (but we'll to come to it in a few minutes).

Concerning the data, the framework use a simple mechanism that walk through the DOM tree and replace data placeholders. A thing that other frameworks do but that you won't find here, is to put logic inside your HTML. This format is not designed to handle complex behaviours inside it. Plus, it's kind of weird to put code inside what's supposed to only represent your data (it's like we're trying to re-introduce old `onclick` and others attributes).
The advantage of keeping only data placeholders in the html is that the person building the html template can be different from the one writing the app code (aka you). The one in charge of html should be able to come back to the page and make modifications without wondering if he has broken something. It's up to you to check if those modifications have broken *your* code, it's not the way around. (I like to think of it as teammates loosely coupling)

The drawback with this approach is that you need to write more code to handle interactions. But as the framework let's you the hand on more things you can produce better code and especially more fluid UIs than any generic code.

## Viewport

Like said before, it's the center of your app UI. Everything's displayed inside it. To be detected by the framework you only need to declare somewhere in your document's body a node with the class `viewport`.

By javascript you have access to a service to modify the viewscreen displayed in the viewport:
```js
Sy.kernel.getServiceContainer()
    .get('sy::core::viewport')
    .display('viewscreen name');
```
This code will inject the viewscreen node inside the viewport (or replace the previous one); it will throw an error if there's more tha none child. This service is also configured with the global mediator service and publish 2 channels each time you call `.display()`:

* `view::on::pre::display`
* `view::on::post::display`

Those channels are published, like I'm sure you've understood, before the new viewscreen is injected or replacing the old one and after this operation. There're fired with an instance of [`Sy.View.Event.ViewPortEvent`](../../src/View/Event/ViewPortEvent.js) holding the viewscreen wrapper of the one being displayed (you don't have access to the old one).

## Viewscreen

This is an actual *page* of your app, and as it represent a whole page you can't nest them (see [layouts](#layout) to compose your viewscreen). To declare them you just put them wherever you want in your DOM tree, you just have to add the attribute `data-sy-view` to flag a node as a viewscreen (the value of this attribute is the name of your viewscreen).

Example:
```html
<body>
    <section data-sy-view="foo"></section>
    <div class="hidden">
        <div data-sy-view="bar"></div>
    </div>
</body>
```

When the framework boot, it looks for all the viewscreens and tkae them off the DOM tree. So what's really on your page is only what's being displayed to the user.

To render your viewscreen with a set of data, you need to retrieve it's wrapper and then call `render` on it like so:
```js
viewport.getViewManager().getViewScreen('foo').render({
    some: {
        data: {
            foo: 'bar'
        }
    }
});
```
So if you want to display `bar` in your viewscreen, you only need to write a placeholder of the form: `{{ some.data.foo }}`.

### Custom wrapper

Thanks to the code structure imposed by the framework it can autoload your custom viewscreens wrappers. A custom one could look like the one below:

```js
namespace('App.Bundle.Foo.ViewScreen');

App.Bundle.Foo.ViewScreen.Bar = function () {
    Sy.View.ViewScreen.call(this);
};
App.Bundle.Foo.ViewScreen.Bar.prototype = Object.create(Sy.View.ViewScreen.prototype, {
    customMethod: {
        value: function () {
            this.getNode(); //to access to the actual DOM node
        }
    },

    setNode: {                                                  //this method is used to inject the node in the wrapper, use it carefully
        value: function (node) {
            Sy.View.ViewScreen.prototype.call(this, node);      //don't forget to call the parent method, otherwise it will break some features
            // do your stuff
        }
    }
});
```
Now if you want this wrapper to loaded you only have to name your viewscreen `Foo::Bar` and the engine will automatically create a instance of your wrapper.

## Layout

This type of wrapper is used to create sub-section inside a viewscreen, and as it extends the same abstract class as any viewscreen you can call the `render` method on each layout, so you can only update a part of your UI (keeping the DOM manipulations to a minimum).

You can declare a layout by simply adding the `data-sy-layout` attribute on any node inside of your viewscreen (however you shouldn't nest layout declarations):
```html
<section data-sy-view="foo">
    <section data-sy-layout="bar"></section>
</section>
```

To access a layout wrapper, you can achieve it like this:
```js
viewscreenWrapper.getLayout('bar');
```

## List

This is the last layer (I promise) that can be declared in your viewscreen. It's here to help you better handle lists of data. Those must be declared inside a [`Layout`](#layout). It expose 2 new methods: `append` and `prepend`, and modify the behaviour of `render`.

First declare a new list:
```html
<section data-sy-layout="bar">
    <ul data-sy-list="list name">
        <li data-type="A">
            A data type representation
        </li>
        <li data-type="B">
            B data type representation
        </li>
    </ul>
</section>
```
Here we declare a new list wrapper and two data representation we accept for this list.

What's this *type* thing? Say you have a list that can contains articles, photos descriptions, videos and so on... For each of them you want a different markup as it represent different type of data. So, by adding the attribute `data-type` on a list child you can just do that, declared different markups for different type of data. Those childs are taken off the DOM when the viewscreen is loaded and is then used as prototype (meaning there're cloned) to create new list's elements.
(If you want only one type of data representation, you can ommit the `data-type` attribute)

Now, let's go back to the methods available. To prepend a new element of type `A` you do it like this:
```js
layoutWrapper.getList('list name').prepend(dataObject, 'A');
```
The same goes for `append`. If you ommit the type when calling one of those methods, it will use the first type declared in the DOM (in this case `A`).

With this wrapper, the `render` method has been modified to only accept `Array`s. It will loop over this array and call the `append` method for every element of this one. Now to specify a `type` for each element, you need to add a `_type` property on the array's objects.

## Rendering engine

All the layers described above use the same engine instance accessible as a service under the same `sy::core::view::template::engine`. The only method you have to care about on this object is `render`. It accept 2 parameters: a node element and a data object.

When called, it will walk other the the tree of your node and search for placeholders on every attribute and in the `textContent`. If it's the first a node is rendered, the engine will keep the original state of attributes where there's a placeholder and replace them in the node with the appropriate data. So any node can be re-rendered at any time and from anywhere in the DOM tree.

The engine also use [reflection](https://github.com/Baptouuuu/Reflection.js) to parse your data so you can pass complex data types to the engine and still extract appropriate data. For example, you want to render the attribute `foo` from an entity to a node, the engine will first look if there's a method call `getFoo`, if it fails to find it, it will look at a generic method called `get` on which it will pass `foo` as parameter; and finally it fallback to a direct access on the property `foo` if none of the methods are found. The underlying function used is named `reflectedObjectGetter` and is available in the global scope, so you can reuse it if you need to extract data from nested objects.
# View engine

The engine is built around 4 layers for your views:

* ViewPort
* ViewScreen
* Layout
* List

All of them must be registered in the DOM tree.

The engine comes with a built-in rendered under the name `TemplateEngine` and can be used separately from the layers quoted above. Although, those are built on top of it.

## ViewPort

This the top layer in your app, it's the node containing all what's displayed by the app.

It's accessed via the service container as follows:
```js
var viewport = Sy.service.get('sy::core::viewport');
```

In order to work, your SPA html must look like this:
```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <section class="viewport"></section>
  </body>
</html>
```
In this node, you will only find ViewScreen nodes. And only one at a time!

## ViewScreen

A `ViewScreen` is the representation of a page in your app and is registered as follows:
```html
<section data-sy-view="your-view-name"></section>
```
This html can be put wherever you want in the page and each ViewScreen is taken off the DOM when the engine is loaded, except if you define one directly in the ViewPort node.

You can access to your ViewScreen as follows:
```js
var viewscreen = viewport.getViewManager().getViewScreen('your-view-name');
```
The code above will return a `Sy.View.ViewScreen` wrapper for the node.

To put your ViewScreen in the viewport:
```js
viewport.display('your-view-name');
```
As it must exist only one ViewScreen in the viewport, if there's more than one, the viewport object will raise an exception and the ViewScreen won't be displayed. It will then be up to you to resolve the error!

If there's no ViewScreen already set in the viewport, it's no problem.

## Layout

It's a sub-section of a ViewScreen, think of it like a wrapper for something like an aside list, the main content area, etc...

To define it:
```html
<section data-sy-view="your-view-name">
  <section data-sy-layout="your-layout-name"></section>
</section>
```

To access to the node wrapper:
```js
var layout = viewscreen.getLayout('your-layout-name');
```

If you have multiple layouts defined in your ViewScreen, you can retrieve an array of all of them like so:
```js
var layouts = viewscreen.getLayouts();
```

**Note**: this layer is here to help you access part of the UI in a logical way, but all your ViewScreen markup don't have to be inside a layout.

## List

As its name indicates, it's a list wrapper for a node acting as list. To define one it must be declared inside a Layout node as follows:
```html
<section data-sy-layout>
  <ul data-sy-list="your-list-name">
    <li data-type="alpha">
      This a element of type "{{ _type }}" with the value: {{ alpha.value }}
    </li>
    <li data-type="beta">
      This a element of type "{{ _type }}" with the value: {{ beta.value }}
    </li>
  </ul>
</section>
```
In general a list is composed of only one type of element, but some times you want to display different types of content in the same list (ie: in a timeline you could display a video, then a news, and so on...).

As you can see above, you can defined register typed childs. Each direct child of the list is a raw representation of a content, and is taken off the DOM when the List is loaded.

To use it:
```js
var list = layout.getList('your-list-name');
list.render([
  {
    alpha: {
      value: 'alpha',
      _type: 'alpha'
    }
  },
  {
    beta: {
      value: 'beta',
      _type: 'beta'
    }
  }
]);
```
Will render the list like so:
```html
<ul data-sy-list="your-list-name">
  <li data-type="alpha">
    This a element of type "alpha" with the value: alpha
  </li>
  <li data-type="beta">
    This a element of type "beta" with the value: beta
  </li>
</ul>
```

If you don't specify `_type` in your objects it will use the first defined type (in our case `alpha`).

When using `render` on a list, it first remove all its children and then re-build the list based on the data. So if you want to only append/prepend an element to the list you can just do:
```js
list.append({
  alpha: {
    value: 'whatever'
  }
}, 'alpha');
list.prepend({
  beta: {
    value: 'whatever'
  }
}, 'beta');
```
In both cases, the second argument is the type you want to choose and can be omitted (being defaulted to the first type registered).

To access to all the lists of the layout:
```js
layout.getLayouts();
```

## Rendering

`ViewScreen`s and `Layout`s can be independently rendered via the method `render` taking an object as argument.

Example:
```js
viewscreen.render({
  header: 'My page title',
  layout: {
    title: 'My layout title'
  }
});
```
```html
<section data-sy-view="view-name">
  <h1>{{ header }}</h1>
  <section data-sy-layout="layout-name">
    <h2>Layout: {{ layout.title }}</h2>
  </section>
</section>
```
The code and markup above will result in this:
```html
<section data-sy-view="view-name">
  <h1>My page title</h1>
  <section data-sy-layout="layout-name">
    <h2>Layout: My layout title</h2>
  </section>
</section>
```

## Template engine

The rendering of the layers described above is based on the object `Sy.View.TemplateEngine` which is available via the service `sy::core::view::template::engine`. This meschanism is totally agnostic of the previous objects.

> Its sole purpose is to replace placeholders in the DOM.

The only method you have to care about on this object is `render` and is used as follows:
```js
var renderer = Sy.service.get('sy::core::view::template::engine');
renderer.render(node, {
  attr: {
    nested: [
      'even',
      'accepting',
      'arrays'
    ]
  },
  some: 'value'
});
```
In the HTML node the values above can be access with the specified markup:

* `{{attr.nested.0}}`
* `{{attr.nested.1}}`
* `{{attr.nested.1}}`
* `{{ some }}`

And you can put it in any node attribute or the node text.

**Important**: the engine use `textContent` node attribute to replace placeholders for the node text and does it only if the node as no child.

For example the first placeholder below won't be replaced, but the last will:
```html
<div>
  {{ wont.be.replaced }}
  <span>to bad for you but {{ I.will }</span>
</div>
```
This restriction is due that `textContent` on the div will contains the span `textContent` and so replacing the textContent on the first one may mess up the text layout.

### Sugar

The template engine does not care about where the specified node is set (or if it's even in the DOM tree) it always render it.

If you want to re-render a node (so now without placeholder), you can still use this node and render it with the specified data, the engine remembers which node as been rendered and has kept its original state (so you don't have to do it).

You want to inject dom nodes in a template, you can do it as follows:
```js
renderer.render(node, {
  value: HTMLElement  //It must a dom node, no html as text
});
```
```html
<div>
  {{ value }}
</div>
```
The placeholder above will be replaced with the dom node specified in the data object. And if you try to re-render the `div` it will first remove the child and re-append the node from the data object.

## Extra

The mechanism described in this page has been designed to be used in a preventive way. Meaning render first then display the node.

By doing this way you can render a whole page without causing a browser reflow. As the ViewScreens are taken off the DOM, you can render them without affecting the one currently displayed in the viewport.

Another key point in the template engine design, is the usage of recursion to replace placeholders instead of using `innerHTML` to rebuild the page html. This choice allows to only replace text and can be started from wherever you want in the DOM tree. In opposition to "compilation" of the html as string which result in the nodes to be recreated each time it's rendered (impacting performances).
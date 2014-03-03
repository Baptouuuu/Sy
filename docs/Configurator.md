# Configurator

As its name indicates, it's used to hold configuration elements. A default instance is available in `Sy.config`.

## Creation

```js
var config = new Sy.Configurator();
```

## Setting an element

```js
config.set('key', {some: 'value'});
```
As the `set` method return the configurator you can chain it like this:
```js
config
  .set('key1', 'value1')
  .set('key2', 'value2');
```

To define the root element of the config you can also set directly the object like so:
```js
config.set({
  key1: {
    some: 'value'
  },
  key2: '42'
});
```
**Important**: setting an object like above use `_.extend` ([Underscore.js](http://underscorejs.org/#extend)) and so merge only the first level of your object in the one already set in the configurator.

Example:
```js
config.set({
  foo: {
    bar: {
      baz: 42
    }
  }
});
config.set({
  foo: {
    baz:42
  }
});
// => produce a config like
// {
//   foo: {
//     baz: 42
//   }
// }
```

If you need to update a particular value in deep objects, you can do it with this technic:
```js
config
  .set('foo.bar.baz', 24)
  .set('foo.baz', 42);
```
With this you will obtain an object like below:
```js
{
  foo: {
    bar: {
      baz: 24
    },
    baz: 42
  }
}
```

## Checking

You can check if a key is set in the top object like so:
```js
var bool = config.has('key');
```

You can also check if an element exist in a deep object by doing:
```js
var bool = config.has('foo.bar.baz');
```
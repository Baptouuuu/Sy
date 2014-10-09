# Registry

The registry is an object that let you store key/value pairs.

## Creation

```js
var registry = new Sy.Registry();
```

## Setting an element

```js
registry.set('key', {some: 'value'});
```
**Important**: if key is not a string the registry will omit setting the value.

**Note**: The `set` method return the registry so you can chain setting elements like below
```js
registry
  .set('key1', 'value1')
  // etc...
  .set('keyN', 'valueN');
```

## Checking

You can verify if a value exist in the registry via checking its key like so:
```js
var bool = registry.has('key');
```

## Retrieving a value

To get a value from the registry:
```js
var myValue = registry.get('key');
```

If you omit the key, it will return an array of all values contained in the registry. If you want all the associations key/value, you need to use `registry.getMapping()` that will return an object like:
```js
{
  key1: 'value1',
  // etc...
  keyN: 'valueN'
}
```

## Removing an element

```js
registry.remove('key1');
```

You can delete multiple keys at a time by passing an array instead of the key:
```js
registry.remove([
  'key1',
  // etc...
  'keyN'
]);
```

If function called without argument, it will remove all the elements of the registry.
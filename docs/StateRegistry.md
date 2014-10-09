# StateRegistry

A StateRegistry is based on the [Registry](Registry.md), and is based around the notion of states. For example it can be used in the process of storing data, you could use it to store elements needed to be created, updated or removed.

**Important**: by design a same key can be in different states, it's up to you to check if a key exist in a state before putting it in another state. You can automate this by calling `setStrict()` on the registry.

## Creation

```js
var stateRegistry = new Sy.StateRegistry();
stateRegistry.setRegistryFactory(new Sy.RegistryFactory);
```

## Setting an element

```js
stateRegistry.set('stateName', 'key', 'value');
```

## Checking

You can check if a state has been used at some point with:
```js
var bool = stateRegistry.has('stateName');
```
**Note**: even if there's no more elements in it, it will return true if you setted an element before in this state.

You can check if a key exist in a state like so:
```js
var bool = stateRegistry.has('stateName', 'key');
```

## Getting element(s)

You can retrieve a value in a state by doing:
```js
var val = stateRegistry.get('stateName', 'key');
```

If you omit the key, it will return an array with all the values of the specified state.

If no arguments are passed an object is returned containing all values in arrays grouped by state. Example:
```js
{
  state1: [
    'value1',
    // etc...
    'valueN'
  ],
  state2: [
    'valueN'
  ]
}
```

## State of a key

You can determine the state(s) of a key by doing:
```js
var state = stateRegistry.state('key');
```
It will return a string if the key exist only in one state, an array if in multiple states, otherwise it return `undefined`.

## Removing element(s)

You can remove an element in a state like so:
```js
stateRegistry.remove('stateName', 'key');
```

If you omit the key it will remove all the elements of the specified state.

If no arguments, it remove all elements of all states.
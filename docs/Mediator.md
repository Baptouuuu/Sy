# Mediator

The mediator is an event mechanism, you could also come across it under the name Pub/Sub. The philosophy is simple: you attach a function to a channel, then when this channel is fired all the subscribers functions are called.


## Creation

If you use the full framework you can find a pre-configured mediator as a service under the name `sy::core::mediator`.

```js
var mediator = new Sy.Lib.Mediator();
mediator.setGenerator(generator);
mediator.setLogger(logger); // the logger is optional
```

The generator is an object creating unique identifiers, here it's used to give a unique id to each subscribers. It must implement `Sy.Lib.Generator.Interface`; by default the framework use `Sy.Lib.Generator.UUID`.

## Subscribe to a channel

```js
mediator.subscribe({
  channel: 'channelName',
  fn: function (arg1, arg2, argN) {
    // this function will be called when 'channelName' is published
  },
  context: objectContextAppliedToTheFunction,  // optional, default to window
  priority: int,  // optional, default to 1 (used to sort callbacks when channel's published)
  async: bool  // optional, default to true
});
```
This will return a unique identifier that can be used later if you want to `remove` or `(un)pause` the subscriber.

## Publish a channel

```js
mediator.publish('channelName', arg1, arg2, argN);
```
Each argument passed after the channel name are passed to each subscriber as arguments.

## (Un)Pause a channel

In some cases you may want to pause a channel from being published (ie: the channel used to bootstrap your whole app). You can accomplish this like so:
```js
mediator.pause('channelName');
```
Now even if the channel is published, the attached subscribers won't be called.

If you want to only prevent one subscriber to be called, you can do it by passing it's unique identifier (the one returned by the `subscribe` function) to the method:
```js
mediator.pause('channelName', 'uniqueIdentifier');
```

You can revert all this with the `unpause` method:
```js
mediator.unpause('channelName' [, 'uniqueIdentifier']);
```

## Is a channel paused?

```js
mediator.paused('channelName');
```
This will return `undefined` if the channel doesn't exist, otherwise it will return a boolean.

## Remove a subscriber

```js
mediator.remove('channelName', 'uniqueIdentifier');
```
**Note**: you can't remove a whole channel at once, you can only remove one subscriber at a time.
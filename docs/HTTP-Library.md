# HTTP Library

Sy abstract the construction of http request (ajax) via a set of objects. If you're looking to consume a REST api, I suggest to read the documentation of the [REST](REST.md) object (based on this library).

The framework expose this library through the `http` [service](Service-container.md) (alias of `sy::core::http`).

The library is composed of 3 types of objects:

* [Request](#request)
* [Response](#response)
* [Manager](#manager)

Flow of your requests:

* Create a new `Request`
* Launch it with the `Manager`
* The `Manager` call the request callback with a `Response` as parameter

Not using the request object to directly send the request allows you to reuse this object to send another request. Initiating X times a request via `Manager.launch` with the same request object will make X AJAX requests.


## Request

This object wraps the creation of a http request; it must implement [`Sy.HTTP.RequestInterface`](../src/HTTP/RequestInterface.js). It is a representation of a request, so by itself the object does nothing, go to the [`Manager`](#manager) to see how to use them.

### Creation

```js
var request = new Sy.HTTP.Request();
```

### URI

```js
request.setURI('/path/to/resource');
```

### Method

By default the request method is set to `GET`, but you can change it with:
```js
request.setMethod('POST');
```
This method accept: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `HEAD`, `TRACE` and `CONNECT`.

### Data

In case of `POST` requests you may want to attach data to the request, you can do it like so:
```js
request.setData({
  key1: 'value1',
  key2: 'value2'
  // etc...
});
```
**Note**: This method only accept an object literal.

### Headers

In certain occasion you may want to add extra headers (like when accessing an API), you can do it by two manners:
```js
request.setHeader('key1', 'value1');
// or
request.setHeader({
  key1: 'value1',
  key2: 'value2'
});
```

### Callback

In most cases you will want to attach a function to the request to know its result.
```js
request.setListener(function (response) {
  // do whatever you want here with the response
});
```
This function will be called once when the request is finished no matter what the result is, it's up to you to determine if the result is acceptable or not. The `response` argument is an instance of [`Sy.HTTP.Response`](../src/HTTP/Response.js).

### Typing

You can set the type of data you want returned with:
```js
request.setType('json');
```
This method accept `html`, `json` and `blob`. The first will give you a DOM object as response's body; the second one will parse the response as a JSON document so you don't have to use `JSON.parse` before you use your data and the last one return a blob as a body (used for images).

The library come with 3 typed requests: [`Sy.HTTP.HTMLRequest`](../src/HTTP/HTMLRequest.js), [`Sy.HTTP.JSONRequest`](../src/HTTP/JSONRequest.js) and [`Sy.HTTP.ImageRequest`](../src/HTTP/ImageRequest.js). These automatically set the appropriate type (with the method described above), and set the `Accept` header key with respectively `text/html,application/xhtml+xml`, `application/json` and `image/*`.


## Response

In normal workflow you will never have to construct this kind of object. You should encounter this kind of object inside a [request listener](#callback). it will always implement [`Sy.HTTP.ResponseInterface`](../src/HTTP/ResponseInterface.js).

### Status code

You can access status code with:
```js
response.getStatusCode(); // return an integer
```

### Status text

```js
response.getStatusText();
```

### Header

You can get the value of a specific header via:
```js
response.getHeader('HeaderName');
```
But you can also get all of them at once by calling `getHeader` without arguments, it will return an object literal.

### Body

The response body is accessible through:
```js
response.getBody();
```
By default this will return a string. However if you made a `HTMLRequest`, `JSONRequest` or `ImageRequest` it will return a DOM node, a parsed JSON or a `Blob`; those requests also mean that the response is also typed by being, respectively, an instance of [`Sy.HTTP.HTMLResponse`](../src/HTTP/HTMLResponse.js), [`Sy.HTTP.JSONResponse`](../src/HTTP/JSONResponse.js) and [`Sy.HTTP.ImageResponse`](../src/HTTP/ImageResponse.js).


## Manager

All requests handling is done through this object, meaning:

* initiating request
* calling callback when done
* allowing to abort requests

### Creation

If you use the library inside the framework, you can omit this section and access the object via the `http` service (alias of `sy::core::http`).

```js
var manager = new Sy.HTTP.Manager();
manager
  .setParser(new Sy.HTTP.HeaderParser())
  .setGenerator(new Sy.Lib.Generator.Interface());
```
The manager depends on two other objects. The first allows to extract from the string returned by `XMLHttpRequest.getAllResponseHeaders()` the list of key/value header pairs.

The second dependency is a generator used when initiating a new request. At this step, the manager associate a unique identifier to the request, so it can access it more easily in the state change listener. The identifier is also used to abort a request.
In the example above, we use an instance of the generator interface, obviously this won't work as the interface does not generate content. You will need to use an instance that return real content, you can use [`Sy.Lib.Generator.UUID`](../src/Lib/Generator/UUID.js) (the framework use this generator for the manager) but you can build your own if you want (though remember that it must implement the above interface).

### Initiate a request

```js
manager.launch(request);
```
This will return a unique identifier of your request and launch the request.

### Abort a request

You need the unique identifier returned by `Manager.launch` and then call:
```js
manager.abort(identifier);
```
# REST

This object sits on top of the [HTTP Manager](HTTP-Library.md#manager) and allows you to remove some steps to make REST calls.

## Creation

If you use the whole framework you can access the rest object through the `sy::core::http::rest` service, so you can omit this section.

```js
var rest = new Sy.HTTP.REST();
rest.setManager(manager);
```
In order to work you need to inject an instance of [`Sy.HTTP.Manager`](HTTP-Library.md#manager).

## GET

```js
rest.get({
  uri: '/path/to/resource',
  headers: {                                // optional
    key1: 'value1',
    key2: 'value2'
  },
  listener: function (response) {           // optional
    // do something when request is done
  }
});
```
Associated http request:
```
GET /path/to/resource HTTP/1.2
/*
  General headers
*/
key1: value1
key2: value2

/*
  No content body
*/

```

## POST

```js
rest.post({
  uri: '/path/to/resource',
  data: {                                   // optional
    key1: 'value1'
  },
  headers: {                                // optional
    key1: 'value1',
    key2: 'value2'
  },
  listener: function (response) {           // optional
    // do something when request is done
  }
});
```
Associated http request:
```
POST /path/to/resource HTTP/1.2
/*
  General headers
*/
key1: value1
key2: value2

/*
  encoded form data
*/

```

## PUT

```js
rest.put({
  uri: '/path/to/resource',
  data: {                                   // optional
    key1: 'value1'
  },
  headers: {                                // optional
    key1: 'value1',
    key2: 'value2'
  },
  listener: function (response) {           // optional
    // do something when request is done
  }
});
```
Associated http request:
```
PUT /path/to/resource HTTP/1.2
/*
  General headers
*/
key1: value1
key2: value2

/*
  encoded form data
*/

```

## DELETE

```js
rest.remove({
  uri: '/path/to/resource',
  headers: {                                // optional
    key1: 'value1',
    key2: 'value2'
  },
  listener: function (response) {           // optional
    // do something when request is done
  }
});
```
Associated http request:
```
DELETE /path/to/resource HTTP/1.2
/*
  General headers
*/
key1: value1
key2: value2

/*
  No content body
*/

```
The choice of using `REST.remove` instead of `REST.delete` is due as `delete` is a reserved word.
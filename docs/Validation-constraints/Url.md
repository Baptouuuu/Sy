# `Url` constraint

This constraint is used to make sure the data is an url.

## Creation

```js
new Sy.Validator.Constraint.Url({
    protocols: ['http', 'https'], //optional, must be an array
    message: 'violation message', //optional
    groups: [], //optional, must be an array
});
```
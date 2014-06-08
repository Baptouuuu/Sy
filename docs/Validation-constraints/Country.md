# `Country` constraint

This constraint is used to make sure the data is a valid country code.

## Creation

```js
new Sy.Validator.Constraint.Country({
    message: 'violation message', //optional
    groups: [], //optional, must be an array
});
```
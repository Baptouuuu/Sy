# `Date` constraint

This constraint is used to make sure the data is a `Date` object or is a valid date string.

## Creation

```js
new Sy.Validator.Constraint.Date({
    message: 'violation message', //optional
    groups: [], //optional, must be an array
});
```
# `NotNull` constraint

This constraint is used to make sure the data is not `null`.

## Creation

```js
new Sy.Validator.Constraint.NotNull({
    message: 'violation message', //optional
    groups: [], //optional, must be an array
});
```
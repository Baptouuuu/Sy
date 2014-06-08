# `Blank` constraint

This constraint is used to make sure the data is an empty string or `null`.

## Creation

```js
new Sy.Validator.Constraint.Blank({
    message: 'violation message', //optional
    groups: [], //optional, must be an array
});
```
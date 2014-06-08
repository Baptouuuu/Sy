# `LessThan` constraint

This constraint is used to make sure the data is less than the one defined in the constraint.

## Creation

```js
new Sy.Validator.Constraint.LessThan({
    value: 42, //required
    message: 'violation message', //optional
    groups: [], //optional, must be an array
});
```
# `LessThanOrEqual` constraint

This constraint is used to make sure the data is less than or equal to the one defined in the constraint.

## Creation

```js
new Sy.Validator.Constraint.LessThanOrEqual({
    value: 42, //required
    message: 'violation message', //optional
    groups: [], //optional, must be an array
});
```
# `EqualTo` constraint

This constraint is used to make sure the data is equal to the value specified (it use `===` to validate).

## Creation

```js
new Sy.Validator.Constraint.EqualTo({
    value: 'expected value', //required
    message: 'violation message', //optional
    groups: [], //optional, must be an array
});
```
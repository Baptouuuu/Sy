# `Type` constraint

This constraint is used to make sure the data is of the specified type (use `typof`) or is an instance of the class (assume the type is a path string).

## Creation

```js
new Sy.Validator.Constraint.Type({
    type: 'type or Path.String.To.Class', //required
    message: 'violation message', //optional
    groups: [], //optional, must be an array
});
```
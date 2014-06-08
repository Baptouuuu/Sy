# `NotBlank` constraint

This constraint is used to make sure the data is not an empty string nor `null`.

## Creation

```js
new Sy.Validator.Constraint.NotBlank({
    message: 'violation message', //optional
    groups: [], //optional, must be an array
});
```
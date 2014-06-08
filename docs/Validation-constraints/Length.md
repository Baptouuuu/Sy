# `Length` constraint

This constraint is used to make sure the data has a `length` between the specified bounds.

## Creation

```js
new Sy.Validator.Constraint.Length({
    min: minLength, //required
    max: maxLength, //required
    minMessage: 'violation message if length under min bound', //optional
    maxMessage: 'violation message if length above max bound', //optional
    exactMessage: 'violation message if min and max are the same and the length differs', //optional
    groups: [], //optional, must be an array
});
```
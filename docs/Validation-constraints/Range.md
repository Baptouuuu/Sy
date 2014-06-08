# `Range` constraint

This constraint is used to make sure the data is between 2 bounds.

## Creation

```js
new Sy.Validator.Constraint.Range({
    min: minValue, //required
    max: maxValue, //required
    minMessage: 'violation message if data under lower bound', //optional
    maxMessage: 'violation message if data above upper bound', //optional
    groups: [], //optional, must be an array
});
```
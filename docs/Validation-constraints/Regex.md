# `Regex` constraint

This constraint is used to make sure the data is a string that matches the regular expression.

## Creation

```js
new Sy.Validator.Constraint.Regex({
    pattern: 'regex pattern string', //required
    flags: 'regex flags string', //optional
    message: 'violation message', //optional
    groups: [], //optional, must be an array
});
```
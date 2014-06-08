# `Choice` constraint

This constraint is used to make sure the data is an element (or more) of the choice list.

## Creation

```js
new Sy.Validator.Constraint.Choice({
    choices: [], //optional if a callbak is specified
    multiple: boolean, //optional, tell if the data can be an array of elements
    min: minValue, //in case multiple is allowed, otherwise optional
    max: maxValue, //in case multiple is allowed, otherwise optional
    message: 'violation message if data not in choices', //optional
    minMessage: 'message if too few elements chosen', //optional
    maxMessage: 'message if too many elements chosen', //optional
    callback: 'methodName', //optional if choices specified
    groups: [], //optional, must be an array
});
```

The `callback` has a precedence to get choices array over `choices` parameter.

**Important**: the callback can only be used in the case you use the `validate` method. It will call the method name on the object being validated. The callback **must** return an array.
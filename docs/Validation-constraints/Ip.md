# `Ip` constraint

This constraint is used to make sure the data is an empty string or `null`.

## Creation

```js
new Sy.Validator.Constraint.Ip({
    port: boolean, //optional, tell if the ip address must have a port specified
    mask: boolean, //optional, tell if the ip address must have a subnet mask specified
    message: 'violation message', //optional
    groups: [], //optional, must be an array
});
```
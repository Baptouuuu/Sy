# `Callback` constraint

This constraint can only be used when validating via the `validate` method. It will call the method on the object being validated with the execution context as argument.

## Creation

```js
new Sy.Validator.Constraint.Callback({
    callback: 'methodName', //required, must be a string
    groups: [], //optional, must be an array
});
```

## Callback

Example to validate with a callback:
```js
validator.registerRule('User', {
    properties: {
        all: {
            Callback: {callback: 'validateUser'}
        }
    }
});

User = function () {};
User.prototype = Object.create(Object.prototype, {
    validateUser: {
        value: function (context) {
            //context instanceof Sy.Validator.ExecutionContext

            if (/* some condition */) {
                context.addViolationAt('prop name', 'constraint message');
                context.addViolation('global violation message');
            }
        }
    }
});
```

This constraint is really useful in the case you can't do it with the available constraints, for example if 2 properties depends on each other the callback constraint is a good candidate.
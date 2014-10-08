# Validation

An important part of applications is data validation, for simple cases you probably do it via a simple `if` statement. But, when it starts getting bigger, it's becoming harder to handle all the tests in a maintanable way.

That's where this validation component comes into place, it helps you do data validation by simply declaring what are the constraints the data must comply with.

## Creation

If you use the validator inside the framework you can get it with the [service](Service-container.md) `validator` (alias of `sy::core::validator`), and skip this section.

Here is the full code to get the validator up and running:
```js
var validator = new Sy.Validator.Core(),
    contextFactory = new Sy.Validator.ExecutionContextFactory();

contextFactory.setConstraintValidatorFactory(new Sy.Validator.ConstraintValidatorFactory());

validator
    .setRulesRegistry(new Sy.Registry())
    .setContextFactory(contextFactory)
    .setConstraintFactory(new Sy.Validator.ConstraintFactory());
```

[`Sy.Validator.Core`](../src/Validator/Core.js) is the validator by itself. [`Sy.Validator.ExecutionContextFactory`](../src/Validator/ExecutionContextFactory.js) is used to generate a new execution context each time a validation occurs, so we're sure constraint violations don't overlap when validating multiple times.

## Constraints

A constraint is an assertion that a data must comply with. All constraints are located into [`Sy.Validator.Constraint`](../src/Validator/Constraint/), each one implements [`Sy.Validator.ConstraintInterface`](../src/Validator/ConstraintInterface.js).

Constraints are only representations of assertions, the component use a validator for eah one of them; those are declared alongside the constraint and usually are named like so: `Sy.Validator.Constraint.ConstraintNameValidator`.

The component comes with this list of contraints:

* [Blank](Validation-constraints/Blank.md)
* [Callback](Validation-constraints/Callback.md)
* [Choice](Validation-constraints/Choice.md)
* [Country](Validation-constraints/Country.md)
* [Date](Validation-constraints/Date.md)
* [Email](Validation-constraints/Email.md)
* [EqualTo](Validation-constraints/EqualTo.md)
* [False](Validation-constraints/False.md)
* [GreaterThan](Validation-constraints/GreaterThan.md)
* [GreaterThanOrEqual](Validation-constraints/GreaterThanOrEqual.md)
* [Ip](Validation-constraints/Ip.md)
* [Length](Validation-constraints/Length.md)
* [LessThan](Validation-constraints/LessThan.md)
* [LessThanOrEqual](Validation-constraints/LessThanOrEqual.md)
* [NotBlank](Validation-constraints/NotBlank.md)
* [NotEqualTo](Validation-constraints/NotEqualTo.md)
* [NotNull](Validation-constraints/NotNull.md)
* [NotUndefined](Validation-constraints/NotUndefined.md)
* [Null](Validation-constraints/Null.md)
* [Range](Validation-constraints/Range.md)
* [Regex](Validation-constraints/Regex.md)
* [True](Validation-constraints/True.md)
* [Type](Validation-constraints/Type.md)
* [Undefined](Validation-constraints/Undefined.md)
* [Url](Validation-constraints/Url.md)

## Validation

The validator expose 2 methods to you for validation: `validateValue` and `validate`.

Each of these methods will return an instance of [`Sy.Validator.ConstraintViolationList`](#constraint-violation).

### `validateValue`

This method is used to validate unstructured data (ie: you want to be sure your variable is an email). This methods needs the value (of course) and the constraint instance (or an array of them).

Example:
```js
var constraint = new Sy.Validator.Constraint.Email(),
    violations;

violations = validator.validateValue('foo@bar.baz', constraint); //violations.length === 0
violations = validator.validateValue('not an email', constraint); //violations.length === 1
```

### `validate`

This method is used to validate objects with a registered set of rules.

Example:
```js
Foo = function () {
    this.prop = null;
};

Foo.prototype = Object.create(Object.prototype, {
    getProp: {
        value: function () {
            return this.prop;
        }
    },
    isPropSet: {
        value: function () {
            return !!this.prop;
        }
    }
});

validator.registerRules({
    'Foo': {
        getters: {
            isPropSet: {
                True: {}
            }
        },
        properties: {
            prop: {
                NotBlank: {}
            }
        }
    }
});

var violations = validator.validate(new Foo());
```

The example above demonstrate how you can validate an object (that's an instance of `Foo`). The first step is to register validation constraints for this class.

The structure to register rules for a class is like so:
```js
{
    'Path.String.To.Class': {
        getters: {
            method: { //<- this is a method name used to get data that will afterward be validated against constraint defined in the object
                ConstraintName: { //<- this is the name of a constraint, you can define as many as you want
                    //this object will be passed as argument to the constraint constructor
                }
            }
        },
        properties: {
            property: { //<- this is the name of a property to validate
                ConstraintName: { //<- this is the name of a constraint, you can define as many as you want
                    //this object will be passed as argument to the constraint constructor
                }
            }
        }
    }
}
```

Both `getters` and `properties` are optional, so if you have no constraint in one of them you don't have to declare it.

By default the validator use [reflection](https://github.com/Baptouuuu/Reflection.js) to get a property value. In the order, it will look for the getter `get{PropName}`, if not found it will look for a generic getter named `get` and will call it with the property name as argument; if none of these methods exist it will access the property directly `object[property]`.

You can disable the use of reflection to get the property value by calling `validator.disableReflection()` (meaning it will always do a direct access `object[property]`). You can re-enable it by calling `enableReflection`.

## Constraint violation

As said earlier, the 2 methods used to validate data always return ans instance of [`Sy.Validator.ConstraintViolationList`](../src/Validator/ConstraintViolationList.js). This object holds all the violation found during the validation.

It expose a set of useful methods for you.

### `getViolations`

This method return the array of all the violations. Each element of this array is an instance of [`Sy.Validator.ConstraintViolation`](../src/Validator/ConstraintViolation.js).

### `forEach`

This method takes a function as argument and will apply to the array of violations.

```js
list.forEach(someFunction);
list.getViolations().forEach(someFunction);
```

The 2 statements above do exactly the same thing, `list.forEach` is only a shortcut.

### `getViolationsAt`

In the case you use `validate`, the component will set a `path` for each violation. This path is only the name of the getter or property.

For example, if you want to only get violations for the `bar` property of your object, you'll have a code like this:
```js
violations = validator.validate(object);
barViolations = violations.getViolationsAt('bar');
```

### `toJSON`

This method will return a raw representation of all the violations, meaning an array of POJO.

For example, calling `violations.toJSON()` may return an array like this:
```js
[
    {message: 'some constraint message', path: 'bar'},
    // etc...
]
```

### `ConstraintViolation`

As said in the introduction, the constraint violation list holds instances of [`Sy.Validator.ConstraintViolation`](../src/Validator/ConstraintViolation.js). This class expose 3 methods to get data about the violation.

#### `toString`

This method only return the violation message.

#### `getPath`

Return the path in the object to the data (meaning the property name or getter name).

**Note**: this method return a string only if you used `validate`; in the case you used `validateValue` it will return undefined.

#### `toJSON`

Return a POJO like this:
```js
{
    message: 'some violation message',
    path: 'propertyName'
}
```

## Validation groups

In some cases you don't want to apply all the constraints when validating your data. Say you have a multistep registration form with all the data held in one object, with validation groups you can easily validate the data step by step.

Example:
```js
validator.registerRule('User', {
    properties: {
        name: {
            NotBlank: {groups: ['step1']}
        },
        email: {
            NotBlank: {groups: ['step1']},
            Email: {groups: ['step1']}
        }
        password: {
            NotBlank: {groups: ['step2']}
        },
        nonRelatedProp: {
            NotBlank: {}
        }
    }
});

validator.validate(user, 'step1'); //will only validate `name` and `email`
validator.validate(user, 'step2'); //will only validate `password`
validator.validate(user, ['step1', 'step2']); //will validate `name`, `email` and `password`
validator.validate(user); //will validate everything
```

The example above shows how to apply validation groups with the `validate` method, but `validateValue` has the same feature via its third argument (it can be a string or an array of them).
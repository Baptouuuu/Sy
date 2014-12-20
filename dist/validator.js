/*! sy#1.1.0 - 2014-12-20 */
/**
 * Transform a dotted string to a multi level object.
 * String like "Foo.Bar.Baz" is like doing window.Foo = {Bar: {Baz: {}}}.
 * If object exists it is not transformed.
 * You can modify the root object by doing namespace.call(rootObject, nsString).
 *
 * @param {string} ns
 *
 * @return {object} Last object created
 */

function namespace (ns) {

    var namespaces = null,
        referer = this;

    if (typeof ns === 'string') {
        namespaces = ns.split('.');
    } else if (ns instanceof Array && ns.length > 0) {
        namespaces = ns;
    } else {
        return referer;
    }

    referer[namespaces[0]] = referer[namespaces[0]] || {};

    ns = namespaces.shift();

    return namespace.call(referer[ns], namespaces);

}

/**
 * Set a value into objects, where the chain of object is defined as a dotted string.
 * The last element of the string represent the attribute.
 * The root object can be changed by doing objectSetter.call(rootObject, nsString, value).
 *
 * @param {string} ns
 * @param {mixed} value
 */

function objectSetter (ns, value) {

    var namespaces = '',
        attr = '',
        referer = this,
        idx = ns.lastIndexOf('.');

    if (idx >= 0) {

        attr = ns.substr(idx + 1);
        namespaces = ns.substr(0, idx);

        referer = namespace.call(referer, namespaces);

    } else {

        attr = ns;

    }

    referer[attr] = value;

}

/**
 * Retrieve the attribute in objects, where the chain of object is defined as a dotted string.
 * The last element of the string represent the attribute.
 * The root object can be changed by doing objectGetter.call(rootObject, nsString).
 *
 * @param {string} ns
 *
 * @return {mixed}
 */

function objectGetter (ns) {

    var namespaces = null,
        referer = this;

    if (typeof ns === 'string') {
        namespaces = ns.split('.');

        if (namespaces.length === 1) {
            return referer[ns];
        }

    } else if (ns instanceof Array && ns.length > 1) {
        namespaces = ns;
    } else if (ns instanceof Array && ns.length === 1) {
        return referer[ns[0]];
    } else {
        return undefined;
    }

    ns = namespaces.shift();

    return objectGetter.call(referer[ns], namespaces);

}

/**
 * Capitalize the first letter of a string
 *
 * @param {String} string
 *
 * @return {String}
 */

function capitalize (string) {
    return string.substr(0, 1).toUpperCase() + string.substr(1);
}

/**
 * Use reflection to discover nested objects
 * For an element of the object path (ie: 'foo')
 * the reflection will look in this exact order:
 *     .getFoo()
 *     .get() //and 'foo' will be passed to this method
 *     .foo
 *
 * @param {String} ns
 *
 * @return {mixed}
 */

function reflectedObjectGetter (ns) {

    var namespaces = null,
        referer = this;

    if (typeof ns === 'string') {
        namespaces = ns.split('.');

        if (namespaces.length === 1) {
            return getReflectedValue.call(referer, ns);
        }

    } else if (ns instanceof Array && ns.length > 1) {
        namespaces = ns;
    } else if (ns instanceof Array && ns.length === 1) {
        return getReflectedValue.call(referer, ns[0]);
    } else {
        return undefined;
    }

    ns = namespaces.shift();

    return reflectedObjectGetter.call(getReflectedValue.call(referer, ns), namespaces);

}

function getReflectedValue (property) {
    var referer = new ReflectionObject(this);

    if (referer.hasMethod('get' + capitalize(property))) {
        return referer.getMethod('get' + capitalize(property)).call();
    } else if (referer.hasMethod('get')) {
        return referer.getMethod('get').call(property);
    } else if (referer.hasProperty(property)) {
        return referer.getProperty(property).getValue();
    } else {
        return undefined;
    }
};
namespace('Sy');

/**
 * Interface to standardize the factories of the framework
 *
 * @package Sy
 * @interface
 */
Sy.FactoryInterface = function () {};

Sy.FactoryInterface.prototype = Object.create(Object.prototype, {

    /**
     * Method to generate a new instance of the object handle by the factory
     *
     * @return {mixed}
     */
    make: {
        value: function () {}
    }

});
namespace('Sy');

/**
 * Interface for registries
 *
 * @package Sy
 * @interface
 */
Sy.RegistryInterface = function () {};

Sy.RegistryInterface.prototype = Object.create(Object.prototype, {

    /**
     * Set a new key/value pair in the registry
     *
     * @param {string} key
     * @param {mixed} value
     *
     * @return {Sy.RegistryInterface}
     */

    set: {
        value: function (key, value) {}
    },

    /**
     * Check if the key is set in the registry
     *
     * @param {string} key
     *
     * @return {boolean}
     */

    has: {
        value: function (key) {}
    },

    /**
     * Get the value associated of the passed key
     *
     * If the key is not referenced, it will throw a ReferenceError
     * If the key is not specified, it will return an array of all values
     *
     * @param {string} key
     *
     * @return {mixed}
     */

    get: {
        value: function (key) {}
    },

    /**
     * Return all the key/value pairs
     *
     * @return {object}
     */

    getMapping: {
        value: function () {}
    },

    /**
     * Remove elements from the registry
     *
     * If a key is specified it will removed only this one.
     * If an array of keys is specified it will removed only this set.
     *
     * @param {string|Array} keys Optionnal
     *
     * @return {Sy.RegistryInterface}
     */

    remove: {
        value: function (keys) {}
    },

    /**
     * Return the number of elements held by the registry
     *
     * @return {int}
     */

    length: {
        value: function () {}
    }

});
namespace('Sy');

/**
 * Default implementation of the RegistryInterface
 * It allows to handle key/value pairs
 *
 * @package Sy
 * @implements {Sy.RegistryInterface}
 * @class
 */

Sy.Registry = function () {

    this.data = {};
    this.registryLength = 0;

};

Sy.Registry.prototype = Object.create(Sy.RegistryInterface.prototype, {

    /**
     * @inheritDoc
     */

    set: {
        value: function (key, value) {

            if (typeof key === 'string') {

                this.data[key] = value;
                this.registryLength++;

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    has: {
        value: function (key) {

            if (this.data.hasOwnProperty(key)) {
                return true;
            }

            return false;

        }
    },

    /**
     * @inheritDoc
     */

    get: {
        value: function (key) {

            if (this.has(key)) {

                return this.data[key];

            } else if (key === undefined) {

                var data = [];

                for (var k in this.data) {
                    if (this.data.hasOwnProperty(k)) {
                        data.push(this.data[k]);
                    }
                }

                return data;

            }

            throw new ReferenceError('"' + key + '" is not defined');

        }
    },

    /**
     * @inheritDoc
     */

    getMapping: {
        value: function () {

            var data = {};

            for (var k in this.data) {
                if (this.data.hasOwnProperty(k)) {
                    data[k] = this.data[k];
                }
            }

            return data;

        }
    },

    /**
     * @inheritDoc
     */

    remove: {
        value: function (keys) {

            if (keys === undefined) {

                for (var key in this.data) {
                    if (this.data.hasOwnProperty(key)) {
                        this.remove(key);
                    }
                }

            } else if (keys instanceof Array) {

                for (var i = 0, l = keys.length; i < l; i++) {
                    this.remove(keys[i]);
                }

            } else if (typeof keys === 'string' && this.has(keys)) {

                delete this.data[keys];
                this.registryLength--;

            }

            return this;

        }
    },

    /**
     * @inheritDoc
     */

    length: {
        value: function () {
            return this.registryLength;
        }
    }

});
namespace('Sy');

/**
 * Factory generating basic registry
 *
 * @package Sy
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.RegistryFactory = function () {};
Sy.RegistryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function () {
            return new Sy.Registry();
        }
    }

});
namespace('Sy.Validator');

/**
 * Interface to declare required constraint methods
 *
 * @package Sy
 * @subpackage Validator
 * @interface
 */

Sy.Validator.ConstraintInterface = function (options) {};
Sy.Validator.ConstraintInterface.prototype = Object.create(Object.prototype, {

    /**
     * Check if the given validation group is set for the constraint
     *
     * @param {String} group
     *
     * @return {Boolean}
     */

    hasGroup: {
        value: function (group) {}
    },

    /**
     * Return the path to the constraint validator class
     *
     * @return {String}
     */

    validateBy: {
        value: function () {}
    }

});

namespace('Sy.Validator');

/**
 * Interface that eachconstraint validator must implement
 *
 * @package Sy
 * @subpackage Validator
 * @interface
 */

Sy.Validator.ConstraintValidatorInterface = function () {};
Sy.Validator.ConstraintValidatorInterface.prototype = Object.create(Object.prototype, {

    /**
     * Inject the current validation context
     *
     * @param {Sy.Validator.ExecutionContextInterface} context
     *
     * @return {Sy.Validator.ConstraintValidatorInterface} self
     */

    setContext: {
        value: function (context) {}
    },

    /**
     * Validate a value
     *
     * @param {mixed} value
     * @param {Sy.Validator.ConstraintInterface} constraint
     */

    validate: {
        value: function (value, constraint) {}
    }

});

namespace('Sy.Validator');

/**
 * Main validator, it's the interface to the outer world
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.Core = function () {
    this.rules = null;
    this.contextFactory = null;
    this.constraintFactory = null;
    this.useReflection = true;
};
Sy.Validator.Core.prototype = Object.create(Object.prototype, {

    /**
     * Set a registry to hold defined rules
     *
     * @param {Sy.RegistryInterface} registry
     *
     * @return {Sy.Validator.Core} self
     */

    setRulesRegistry: {
        value: function (registry) {
            if (!(registry instanceof Sy.RegistryInterface)) {
                throw new TypeError('Invalid registry');
            }

            this.rules = registry;

            return this;
        }
    },

    /**
     * Set the context factory
     *
     * @param {Sy.Validator.ExecutionContextFactory} factory
     *
     * @return {Sy.Validator.Core} self
     */

    setContextFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Validator.ExecutionContextFactory)) {
                throw new TypeError('Invalid context factory');
            }

            this.contextFactory = factory;

            return this;
        }
    },

    /**
     * Set the constraint factory
     *
     * @param {Sy.Validator.ConstraintFactory} factory
     *
     * @return {Sy.Validator.Core} self
     */

    setConstraintFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Validator.ConstraintFactory)) {
                throw new TypeError('Invalid constraint factory');
            }

            this.constraintFactory = factory;

            return this;
        }
    },

    /**
     * Activate the use of reflection to get property
     * value out of an object when validating
     *
     * @return {Sy.Validator.Code} self
     */

    enableReflection: {
        value: function () {
            this.useReflection = true;

            return this;
        }
    },

    /**
     * Deactivate the use of reflection to get property
     * value out of an object when validating
     *
     * @return {Sy.Validator.Code} self
     */

    disableReflection: {
        value: function () {
            this.useReflection = false;

            return this;
        }
    },

    /**
     * Register new set of rules for objects
     *
     * @param {Object} data
     *
     * @return {Sy.Validator.Core} self
     */

    registerRules: {
        value: function (data) {

            for (var path in data) {
                if (data.hasOwnProperty(path)) {
                    this.registerRule(path, data[path]);
                }
            }

            return this;

        }
    },

    /**
     * Register rules for the specified class path
     *
     * @param {String} path Class path
     * @param {Object} data
     *
     * @return {Sy.Validator.Core} self
     */

    registerRule: {
        value: function (path, data) {
            if (this.rules.has(path)) {
                throw new ReferenceError('Rules are already defined for the path "' + path + '"');
            }

            if (data.getters === undefined) {
                data.getters = {};
            }

            if (data.properties === undefined) {
                data.properties = {};
            }

            this.rules.set(path, data);

            return this;
        }
    },

    /**
     * Validate a value against a (or a set of) constraint(s)
     *
     * @param {mixed} value
     * @param {mixed} constraints Must be a constraint or array of constraints
     * @param {String|Array} groups Optional, must be string or array of strings
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    validateValue: {
        value: function (value, constraints, groups) {

            groups = groups || [];

            if (!(constraints instanceof Array)) {
                constraints = [constraints];
            }

            if (!(groups instanceof Array)) {
                groups = [groups];
            }

            var context = this.contextFactory.make();

            for (var i = 0, l = constraints.length; i < l; i++) {
                context.validate(value, constraints[i], groups);
            }

            return context.getViolations();

        }
    },

    /**
     * Validate an object, it must have been declared first
     *
     * @param {Object} object
     * @param {String|Array} groups Optional
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    validate: {
        value: function (object, groups) {

            var rules = this.resolve(object),
                context = this.contextFactory.make(),
                constraint,
                value,
                refl,
                propGetter;

            groups = groups || [];

            if (!(groups instanceof Array)) {
                groups = [groups];
            }

            context.setObject(object);

            for (var getter in rules.getters) {
                if (rules.getters.hasOwnProperty(getter)) {
                    context.setPath(getter);

                    for (constraint in rules.getters[getter]){
                        if (rules.getters[getter].hasOwnProperty(constraint)) {
                            context.validate(
                                object[getter](),
                                this.constraintFactory.make(
                                    constraint,
                                    rules.getters[getter][constraint]
                                ),
                                groups
                            );
                        }
                    }
                }
            }

            for (var property in rules.properties) {
                if (rules.properties.hasOwnProperty(property)) {
                    context.setPath(property);

                    if (this.useReflection) {
                        refl = new ReflectionObject(object);
                        propGetter = 'get' + property.charAt(0).toUpperCase() + property.substr(1);

                        if (refl.hasMethod(propGetter)) {
                            value = refl.getMethod(propGetter).call()
                        } else if (refl.hasMethod('get')) {
                            value = refl.getMethod('get').call(property);
                        } else {
                            value = refl.getProperty(property).getValue();
                        }
                    } else {
                        value = object[property];
                    }

                    for (constraint in rules.properties[property]) {
                        if (rules.properties[property].hasOwnProperty(constraint)) {
                            context.validate(
                                value,
                                this.constraintFactory.make(
                                    constraint,
                                    rules.properties[property][constraint]
                                ),
                                groups
                            );
                        }
                    }
                }
            }

            return context.getViolations();

        }
    },

    /**
     * Look for the rules for the given object
     *
     * @private
     * @param {Object} object
     *
     * @return {Object} Set of rules
     */

    resolve: {
        value: function (object) {
            var mapping = this.rules.getMapping(),
                constructor;

            for (var path in mapping) {
                if (mapping.hasOwnProperty(path)) {
                    constructor = objectGetter(path);

                    if (!!constructor && object instanceof constructor) {
                        return mapping[path];
                    }
                }
            }

            throw new ReferenceError('No rules defined for the specified object');
        }
    }

});

namespace('Sy.Validator');

/**
 * Basic constraint that implement the `hasGroup` interface method
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.Validator.ConstraintInterface}
 */

Sy.Validator.AbstractConstraint = function (options) {
    Sy.Validator.ConstraintInterface.call(this, options);

    this.groups = options.groups instanceof Array ? options.groups : [];
};
Sy.Validator.AbstractConstraint.prototype = Object.create(Sy.Validator.ConstraintInterface.prototype, {

    /**
     * @inheritDoc
     */

    hasGroup: {
        value: function (group) {
            return this.groups instanceof Array && this.groups.indexOf(group) !== -1;
        }
    }

})

namespace('Sy.Validator');

/**
 * Abstract constraint validator that implements context setter
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.Validator.ConstraintValidatorInterface}
 */

Sy.Validator.AbstractConstraintValidator = function () {
    this.context = null;
};
Sy.Validator.AbstractConstraintValidator.prototype = Object.create(Sy.Validator.ConstraintValidatorInterface.prototype, {

    /**
     * @inheritDoc
     */

    setContext: {
        value: function (context) {
            this.context = context;

            return this;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Constraint to check if a value is an empty string or is null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Blank = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'This value must be blank';
};
Sy.Validator.Constraint.Blank.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.BlankValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Blank constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.BlankValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.BlankValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Blank)) {
                throw new TypeError('Invalid constraint');
            }

            if (
                (typeof value === 'string' && value.length !== 0) &&
                value !== null
            ) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Use a function to validate a value
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Callback = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    if (options.callback === undefined) {
        throw new ReferenceError('Undefined constraint callback');
    }

    this.callback = options.callback;
};
Sy.Validator.Constraint.Callback.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.CallbackValidator';
        }
    },

    /**
     * Return the callback
     *
     * @return {String}
     */

    getCallback: {
        value: function () {
            return this.callback;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Callback constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.CallbackValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.CallbackValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Callback)) {
                throw new TypeError('Invalid constraint');
            }

            var callback = constraint.getCallback();

            this.context.getObject()[callback](this.context);

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is one of the defined choices
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Choice = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.choices = options.choices || [];
    this.multiple = !!options.multiple;
    this.min = parseInt(options.min, 10);
    this.max = parseInt(options.max, 10);
    this.message = options.message || 'The value you selected is not a valid choice';
    this.multipleMessage = options.multipleMessage || 'One or more of the given values is invalid';
    this.minMessage = options.minMessage || 'You must select more choices';
    this.maxMessage = options.maxMessage || 'You have selected too many choices';
    this.callback = options.callback;
};
Sy.Validator.Constraint.Choice.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.ChoiceValidator';
        }
    },

    /**
     * Return the choices array
     *
     * @return {Array}
     */

    getChoices: {
        value: function () {
            return this.choices;
        }
    },

    /**
     * Check if the constraint has a function defined to get choices
     *
     * @return {Boolean}
     */

    hasCallback: {
        value: function () {
            return !!this.callback;
        }
    },

    /**
     * Return the callback to get choices
     *
     * @return {String}
     */

    getCallback: {
        value: function () {
            return this.callback;
        }
    },

    /**
     * Check if the value can contain numerous choices
     *
     * @return {Boolean}
     */

    isMultiple: {
        value: function () {
            return this.multiple;
        }
    },

    /**
     * Check if the constraint has a minimum of choices
     *
     * @return {Boolean}
     */

    hasMin: {
        value: function () {
            return !isNaN(this.min);
        }
    },

    /**
     * Return the minimum count of choices required
     *
     * @return {Integer}
     */

    getMin: {
        value: function () {
            return this.min;
        }
    },

    /**
     * Check if the constraint has a maximum of choices
     *
     * @return {Boolean}
     */

    hasMax: {
        value: function () {
            return !isNaN(this.max);
        }
    },

    /**
     * Return the maximum count of choices required
     *
     * @return {Integer}
     */

    getMax: {
        value: function () {
            return this.max;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    },

    /**
     * Return the error message if multiple choices allowed
     *
     * @return {String}
     */

    getMultipleMessage: {
        value: function () {
            return this.multipleMessage;
        }
    },

    /**
     * Return the error message if too few choices
     *
     * @return {String}
     */

    getMinMessage: {
        value: function () {
            return this.minMessage;
        }
    },

    /**
     * Return the error message if too many choices
     *
     * @return {String}
     */

    getMaxMessage: {
        value: function () {
            return this.maxMessage;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Choice constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.ChoiceValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.ChoiceValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Choice)) {
                throw new TypeError('Invalid constraint');
            }

            if (constraint.isMultiple() && !(value instanceof Array)) {
                throw new TypeError('Array expected');
            }

            var choices;

            if (constraint.hasCallback()) {
                var callback = constraint.getCallback();

                choices = this.context.getObject()[callback]();
            } else {
                choices = constraint.getChoices();
            }

            if (constraint.isMultiple()) {
                for (var i = 0, l = value.length; i < l; i++) {
                    if (choices.indexOf(value[i]) === -1) {
                        this.context.addViolation(constraint.getMultipleMessage());
                    }
                }

                if (constraint.hasMin() && value.length < constraint.getMin()) {
                    this.context.addViolation(constraint.getMinMessage());
                }

                if (constraint.hasMax() && value.length > constraint.getMax()) {
                    this.context.addViolation(constraint.getMaxMessage());
                }
            } else if (choices.indexOf(value) === -1) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check a value is a country code
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Country = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'This value is not a valid country';
};
Sy.Validator.Constraint.Country.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.CountryValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

})

namespace('Sy.Validator.Constraint');

/**
 * Country constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.CountryValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.CountryValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Country)) {
                throw new TypeError('Invalid constraint');
            }

            if (Intl.Collator.supportedLocalesOf(value).length === 0) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is a valid date
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Date = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value is not a valid date';
};
Sy.Validator.Constraint.Date.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.DateValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Date constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.DateValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.DateValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Date)) {
                throw new TypeError('Invalid constraint');
            }

            if (['', null, undefined].indexOf(value) !== -1) {
                return;
            }

            if (typeof value === 'string') {
                if ((new Date(value)).toDateString() === 'Invalid Date') {
                    this.context.addViolation(constraint.getMessage());
                }
            } else if (!(value instanceof Date)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check the value is an email
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Email = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value is not a valid email';
};
Sy.Validator.Constraint.Email.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.EmailValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Email constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.EmailValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.EmailValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Email)) {
                throw new TypeError('Invalid constraint');
            }

            if (['', null, undefined].indexOf(value) !== -1) {
                return;
            }

            var regex = new RegExp(/^[a-z\.\-\_]+@[a-z\.\-\_]+\.[a-z]{2,}$/i);

            if (!regex.test(value)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the validated value is equal to the given value
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.EqualTo = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value should be equal to ' + options.value;
};
Sy.Validator.Constraint.EqualTo.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.EqualToValidator';
        }
    },

    /**
     * Return the wished value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * EqualTo constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.EqualToValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.EqualToValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.EqualTo)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is false
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.False = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must be false';
};
Sy.Validator.Constraint.False.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.FalseValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * False constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.FalseValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.FalseValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.False)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== false) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is greater than the given one
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.GreaterThan = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must be greater than "' + options.value + '"';
};
Sy.Validator.Constraint.GreaterThan.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.GreaterThanValidator';
        }
    },

    /**
     * Return the reference value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * GreaterThan constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.GreaterThanValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.GreaterThanValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.GreaterThan)) {
                throw new TypeError('Invalid constraint');
            }

            if (value <= constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is greater than or equal to the given one
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.GreaterThanOrEqual = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must be greater than or equal to "' + options.value + '"';
};
Sy.Validator.Constraint.GreaterThanOrEqual.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.GreaterThanOrEqualValidator';
        }
    },

    /**
     * Return the reference value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * GreaterThanOrEqual constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.GreaterThanOrEqualValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.GreaterThanOrEqualValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.GreaterThanOrEqual)) {
                throw new TypeError('Invalid constraint');
            }

            if (value < constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is an IP address
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Ip = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.port = !!options.port;
    this.mask = !!options.mask;
    this.message = options.message || 'The value is not a valid IP address';
};
Sy.Validator.Constraint.Ip.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.IpValidator';
        }
    },

    /**
     * Does it must have a port specified
     *
     * @return {Boolean}
     */

    hasPort: {
        value: function () {
            return this.port;
        }
    },

    /**
     * Does it must have a wildcard mask
     *
     * @return {Boolean}
     */

    hasMask: {
        value: function () {
            return this.mask;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Ip constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.IpValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.IpValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Ip)) {
                throw new TypeError('Invalid constraint');
            }

            var portRegex = ':[0-9]{1,6}',
                maskRegex = '\\/(?:[12][0-9]|3[0-2]|[0-9])',
                regex = '^(?:[01]?[0-9]?[0-9]\.|2[0-4][0-9]\.|25[0-5]\.){3}(?:[01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]){1}';

            if (constraint.hasPort()) {
                regex += portRegex;
            }

            if (constraint.hasMask()) {
                regex += maskRegex;
            }

            regex = new RegExp(regex + '$');

            if (!regex.test(value)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value has a length between the specified min and max
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Length = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.min = options.min;
    this.max = options.max;
    this.minMessage = options.minMessage || 'The value is too short';
    this.maxMessage = options.maxMessage || 'The value is too long';
    this.exactMessage = options.exactMessage || 'The value must be ' + this.min + ' long';
};
Sy.Validator.Constraint.Length.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.LengthValidator';
        }
    },

    /**
     * Get the minimum length
     *
     * @return {Integer}
     */

    getMin: {
        value: function () {
            return this.min;
        }
    },

    /**
     * Return the maximum length
     *
     * @return {Integer}
     */

    getMax: {
        value: function () {
            return this.max;
        }
    },

    /**
     * Return the error message if value too short
     *
     * @return {String}
     */

    getMinMessage: {
        value: function () {
            return this.minMessage;
        }
    },

    /**
     * Return the error message if value too long
     *
     * @return {String}
     */

    getMaxMessage: {
        value: function () {
            return this.maxMessage;
        }
    },

    /**
     * Return the error message in case min is equal to max, and the value differs from it
     *
     * @return {String}
     */

    getExactMessage: {
        value: function () {
            return this.exactMessage;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Length constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.LengthValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.LengthValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Length)) {
                throw new TypeError('Invalid constraint');
            }

            if (['', null, undefined].indexOf(value) !== -1) {
                return;
            }

            if (value.length === undefined) {
                throw new TypeError('The value has no length attribute');
            }

            if (
                constraint.getMin() === constraint.getMax() &&
                value.length !== constraint.getMin()
            ) {
                this.context.addViolation(constraint.getExactMessage());
            } else {

                if (value.length < constraint.getMin()) {
                    this.context.addViolation(constraint.getMinMessage());
                }

                if (value.length > constraint.getMax()) {
                    this.context.addViolation(constraint.getMaxMessage());
                }

            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is less than the given one
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.LessThan = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must be less than "' + options.value + '"';
};
Sy.Validator.Constraint.LessThan.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.LessThanValidator';
        }
    },

    /**
     * Return the reference value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * LessThan constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.LessThanValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.LessThanValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.LessThan)) {
                throw new TypeError('Invalid constraint');
            }

            if (value >= constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is less than or equal to the given one
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.LessThanOrEqual = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must be less than or equal to "' + options.value + '"';
};
Sy.Validator.Constraint.LessThanOrEqual.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.LessThanOrEqualValidator';
        }
    },

    /**
     * Return the reference value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * LessThanOrEqual constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.LessThanOrEqualValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.LessThanOrEqualValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.LessThanOrEqual)) {
                throw new TypeError('Invalid constraint');
            }

            if (value > constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Constraint to check if a value is not an empty string nor is null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.NotBlank = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'This value must not be blank';
};
Sy.Validator.Constraint.NotBlank.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NotBlankValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * NotBlank constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotBlankValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotBlankValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotBlank)) {
                throw new TypeError('Invalid constraint');
            }

            if (
                (typeof value === 'string' && value.length === 0) ||
                value === null
            ) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the validated value is equal to the given value
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.NotEqualTo = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.value = options.value;
    this.message = options.message || 'The value must not be equal to ' + options.value;
};
Sy.Validator.Constraint.NotEqualTo.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NotEqualToValidator';
        }
    },

    /**
     * Return the wished value
     *
     * @return {mixed}
     */

    getValue: {
        value: function () {
            return this.value;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * NotEqualTo constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotEqualToValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotEqualToValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotEqualTo)) {
                throw new TypeError('Invalid constraint');
            }

            if (value === constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is not null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.NotNull = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must not be null';
};
Sy.Validator.Constraint.NotNull.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NotNullValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * NotNull constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotNullValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotNullValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotNull)) {
                throw new TypeError('Invalid constraint');
            }

            if (value === null) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is not undefined
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.NotUndefined = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must not be undefined';
};
Sy.Validator.Constraint.NotUndefined.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NotUndefinedValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * NotUndefined constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotUndefinedValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotUndefinedValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotUndefined)) {
                throw new TypeError('Invalid constraint');
            }

            if (value === undefined) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Null = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must be null';
};
Sy.Validator.Constraint.Null.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NullValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Null constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NullValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NullValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Null)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== null) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is in the defined range
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Range = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.min = options.min;
    this.max = options.max;
    this.minMessage = options.minMessage || 'The value is below the lower bound';
    this.maxMessage = options.maxMessage || 'The value is above the upper bound';
};
Sy.Validator.Constraint.Range.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.RangeValidator';
        }
    },

    /**
     * Return the lower bound
     *
     * @return {Integer}
     */

    getMin: {
        value: function () {
            return this.min;
        }
    },

    /**
     * Return the upper bound
     *
     * @return {Integer}
     */

    getMax: {
        value: function () {
            return this.max;
        }
    },

    /**
     * Return the lower bound error message
     *
     * @return {String}
     */

    getMinMessage: {
        value: function () {
            return this.minMessage;
        }
    },

    /**
     * Return the upper bound error message
     *
     * @return {String}
     */

    getMaxMessage: {
        value: function () {
            return this.maxMessage;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Range constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.RangeValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.RangeValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Range)) {
                throw new TypeError('Invalid constraint');
            }

            if (typeof value !== 'number' || isNaN(value)) {
                throw new TypeError('The value is not a numer');
            }

            if (value < constraint.getMin()) {
                this.context.addViolation(constraint.getMinMessage());
            }

            if (value > constraint.getMax()) {
                this.context.addViolation(constraint.getMaxMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value match the given pattern
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Regex = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.pattern = options.pattern;
    this.flags = options.flags;
    this.message = options.message || 'The value do not match the wished pattern';
};
Sy.Validator.Constraint.Regex.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.RegexValidator';
        }
    },

    /**
     * Return the regular expression pattern
     *
     * @return {String}
     */

    getPattern: {
        value: function () {
            return this.pattern;
        }
    },

    /**
     * Return the regular expression flags
     *
     * @return {String}
     */

    getFlags: {
        value: function () {
            return this.flags;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Regex constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.RegexValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.RegexValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Regex)) {
                throw new TypeError('Invalid constraint');
            }

            try {
                var regex = new RegExp(constraint.getPattern(), constraint.getFlags())

                if (!regex.test(value)) {
                    this.context.addViolation(constraint.getMessage());
                }
            } catch (e) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is true
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.True = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must be true';
};
Sy.Validator.Constraint.True.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.TrueValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * True constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.TrueValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.TrueValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.True)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== true) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is of the specified type
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Type = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.type = options.type;
    this.message = options.message || 'The value differs from the specified type';
};
Sy.Validator.Constraint.Type.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.TypeValidator';
        }
    },

    /**
     * Return the wished type
     *
     * @return {mixed}
     */

    getType: {
        value: function () {
            return this.type;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Type constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.TypeValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.TypeValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Type)) {
                throw new TypeError('Invalid constraint');
            }

            var expected = constraint.getType(),
                constructor = objectGetter(expected) || function () {};

            if (
                typeof value !== expected &&
                !(value instanceof constructor)
            ) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that the value is undefined
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Undefined = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'The value must be undefined';
};
Sy.Validator.Constraint.Undefined.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.UndefinedValidator';
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Undefined constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.UndefinedValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.UndefinedValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Undefined)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== undefined) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Check that a value is a valid url
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Url = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.protocols = options.protocols instanceof Array ? options.protocols : ['http', 'https'];
    this.message = options.message || 'The value is not a valid url';
};
Sy.Validator.Constraint.Url.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.UrlValidator';
        }
    },

    /**
     * Return the protocols
     *
     * @return {Array}
     */

    getProtocols: {
        value: function () {
            return this.protocols;
        }
    },

    /**
     * Return the error message
     *
     * @return {String}
     */

    getMessage: {
        value: function () {
            return this.message;
        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * Url constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.UrlValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.UrlValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Url)) {
                throw new TypeError('Invalid constraint');
            }

            if (['', null, undefined].indexOf(value) !== -1) {
                return;
            }

            var protocols = constraint.getProtocols().join('|'),
                regex = new RegExp('^(' + protocols + ')://[a-z\-\_\.]+(?:\.[a-z]{2,})?.*$', 'i');

            if (!regex.test(value)) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator');

/**
 * Build an instance of the specified constraint
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Validator.ConstraintFactory = function () {};
Sy.Validator.ConstraintFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, options) {

            var constructor = Sy.Validator.Constraint[name],
                constraint;

            if (constructor === undefined) {
                throw new ReferenceError('The constraint "' + name + '" is undefined');
            }

            constraint = new constructor(options);

            if (!(constraint instanceof Sy.Validator.ConstraintInterface)) {
                throw new TypeError('"' + name + '" is not a valid constraint');
            }

            return constraint;

        }
    }

});

namespace('Sy.Validator');

/**
 * Build the validator object of a constraint
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Validator.ConstraintValidatorFactory = function () {
    this.validators = {};
};
Sy.Validator.ConstraintValidatorFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function (constraint) {

            if (!(constraint instanceof Sy.Validator.ConstraintInterface)) {
                throw new TypeError('Invalid constraint');
            }

            var path = constraint.validatedBy(),
                constructor;

            if (this.validators[path] === undefined) {
                constructor = objectGetter(path);

                if (constructor === undefined) {
                    throw new ReferenceError('Undefined validator "' + path + '"');
                }

                this.validators[path] = new constructor();
            }

            return this.validators[path];

        }
    }

});
namespace('Sy.Validator');

/**
 * Holds message and path of a constraint violation
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.ConstraintViolation = function (data) {
    this.message = data.message;
    this.path = data.path;
};
Sy.Validator.ConstraintViolation.prototype = Object.create(Object.prototype, {

    /**
     * Return the violation message
     *
     * @return {String}
     */

    toString: {
        value: function () {
            return this.message;
        }
    },

    /**
     * Return the violation path
     *
     * @return {String}
     */

    getPath: {
        value: function () {
            return this.path;
        }
    },

    /**
     * Return raw object containing message + path
     *
     * @return {Object}
     */

    toJSON: {
        value: function () {
            return {
                message: this.message,
                path: this.path
            }
        }
    }

});

namespace('Sy.Validator');

/**
 * Holds a set of contraint violations messages
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.ConstraintViolationList = function () {
    this.violations = [];
    this.length = 0;
};
Sy.Validator.ConstraintViolationList.prototype = Object.create(Object.prototype, {

    /**
     * Add a new violation
     *
     * @param {String} message
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    addViolation: {
        value: function (message) {
            this.violations.push(new Sy.Validator.ConstraintViolation({
                message: message
            }));
            this.length++;

            return this;
        }
    },

    /**
     * Add a new violation for the specified path
     *
     * @param {String} message
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    addViolationAt: {
        value: function (path, message) {
            this.violations.push(new Sy.Validator.ConstraintViolation({
                message: message,
                path: path
            }));
            this.length++;

            return this;
        }
    },

    /**
     * Apply a callback on each violations
     *
     * @param {Function} callback
     *
     * @return {Sy.Validator.ConstraintViolationList} self
     */

    forEach: {
        value: function (callback) {
            this.violations.forEach(callback);

            return this;
        }
    },

    /**
     * Return all the violations
     *
     * @return {Array}
     */

    getViolations: {
        value: function () {
            return this.violations;
        }
    },

    /**
     * Return the violations for the specified type
     *
     * @return {Array}
     */

    getViolationsAt: {
        value: function (path) {
            return this.violations.filter(function (violation) {
                return violation.getPath() === path;
            }.bind(this));
        }
    },

    /**
     * Return an array of raw representation of each violation
     *
     * @return {Array}
     */

    toJSON: {
        value: function () {
            return this.violations.map(function (element) {
                return element.toJSON();
            });
        }
    }

});

namespace('Sy.Validator');

/**
 * Execute the validation of values against constraints
 *
 * @package Sy
 * @subpackage Validator
 * @class
 */

Sy.Validator.ExecutionContext = function () {
    this.constraintValidatorFactory = null;
    this.violations = null;
    this.path = null;
    this.object = null;
};
Sy.Validator.ExecutionContext.prototype = Object.create(Object.prototype, {

    /**
     * Set the constraint validator factory
     *
     * @param {Sy.Validator.ConstraintValidatorFactory} factory
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    setConstraintValidatorFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Validator.ConstraintValidatorFactory)) {
                throw new TypeError('Invalid constraint validator factory');
            }

            this.constraintValidatorFactory = factory;

            return this;
        }
    },

    /**
     * Set the constraint violations list
     *
     * @param {Sy.Validator.ConstraintViolationList} violations
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    setViolationList: {
        value: function (violations) {
            if (!(violations instanceof Sy.Validator.ConstraintViolationList)) {
                throw new TypeError('Invalid constraint violation list');
            }

            this.violations = violations;

            return this;
        }
    },

    /**
     * Return the violation list
     *
     * @return {Sy.Validator.ConstraintViolationList}
     */

    getViolations: {
        value: function () {
            return this.violations;
        }
    },

    /**
     * Set the path in the object being validated
     *
     * @param {String} path
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    setPath: {
        value: function (path) {
            this.path = path;

            return this;
        }
    },

    /**
     * Set the object being validated
     *
     * @param {Object} object
     *
     * @return {Sy.Validator.ExecutionContext}
     */

    setObject: {
        value: function (object) {
            this.object = object;

            return this;
        }
    },

    /**
     * Return the object being validated
     *
     * @return {Object}
     */

    getObject: {
        value: function () {
            return this.object;
        }
    },

    /**
     * Add a new violation
     *
     * @param {String} message
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    addViolation: {
        value: function (message) {
            if (this.path) {
                this.violations.addViolationAt(this.path, message);
            } else {
                this.violations.addViolation(message);
            }
        }
    },

    /**
     * Add a new violation for the specified path
     *
     * @param {String} path
     * @param {String} message
     *
     * @return {Sy.Validator.ExecutionContext} self
     */

    addViolationAt: {
        value: function (path, message) {
            this.violations.addViolationAt(path, message);
        }
    },

    /**
     * Validate the value against the constraint
     *
     * @param {mixed} value
     * @param {Sy.Validator.ConstraintInterface} constraint
     * @param {Array} groups
     *
     * @return {void}
     */

    validate: {
        value: function (value, constraint, groups) {

            var validator = this.constraintValidatorFactory.make(constraint);

            if (groups instanceof Array && groups.length > 0) {
                for (var i = 0, l = groups.length; i < l; i++) {
                    if (constraint.hasGroup(groups[i])) {
                        validator
                            .setContext(this)
                            .validate(value, constraint);
                        break;
                    }
                }
            } else {
                validator
                    .setContext(this)
                    .validate(value, constraint);
            }

        }
    }

});

namespace('Sy.Validator');

/**
 * Generates new validation execution contexts
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Validator.ExecutionContextFactory = function () {
    this.constraintValidatorFactory = null;
};
Sy.Validator.ExecutionContextFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the constraint validator factory
     *
     * @param {Sy.Validator.ConstraintValidatorFactory} factory
     *
     * @return {Sy.Validator.ExecutionContextFactory} self
     */

    setConstraintValidatorFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Validator.ConstraintValidatorFactory)) {
                throw new TypeError('Invalid constraint validator factory');
            }

            this.constraintValidatorFactory = factory;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function () {
            var context = new Sy.Validator.ExecutionContext();

            return context
                .setConstraintValidatorFactory(this.constraintValidatorFactory)
                .setViolationList(new Sy.Validator.ConstraintViolationList());
        }
    }

});

/*! sy#0.6.0 - 2014-06-08 */
function namespace(ns) {
    var namespaces = null, referer = this;
    if ("string" == typeof ns) namespaces = ns.split("."); else {
        if (!(ns instanceof Array && ns.length > 0)) return referer;
        namespaces = ns;
    }
    return referer[namespaces[0]] = referer[namespaces[0]] || {}, ns = namespaces.shift(), 
    namespace.call(referer[ns], namespaces);
}

function objectSetter(ns, value) {
    var namespaces = "", attr = "", referer = this, idx = ns.lastIndexOf(".");
    idx >= 0 ? (attr = ns.substr(idx + 1), namespaces = ns.substr(0, idx), referer = namespace.call(referer, namespaces)) : attr = ns, 
    referer[attr] = value;
}

function objectGetter(ns) {
    var namespaces = null, referer = this;
    if ("string" == typeof ns) {
        if (namespaces = ns.split("."), 1 === namespaces.length) return referer[ns];
    } else {
        if (!(ns instanceof Array && ns.length > 1)) return ns instanceof Array && 1 === ns.length ? referer[ns[0]] : void 0;
        namespaces = ns;
    }
    return ns = namespaces.shift(), objectGetter.call(referer[ns], namespaces);
}

function capitalize(string) {
    return string.substr(0, 1).toUpperCase() + string.substr(1);
}

function reflectedObjectGetter(ns) {
    var namespaces = null, referer = this;
    if ("string" == typeof ns) {
        if (namespaces = ns.split("."), 1 === namespaces.length) return getReflectedValue.call(referer, ns);
    } else {
        if (!(ns instanceof Array && ns.length > 1)) return ns instanceof Array && 1 === ns.length ? getReflectedValue.call(referer, ns[0]) : void 0;
        namespaces = ns;
    }
    return ns = namespaces.shift(), reflectedObjectGetter.call(getReflectedValue.call(referer, ns), namespaces);
}

function getReflectedValue(property) {
    var referer = new ReflectionObject(this);
    return referer.hasMethod("get" + capitalize(property)) ? referer.getMethod("get" + capitalize(property)).call() : referer.hasMethod("get") ? referer.getMethod("get").call(property) : referer.hasProperty(property) ? referer.getProperty(property).getValue() : void 0;
}

namespace("Sy"), Sy.FactoryInterface = function() {}, Sy.FactoryInterface.prototype = Object.create(Object.prototype, {
    make: {
        value: function() {}
    }
}), namespace("Sy"), Sy.RegistryInterface = function() {}, Sy.RegistryInterface.prototype = Object.create(Object.prototype, {
    set: {
        value: function() {}
    },
    has: {
        value: function() {}
    },
    get: {
        value: function() {}
    },
    getMapping: {
        value: function() {}
    },
    remove: {
        value: function() {}
    },
    length: {
        value: function() {}
    }
}), namespace("Sy"), Sy.Registry = function() {
    this.data = {}, this.registryLength = 0;
}, Sy.Registry.prototype = Object.create(Sy.RegistryInterface.prototype, {
    set: {
        value: function(key, value) {
            return "string" == typeof key && (this.data[key] = value, this.registryLength++), 
            this;
        }
    },
    has: {
        value: function(key) {
            return this.data.hasOwnProperty(key) ? !0 : !1;
        }
    },
    get: {
        value: function(key) {
            if (this.has(key)) return this.data[key];
            if (void 0 === key) {
                var data = [];
                for (var k in this.data) this.data.hasOwnProperty(k) && data.push(this.data[k]);
                return data;
            }
            throw new ReferenceError('"' + key + '" is not defined');
        }
    },
    getMapping: {
        value: function() {
            var data = {};
            for (var k in this.data) this.data.hasOwnProperty(k) && (data[k] = this.data[k]);
            return data;
        }
    },
    remove: {
        value: function(keys) {
            if (void 0 === keys) for (var key in this.data) this.data.hasOwnProperty(key) && this.remove(key); else if (keys instanceof Array) for (var i = 0, l = keys.length; l > i; i++) this.remove(keys[i]); else "string" == typeof keys && this.has(keys) && (delete this.data[keys], 
            this.registryLength--);
            return this;
        }
    },
    length: {
        value: function() {
            return this.registryLength;
        }
    }
}), namespace("Sy"), Sy.RegistryFactory = function() {}, Sy.RegistryFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {
    make: {
        value: function() {
            return new Sy.Registry();
        }
    }
}), namespace("Sy.Validator"), Sy.Validator.ConstraintInterface = function() {}, 
Sy.Validator.ConstraintInterface.prototype = Object.create(Object.prototype, {
    hasGroup: {
        value: function() {}
    },
    validateBy: {
        value: function() {}
    }
}), namespace("Sy.Validator"), Sy.Validator.ConstraintValidatorInterface = function() {}, 
Sy.Validator.ConstraintValidatorInterface.prototype = Object.create(Object.prototype, {
    setContext: {
        value: function() {}
    },
    validate: {
        value: function() {}
    }
}), namespace("Sy.Validator"), Sy.Validator.Core = function() {
    this.rules = null, this.contextFactory = null, this.constraintFactory = null, this.useReflection = !0;
}, Sy.Validator.Core.prototype = Object.create(Object.prototype, {
    setRulesRegistry: {
        value: function(registry) {
            if (!(registry instanceof Sy.RegistryInterface)) throw new TypeError("Invalid registry");
            return this.rules = registry, this;
        }
    },
    setContextFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.Validator.ExecutionContextFactory)) throw new TypeError("Invalid context factory");
            return this.contextFactory = factory, this;
        }
    },
    setConstraintFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.Validator.ConstraintFactory)) throw new TypeError("Invalid constraint factory");
            return this.constraintFactory = factory, this;
        }
    },
    enableReflection: {
        value: function() {
            return this.useReflection = !0, this;
        }
    },
    disableReflection: {
        value: function() {
            return this.useReflection = !1, this;
        }
    },
    registerRules: {
        value: function(data) {
            for (var path in data) data.hasOwnProperty(path) && this.registerRule(path, data[path]);
            return this;
        }
    },
    registerRule: {
        value: function(path, data) {
            if (this.rules.has(path)) throw new ReferenceError('Rules are already defined for the path "' + path + '"');
            return void 0 === data.getters && (data.getters = {}), void 0 === data.properties && (data.properties = {}), 
            this.rules.set(path, data), this;
        }
    },
    validateValue: {
        value: function(value, constraints, groups) {
            groups = groups || [], constraints instanceof Array || (constraints = [ constraints ]), 
            groups instanceof Array || (groups = [ groups ]);
            for (var context = this.contextFactory.make(), i = 0, l = constraints.length; l > i; i++) context.validate(value, constraints[i], groups);
            return context.getViolations();
        }
    },
    validate: {
        value: function(object, groups) {
            var constraint, value, refl, propGetter, rules = this.resolve(object), context = this.contextFactory.make();
            groups = groups || [], groups instanceof Array || (groups = [ groups ]), context.setObject(object);
            for (var getter in rules.getters) if (rules.getters.hasOwnProperty(getter)) {
                context.setPath(getter);
                for (constraint in rules.getters[getter]) rules.getters[getter].hasOwnProperty(constraint) && context.validate(object[getter](), this.constraintFactory.make(constraint, rules.getters[getter][constraint]), groups);
            }
            for (var property in rules.properties) if (rules.properties.hasOwnProperty(property)) {
                context.setPath(property), this.useReflection ? (refl = new ReflectionObject(object), 
                propGetter = "get" + property.charAt(0).toUpperCase() + property.substr(1), value = refl.hasMethod(propGetter) ? refl.getMethod(propGetter).call() : refl.hasMethod("get") ? refl.getMethod("get").call(property) : refl.getProperty(property).getValue()) : value = object[property];
                for (constraint in rules.properties[property]) rules.properties[property].hasOwnProperty(constraint) && context.validate(value, this.constraintFactory.make(constraint, rules.properties[property][constraint]), groups);
            }
            return context.getViolations();
        }
    },
    resolve: {
        value: function(object) {
            var constructor, mapping = this.rules.getMapping();
            for (var path in mapping) if (mapping.hasOwnProperty(path) && (constructor = objectGetter(path), 
            constructor && object instanceof constructor)) return mapping[path];
            throw new ReferenceError("No rules defined for the specified object");
        }
    }
}), namespace("Sy.Validator"), Sy.Validator.AbstractConstraint = function(options) {
    Sy.Validator.ConstraintInterface.call(this, options), this.groups = options.groups instanceof Array ? options.groups : [];
}, Sy.Validator.AbstractConstraint.prototype = Object.create(Sy.Validator.ConstraintInterface.prototype, {
    hasGroup: {
        value: function(group) {
            return this.groups instanceof Array && -1 !== this.groups.indexOf(group);
        }
    }
}), namespace("Sy.Validator"), Sy.Validator.AbstractConstraintValidator = function() {
    this.context = null;
}, Sy.Validator.AbstractConstraintValidator.prototype = Object.create(Sy.Validator.ConstraintValidatorInterface.prototype, {
    setContext: {
        value: function(context) {
            return this.context = context, this;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Blank = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.message = options.message || "This value must be blank";
}, Sy.Validator.Constraint.Blank.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.BlankValidator";
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.BlankValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.BlankValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Blank)) throw new TypeError("Invalid constraint");
            "string" == typeof value && 0 !== value.length && null !== value && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Callback = function(options) {
    if (options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), 
    void 0 === options.callback) throw new ReferenceError("Undefined constraint callback");
    this.callback = options.callback;
}, Sy.Validator.Constraint.Callback.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.CallbackValidator";
        }
    },
    getCallback: {
        value: function() {
            return this.callback;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.CallbackValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.CallbackValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Callback)) throw new TypeError("Invalid constraint");
            var callback = constraint.getCallback();
            this.context.getObject()[callback](this.context);
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Choice = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.choices = options.choices || [], 
    this.multiple = !!options.multiple, this.min = parseInt(options.min, 10), this.max = parseInt(options.max, 10), 
    this.message = options.message || "The value you selected is not a valid choice", 
    this.multipleMessage = options.multipleMessage || "One or more of the given values is invalid", 
    this.minMessage = options.minMessage || "You must select more choices", this.maxMessage = options.maxMessage || "You have selected too many choices", 
    this.callback = options.callback;
}, Sy.Validator.Constraint.Choice.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.ChoiceValidator";
        }
    },
    getChoices: {
        value: function() {
            return this.choices;
        }
    },
    hasCallback: {
        value: function() {
            return !!this.callback;
        }
    },
    getCallback: {
        value: function() {
            return this.callback;
        }
    },
    isMultiple: {
        value: function() {
            return this.multiple;
        }
    },
    hasMin: {
        value: function() {
            return !isNaN(this.min);
        }
    },
    getMin: {
        value: function() {
            return this.min;
        }
    },
    hasMax: {
        value: function() {
            return !isNaN(this.max);
        }
    },
    getMax: {
        value: function() {
            return this.max;
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    },
    getMultipleMessage: {
        value: function() {
            return this.multipleMessage;
        }
    },
    getMinMessage: {
        value: function() {
            return this.minMessage;
        }
    },
    getMaxMessage: {
        value: function() {
            return this.maxMessage;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.ChoiceValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.ChoiceValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Choice)) throw new TypeError("Invalid constraint");
            if (constraint.isMultiple() && !(value instanceof Array)) throw new TypeError("Array expected");
            var choices;
            if (constraint.hasCallback()) {
                var callback = constraint.getCallback();
                choices = this.context.getObject()[callback]();
            } else choices = constraint.getChoices();
            if (constraint.isMultiple()) {
                for (var i = 0, l = value.length; l > i; i++) -1 === choices.indexOf(value[i]) && this.context.addViolation(constraint.getMultipleMessage());
                constraint.hasMin() && value.length < constraint.getMin() && this.context.addViolation(constraint.getMinMessage()), 
                constraint.hasMax() && value.length > constraint.getMax() && this.context.addViolation(constraint.getMaxMessage());
            } else -1 === choices.indexOf(value) && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Country = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.message = options.message || "This value is not a valid country";
}, Sy.Validator.Constraint.Country.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.CountryValidator";
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.CountryValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.CountryValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Country)) throw new TypeError("Invalid constraint");
            0 === Intl.Collator.supportedLocalesOf(value).length && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Date = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.message = options.message || "The value is not a valid date";
}, Sy.Validator.Constraint.Date.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.DateValidator";
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.DateValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.DateValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Date)) throw new TypeError("Invalid constraint");
            "string" == typeof value ? "Invalid Date" === new Date(value).toDateString() && this.context.addViolation(constraint.getMessage()) : value instanceof Date || this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Email = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.message = options.message || "The value is not a valid email";
}, Sy.Validator.Constraint.Email.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.EmailValidator";
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.EmailValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.EmailValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Email)) throw new TypeError("Invalid constraint");
            var regex = new RegExp(/^[a-z\.\-\_]+@[a-z\.\-\_]+\.[a-z]{2,}$/i);
            regex.test(value) || this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.EqualTo = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.value = options.value, 
    this.message = options.message || "The value should be equal to " + options.value;
}, Sy.Validator.Constraint.EqualTo.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.EqualToValidator";
        }
    },
    getValue: {
        value: function() {
            return this.value;
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.EqualToValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.EqualToValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.EqualTo)) throw new TypeError("Invalid constraint");
            value !== constraint.getValue() && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.False = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.message = options.message || "The value must be false";
}, Sy.Validator.Constraint.False.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.FalseValidator";
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.FalseValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.FalseValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.False)) throw new TypeError("Invalid constraint");
            value !== !1 && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.GreaterThan = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.value = options.value, 
    this.message = options.message || 'The value must be greater than "' + options.value + '"';
}, Sy.Validator.Constraint.GreaterThan.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.GreaterThanValidator";
        }
    },
    getValue: {
        value: function() {
            return this.value;
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.GreaterThanValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.GreaterThanValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.GreaterThan)) throw new TypeError("Invalid constraint");
            value <= constraint.getValue() && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.GreaterThanOrEqual = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.value = options.value, 
    this.message = options.message || 'The value must be greater than or equal to "' + options.value + '"';
}, Sy.Validator.Constraint.GreaterThanOrEqual.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.GreaterThanOrEqualValidator";
        }
    },
    getValue: {
        value: function() {
            return this.value;
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.GreaterThanOrEqualValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.GreaterThanOrEqualValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.GreaterThanOrEqual)) throw new TypeError("Invalid constraint");
            value < constraint.getValue() && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Ip = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.port = !!options.port, 
    this.mask = !!options.mask, this.message = options.message || "The value is not a valid IP address";
}, Sy.Validator.Constraint.Ip.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.IpValidator";
        }
    },
    hasPort: {
        value: function() {
            return this.port;
        }
    },
    hasMask: {
        value: function() {
            return this.mask;
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.IpValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.IpValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Ip)) throw new TypeError("Invalid constraint");
            var portRegex = ":[0-9]{1,6}", maskRegex = "\\/(?:[12][0-9]|3[0-2]|[0-9])", regex = "^(?:[01]?[0-9]?[0-9].|2[0-4][0-9].|25[0-5].){3}(?:[01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]){1}";
            constraint.hasPort() && (regex += portRegex), constraint.hasMask() && (regex += maskRegex), 
            regex = new RegExp(regex + "$"), regex.test(value) || this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Length = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.min = options.min, 
    this.max = options.max, this.minMessage = options.minMessage || "The value is too short", 
    this.maxMessage = options.maxMessage || "The value is too long", this.exactMessage = options.exactMessage || "The value must be " + this.min + " long";
}, Sy.Validator.Constraint.Length.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.LengthValidator";
        }
    },
    getMin: {
        value: function() {
            return this.min;
        }
    },
    getMax: {
        value: function() {
            return this.max;
        }
    },
    getMinMessage: {
        value: function() {
            return this.minMessage;
        }
    },
    getMaxMessage: {
        value: function() {
            return this.maxMessage;
        }
    },
    getExactMessage: {
        value: function() {
            return this.exactMessage;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.LengthValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.LengthValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Length)) throw new TypeError("Invalid constraint");
            if (void 0 === value.length) throw new TypeError("The value has no length attribute");
            constraint.getMin() === constraint.getMax() && value.length !== constraint.getMin() ? this.context.addViolation(constraint.getExactMessage()) : (value.length < constraint.getMin() && this.context.addViolation(constraint.getMinMessage()), 
            value.length > constraint.getMax() && this.context.addViolation(constraint.getMaxMessage()));
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.LessThan = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.value = options.value, 
    this.message = options.message || 'The value must be less than "' + options.value + '"';
}, Sy.Validator.Constraint.LessThan.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.LessThanValidator";
        }
    },
    getValue: {
        value: function() {
            return this.value;
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.LessThanValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.LessThanValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.LessThan)) throw new TypeError("Invalid constraint");
            value >= constraint.getValue() && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.LessThanOrEqual = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.value = options.value, 
    this.message = options.message || 'The value must be less than or equal to "' + options.value + '"';
}, Sy.Validator.Constraint.LessThanOrEqual.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.LessThanOrEqualValidator";
        }
    },
    getValue: {
        value: function() {
            return this.value;
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.LessThanOrEqualValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.LessThanOrEqualValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.LessThanOrEqual)) throw new TypeError("Invalid constraint");
            value > constraint.getValue() && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.NotBlank = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.message = options.message || "This value must not be blank";
}, Sy.Validator.Constraint.NotBlank.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.NotBlankValidator";
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.NotBlankValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.NotBlankValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.NotBlank)) throw new TypeError("Invalid constraint");
            ("string" == typeof value && 0 === value.length || null === value) && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.NotEqualTo = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.value = options.value, 
    this.message = options.message || "The value must not be equal to " + options.value;
}, Sy.Validator.Constraint.NotEqualTo.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.NotEqualToValidator";
        }
    },
    getValue: {
        value: function() {
            return this.value;
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.NotEqualToValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.NotEqualToValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.NotEqualTo)) throw new TypeError("Invalid constraint");
            value === constraint.getValue() && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.NotNull = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.message = options.message || "The value must not be null";
}, Sy.Validator.Constraint.NotNull.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.NotNullValidator";
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.NotNullValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.NotNullValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.NotNull)) throw new TypeError("Invalid constraint");
            null === value && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.NotUndefined = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.message = options.message || "The value must not be undefined";
}, Sy.Validator.Constraint.NotUndefined.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.NotUndefinedValidator";
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.NotUndefinedValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.NotUndefinedValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.NotUndefined)) throw new TypeError("Invalid constraint");
            void 0 === value && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Null = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.message = options.message || "The value must be null";
}, Sy.Validator.Constraint.Null.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.NullValidator";
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.NullValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.NullValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Null)) throw new TypeError("Invalid constraint");
            null !== value && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Range = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.min = options.min, 
    this.max = options.max, this.minMessage = options.minMessage || "The value is below the lower bound", 
    this.maxMessage = options.maxMessage || "The value is above the upper bound";
}, Sy.Validator.Constraint.Range.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.RangeValidator";
        }
    },
    getMin: {
        value: function() {
            return this.min;
        }
    },
    getMax: {
        value: function() {
            return this.max;
        }
    },
    getMinMessage: {
        value: function() {
            return this.minMessage;
        }
    },
    getMaxMessage: {
        value: function() {
            return this.maxMessage;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.RangeValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.RangeValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Range)) throw new TypeError("Invalid constraint");
            if ("number" != typeof value || isNaN(value)) throw new TypeError("The value is not a numer");
            value < constraint.getMin() && this.context.addViolation(constraint.getMinMessage()), 
            value > constraint.getMax() && this.context.addViolation(constraint.getMaxMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Regex = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.pattern = options.pattern, 
    this.flags = options.flags, this.message = options.message || "The value do not match the wished pattern";
}, Sy.Validator.Constraint.Regex.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.RegexValidator";
        }
    },
    getPattern: {
        value: function() {
            return this.pattern;
        }
    },
    getFlags: {
        value: function() {
            return this.flags;
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.RegexValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.RegexValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Regex)) throw new TypeError("Invalid constraint");
            try {
                var regex = new RegExp(constraint.getPattern(), constraint.getFlags());
                regex.test(value) || this.context.addViolation(constraint.getMessage());
            } catch (e) {
                this.context.addViolation(constraint.getMessage());
            }
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.True = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.message = options.message || "The value must be true";
}, Sy.Validator.Constraint.True.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.TrueValidator";
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.TrueValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.TrueValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.True)) throw new TypeError("Invalid constraint");
            value !== !0 && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Type = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.type = options.type, 
    this.message = options.message || "The value differs from the specified type";
}, Sy.Validator.Constraint.Type.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.TypeValidator";
        }
    },
    getType: {
        value: function() {
            return this.type;
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.TypeValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.TypeValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Type)) throw new TypeError("Invalid constraint");
            var expected = constraint.getType(), constructor = objectGetter(expected) || function() {};
            typeof value === expected || value instanceof constructor || this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Undefined = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.message = options.message || "The value must be undefined";
}, Sy.Validator.Constraint.Undefined.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.UndefinedValidator";
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.UndefinedValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.UndefinedValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Undefined)) throw new TypeError("Invalid constraint");
            void 0 !== value && this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.Url = function(options) {
    options = options || {}, Sy.Validator.AbstractConstraint.call(this, options), this.protocols = options.protocols instanceof Array ? options.protocols : [ "http", "https" ], 
    this.message = options.message || "The value is not a valid url";
}, Sy.Validator.Constraint.Url.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {
    validatedBy: {
        value: function() {
            return "Sy.Validator.Constraint.UrlValidator";
        }
    },
    getProtocols: {
        value: function() {
            return this.protocols;
        }
    },
    getMessage: {
        value: function() {
            return this.message;
        }
    }
}), namespace("Sy.Validator.Constraint"), Sy.Validator.Constraint.UrlValidator = function() {
    Sy.Validator.AbstractConstraintValidator.call(this);
}, Sy.Validator.Constraint.UrlValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {
    validate: {
        value: function(value, constraint) {
            if (!(constraint instanceof Sy.Validator.Constraint.Url)) throw new TypeError("Invalid constraint");
            var protocols = constraint.getProtocols().join("|"), regex = new RegExp("^(" + protocols + ")://[a-z-_.]+(?:.[a-z]{2,})?.*$", "i");
            regex.test(value) || this.context.addViolation(constraint.getMessage());
        }
    }
}), namespace("Sy.Validator"), Sy.Validator.ConstraintFactory = function() {}, Sy.Validator.ConstraintFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {
    make: {
        value: function(name, options) {
            var constraint, constructor = Sy.Validator.Constraint[name];
            if (void 0 === constructor) throw new ReferenceError('The constraint "' + name + '" is undefined');
            if (constraint = new constructor(options), !(constraint instanceof Sy.Validator.ConstraintInterface)) throw new TypeError('"' + name + '" is not a valid constraint');
            return constraint;
        }
    }
}), namespace("Sy.Validator"), Sy.Validator.ConstraintValidatorFactory = function() {
    this.validators = {};
}, Sy.Validator.ConstraintValidatorFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {
    make: {
        value: function(constraint) {
            if (!(constraint instanceof Sy.Validator.ConstraintInterface)) throw new TypeError("Invalid constraint");
            var constructor, path = constraint.validatedBy();
            if (void 0 === this.validators[path]) {
                if (constructor = objectGetter(path), void 0 === constructor) throw new ReferenceError('Undefined validator "' + path + '"');
                this.validators[path] = new constructor();
            }
            return this.validators[path];
        }
    }
}), namespace("Sy.Validator"), Sy.Validator.ConstraintViolation = function(data) {
    this.message = data.message, this.path = data.path;
}, Sy.Validator.ConstraintViolation.prototype = Object.create(Object.prototype, {
    toString: {
        value: function() {
            return this.message;
        }
    },
    getPath: {
        value: function() {
            return this.path;
        }
    },
    toJSON: {
        value: function() {
            return {
                message: this.message,
                path: this.path
            };
        }
    }
}), namespace("Sy.Validator"), Sy.Validator.ConstraintViolationList = function() {
    this.violations = [], this.length = 0;
}, Sy.Validator.ConstraintViolationList.prototype = Object.create(Object.prototype, {
    addViolation: {
        value: function(message) {
            return this.violations.push(new Sy.Validator.ConstraintViolation({
                message: message
            })), this.length++, this;
        }
    },
    addViolationAt: {
        value: function(path, message) {
            return this.violations.push(new Sy.Validator.ConstraintViolation({
                message: message,
                path: path
            })), this.length++, this;
        }
    },
    forEach: {
        value: function(callback) {
            return this.violations.forEach(callback), this;
        }
    },
    getViolations: {
        value: function() {
            return this.violations;
        }
    },
    getViolationsAt: {
        value: function(path) {
            return this.violations.filter(function(violation) {
                return violation.getPath() === path;
            }.bind(this));
        }
    },
    toJSON: {
        value: function() {
            return this.violations.map(function(element) {
                return element.toJSON();
            });
        }
    }
}), namespace("Sy.Validator"), Sy.Validator.ExecutionContext = function() {
    this.constraintValidatorFactory = null, this.violations = null, this.path = null, 
    this.object = null;
}, Sy.Validator.ExecutionContext.prototype = Object.create(Object.prototype, {
    setConstraintValidatorFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.Validator.ConstraintValidatorFactory)) throw new TypeError("Invalid constraint validator factory");
            return this.constraintValidatorFactory = factory, this;
        }
    },
    setViolationList: {
        value: function(violations) {
            if (!(violations instanceof Sy.Validator.ConstraintViolationList)) throw new TypeError("Invalid constraint violation list");
            return this.violations = violations, this;
        }
    },
    getViolations: {
        value: function() {
            return this.violations;
        }
    },
    setPath: {
        value: function(path) {
            return this.path = path, this;
        }
    },
    setObject: {
        value: function(object) {
            return this.object = object, this;
        }
    },
    getObject: {
        value: function() {
            return this.object;
        }
    },
    addViolation: {
        value: function(message) {
            this.path ? this.violations.addViolationAt(this.path, message) : this.violations.addViolation(message);
        }
    },
    addViolationAt: {
        value: function(path, message) {
            this.violations.addViolationAt(path, message);
        }
    },
    validate: {
        value: function(value, constraint, groups) {
            var validator = this.constraintValidatorFactory.make(constraint);
            if (groups instanceof Array && groups.length > 0) {
                for (var i = 0, l = groups.length; l > i; i++) if (constraint.hasGroup(groups[i])) {
                    validator.setContext(this).validate(value, constraint);
                    break;
                }
            } else validator.setContext(this).validate(value, constraint);
        }
    }
}), namespace("Sy.Validator"), Sy.Validator.ExecutionContextFactory = function() {
    this.constraintValidatorFactory = null;
}, Sy.Validator.ExecutionContextFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {
    setConstraintValidatorFactory: {
        value: function(factory) {
            if (!(factory instanceof Sy.Validator.ConstraintValidatorFactory)) throw new TypeError("Invalid constraint validator factory");
            return this.constraintValidatorFactory = factory, this;
        }
    },
    make: {
        value: function() {
            var context = new Sy.Validator.ExecutionContext();
            return context.setConstraintValidatorFactory(this.constraintValidatorFactory).setViolationList(new Sy.Validator.ConstraintViolationList());
        }
    }
});
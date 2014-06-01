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
                constraint;

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

                    for (constraint in rules.properties[property]) {
                        if (rules.properties[property].hasOwnProperty(constraint)) {
                            context.validate(
                                object[property],
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

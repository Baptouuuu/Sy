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

            for (var i = 0, l = groups.length; i < l; i++) {
                if (constraint.hasGroup(groups[i])) {
                    validator
                        .setContext(this)
                        .validate(value, constraint);
                    break;
                }
            }

        }
    }

});

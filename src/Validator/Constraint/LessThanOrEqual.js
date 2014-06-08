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

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

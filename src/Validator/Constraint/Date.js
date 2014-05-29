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

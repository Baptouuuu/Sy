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

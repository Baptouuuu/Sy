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

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

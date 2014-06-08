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

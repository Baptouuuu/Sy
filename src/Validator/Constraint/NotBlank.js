namespace('Sy.Validator.Constraint');

/**
 * Contraint to check if a value is not an empty string nor is null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Contraint.NotBlank = function (options) {
    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'This value must not be blank';
};
Sy.Validator.Contraint.NotBlank.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.NotBlankValidator';
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

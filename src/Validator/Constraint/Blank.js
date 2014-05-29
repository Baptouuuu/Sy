namespace('Sy.Validator.Constraint');

/**
 * Contraint to check if a value is an empty string or is null
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Contraint.Blank = function (options) {
    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'This value must be blank';
};
Sy.Validator.Contraint.Blank.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.BlankValidator';
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

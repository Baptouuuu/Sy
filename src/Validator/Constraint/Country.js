namespace('Sy.Validator.Constraint');

/**
 * Check a value is a country code
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraint}
 */

Sy.Validator.Constraint.Country = function (options) {
    options = options || {};

    Sy.Validator.AbstractConstraint.call(this, options);

    this.message = options.message || 'This value is not a valid country';
};
Sy.Validator.Constraint.Country.prototype = Object.create(Sy.Validator.AbstractConstraint.prototype, {

    /**
     * @inheritDoc
     */

    validatedBy: {
        value: function () {
            return 'Sy.Validator.Constraint.CountryValidator';
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

})

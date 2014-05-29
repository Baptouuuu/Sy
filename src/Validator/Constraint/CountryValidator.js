namespace('Sy.Validator.Constraint');

/**
 * Country constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.CountryValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.CountryValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Country)) {
                throw new TypeError('Invalid constraint');
            }

            if (Intl.Collator.supportedLocalesOf(value).length === 0) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

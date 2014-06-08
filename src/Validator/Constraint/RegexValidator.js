namespace('Sy.Validator.Constraint');

/**
 * Regex constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.RegexValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.RegexValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Regex)) {
                throw new TypeError('Invalid constraint');
            }

            try {
                var regex = new RegExp(constraint.getPattern(), constraint.getFlags())

                if (!regex.test(value)) {
                    this.context.addViolation(constraint.getMessage());
                }
            } catch (e) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

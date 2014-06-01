namespace('Sy.Validator.Constraint');

/**
 * True constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.TrueValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.TrueValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.True)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== true) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

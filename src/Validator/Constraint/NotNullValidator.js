namespace('Sy.Validator.Constraint');

/**
 * NotNull constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotNullValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotNullValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotNull)) {
                throw new TypeError('Invalid constraint');
            }

            if (value === null) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

namespace('Sy.Validator.Constraint');

/**
 * LessThanOrEqual constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.LessThanOrEqualValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.LessThanOrEqualValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.LessThanOrEqual)) {
                throw new TypeError('Invalid constraint');
            }

            if (value > constraint.getValue()) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

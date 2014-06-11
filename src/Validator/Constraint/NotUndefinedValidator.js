namespace('Sy.Validator.Constraint');

/**
 * NotUndefined constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.NotUndefinedValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.NotUndefinedValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.NotUndefined)) {
                throw new TypeError('Invalid constraint');
            }

            if (value === undefined) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

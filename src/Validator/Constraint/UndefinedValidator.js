namespace('Sy.Validator.Constraint');

/**
 * Undefined constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.UndefinedValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.UndefinedValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Undefined)) {
                throw new TypeError('Invalid constraint');
            }

            if (value !== undefined) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

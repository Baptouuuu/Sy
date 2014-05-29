namespace('Sy.Validator.Constraint');

/**
 * Blank constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.BlankValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.BlankValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Blank)) {
                throw new TypeError('Invalid constraint');
            }

            if (
                (typeof value === 'string' && value.length === 0) ||
                value === null
            ) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

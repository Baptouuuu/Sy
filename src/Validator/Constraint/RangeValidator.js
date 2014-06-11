namespace('Sy.Validator.Constraint');

/**
 * Range constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.RangeValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.RangeValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Range)) {
                throw new TypeError('Invalid constraint');
            }

            if (typeof value !== 'number' || isNaN(value)) {
                throw new TypeError('The value is not a numer');
            }

            if (value < constraint.getMin()) {
                this.context.addViolation(constraint.getMinMessage());
            }

            if (value > constraint.getMax()) {
                this.context.addViolation(constraint.getMaxMessage());
            }

        }
    }

});

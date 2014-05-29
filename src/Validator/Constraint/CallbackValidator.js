namespace('Sy.Validator.Constraint');

/**
 * Callback constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.CallbackValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.CallbackValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Callback)) {
                throw new TypeError('Invalid constraint');
            }

            var callback = constraint.getCallback();

            this.context.getObject()[callback](this.context);

        }
    }

});

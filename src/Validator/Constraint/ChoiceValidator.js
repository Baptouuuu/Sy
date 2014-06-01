namespace('Sy.Validator.Constraint');

/**
 * Choice constraint validator
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @extends {Sy.Validator.AbstractConstraintValidator}
 */

Sy.Validator.Constraint.ChoiceValidator = function () {
    Sy.Validator.AbstractConstraintValidator.call(this);
};
Sy.Validator.Constraint.ChoiceValidator.prototype = Object.create(Sy.Validator.AbstractConstraintValidator.prototype, {

    /**
     * @inheritDoc
     */

    validate: {
        value: function (value, constraint) {

            if (!(constraint instanceof Sy.Validator.Constraint.Choice)) {
                throw new TypeError('Invalid constraint');
            }

            if (constraint.isMultiple() && !(value instanceof Array)) {
                throw new TypeError('Array expected');
            }

            var choices;

            if (constraint.hasCallback()) {
                var callback = constraint.getCallback();

                choices = this.context.getObject()[callback]();
            } else {
                choices = constraint.getChoices();
            }

            if (constraint.isMultiple()) {
                for (var i = 0, l = value.length; i < l; i++) {
                    if (choices.indexOf(value[i]) === -1) {
                        this.context.addViolation(constraint.getMultipleMessage());
                    }
                }

                if (constraint.hasMin() && choices.length < constraint.getMin()) {
                    this.context.addViolation(constraint.getMinMessage());
                }

                if (constraint.hasMax() && choices.length > constraint.getMax()) {
                    this.context.addViolation(constraint.getMaxMessage());
                }
            } else if (choices.indexOf(value) === -1) {
                this.context.addViolation(constraint.getMessage());
            }

        }
    }

});

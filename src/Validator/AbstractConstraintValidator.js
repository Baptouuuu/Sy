namespace('Sy.Validator');

/**
 * Abstract constraint validator that implements context setter
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.Validator.ConstraintValidatorInterface}
 */

Sy.Validator.AbstractConstraintValidator = function () {
    this.context = null;
};
Sy.Validator.AbstractConstraintValidator.prototype = Object.create(Sy.Validator.ConstraintValidatorInterface.prototype, {

    /**
     * @inheritDoc
     */

    setContext: {
        value: function (context) {
            this.context = context;

            return this;
        }
    }

});

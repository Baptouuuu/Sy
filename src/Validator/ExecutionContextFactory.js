namespace('Sy.Validator');

/**
 * Generates new validation execution contexts
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Validator.ExecutionContextFactory = function () {
    this.constraintValidatorFactory = null;
};
Sy.Validator.ExecutionContextFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * Set the constraint validator factory
     *
     * @param {Sy.Validator.ConstraintValidatorFactory} factory
     *
     * @return {Sy.Validator.ExecutionContextFactory} self
     */

    setConstraintValidatorFactory: {
        value: function (factory) {
            if (!(factory instanceof Sy.Validator.ConstraintValidatorFactory)) {
                throw new TypeError('Invalid constraint validator factory');
            }

            this.constraintValidatorFactory = factory;

            return this;
        }
    },

    /**
     * @inheritDoc
     */

    make: {
        value: function () {
            var context = new Sy.Validator.ExecutionContext();

            return context
                .setConstraintValidatorFactory(this.constraintValidatorFactory)
                .setViolationList(new Sy.Validator.ConstraintViolationList());
        }
    }

});

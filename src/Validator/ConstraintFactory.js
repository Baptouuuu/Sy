namespace('Sy.Validator');

/**
 * Build an instance of the specified constraint
 *
 * @package Sy
 * @subpackage Validator
 * @class
 * @implements {Sy.FactoryInterface}
 */

Sy.Validator.ConstraintFactory = function () {};
Sy.Validator.ConstraintFactory.prototype = Object.create(Sy.FactoryInterface.prototype, {

    /**
     * @inheritDoc
     */

    make: {
        value: function (name, options) {

            var constructor = Sy.Validator.Constraint[name],
                constraint;

            if (constructor === undefined) {
                throw new ReferenceError('The constraint "' + name + '" is undefined');
            }

            constraint = new constructor(options);

            if (!(constraint instanceof Sy.Validator.ConstraintInterface)) {
                throw new TypeError('"' + name + '" is not a valid constraint');
            }

            return constraint;

        }
    }

});

/**
 * @venus-library jasmine
 * @venus-include ../../vendor/Reflection.js/reflection.js
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/PropertyAccessor.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/Validator/ConstraintInterface.js
 * @venus-include ../../src/Validator/AbstractConstraint.js
 * @venus-include ../../src/Validator/AbstractConstraintValidator.js
 * @venus-include ../../src/Validator/Constraint/Blank.js
 * @venus-include ../../src/Validator/Constraint/BlankValidator.js
 * @venus-code ../../src/Validator/ConstraintValidatorFactory.js
 */

describe('constraint validator factory', function () {

    var factory = new Sy.Validator.ConstraintValidatorFactory(),
        MockConstraint = function () {};

    MockConstraint.prototype = Object.create(Sy.Validator.ConstraintInterface.prototype, {
        validatedBy: {
            value: function () {
                return 'foo';
            }
        }
    });

    it('should throw if invalid constraint', function () {
        expect(function () {
            factory.make({});
        }).toThrow('Invalid constraint');
    });

    it('should throw if undefined validator', function () {
        expect(function () {
            factory.make(new MockConstraint());
        }).toThrow('Undefined validator "foo"');
    });

    it('should build a validator', function () {
        var validator = factory.make(new Sy.Validator.Constraint.Blank({}));

        expect(validator instanceof Sy.Validator.Constraint.BlankValidator).toBe(true);
    });

});

/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/ConstraintValidatorInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-include ../../../src/Validator/AbstractConstraintValidator.js
 * @venus-include ../../../src/Validator/Constraint/Type.js
 * @venus-include ../../../src/Validator/ExecutionContext.js
 * @venus-include ../../../src/Validator/ConstraintViolation.js
 * @venus-include ../../../src/Validator/ConstraintViolationList.js
 * @venus-code ../../../src/Validator/Constraint/TypeValidator.js
 */

describe('Type constraint validator', function () {

    var validator,
        context,
        violations;

    window.foo = function () {};

    beforeEach(function () {
        validator = new Sy.Validator.Constraint.TypeValidator();
        context = new Sy.Validator.ExecutionContext();
        violations = new Sy.Validator.ConstraintViolationList();

        context.setViolationList(violations);
        validator.setContext(context);
    });

    it('should throw if invalid constraint', function () {
        expect(function () {
            validator.validate('', {});
        }).toThrow('Invalid constraint');
    });

    it('should not set a violation', function () {
        var c = new Sy.Validator.Constraint.Type({
            type: 'number'
        });

        validator.validate(1, c);

        expect(violations.length).toEqual(0);
    });

    it('should not set a violation when checking instance', function () {
        var c = new Sy.Validator.Constraint.Type({
            type: 'foo'
        });

        validator.validate(new foo(), c);

        expect(violations.length).toEqual(0);
    });

    it('should set a violation', function () {
        var c = new Sy.Validator.Constraint.Type({
            type: 'bar'
        });

        validator.validate(new foo(), c);

        expect(violations.length).toEqual(1);
    });

});

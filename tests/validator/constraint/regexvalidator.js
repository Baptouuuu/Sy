/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/ConstraintValidatorInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-include ../../../src/Validator/AbstractConstraintValidator.js
 * @venus-include ../../../src/Validator/Constraint/Regex.js
 * @venus-include ../../../src/Validator/ExecutionContext.js
 * @venus-include ../../../src/Validator/ConstraintViolation.js
 * @venus-include ../../../src/Validator/ConstraintViolationList.js
 * @venus-code ../../../src/Validator/Constraint/RegexValidator.js
 */

describe('Regex constraint validator', function () {

    var validator,
        context,
        violations;

    beforeEach(function () {
        validator = new Sy.Validator.Constraint.RegexValidator();
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
        var c = new Sy.Validator.Constraint.Regex({
            pattern: '^[a-z]?$'
        });

        validator.validate('', c);
        validator.validate('f', c);

        expect(violations.length).toEqual(0);
    });

    it('should set a violation', function () {
        var c = new Sy.Validator.Constraint.Regex({
            pattern: '^bar$'
        });

        validator.validate('foo', c);

        expect(violations.length).toEqual(1);
    });

    it('should set a violation if invalid flags', function () {
        var c = new Sy.Validator.Constraint.Regex({
            pattern: '.*',
            flags: 'foo'
        });

        validator.validate('foo', c);

        expect(violations.length).toEqual(1);
    });

});

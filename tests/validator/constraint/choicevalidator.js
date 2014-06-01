/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/ConstraintValidatorInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-include ../../../src/Validator/AbstractConstraintValidator.js
 * @venus-include ../../../src/Validator/Constraint/Choice.js
 * @venus-include ../../../src/Validator/ExecutionContext.js
 * @venus-include ../../../src/Validator/ConstraintViolation.js
 * @venus-include ../../../src/Validator/ConstraintViolationList.js
 * @venus-code ../../../src/Validator/Constraint/ChoiceValidator.js
 */

describe('choice constraint validator', function () {

    var validator,
        context,
        violations;

    beforeEach(function () {
        validator = new Sy.Validator.Constraint.ChoiceValidator();
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
        var c = new Sy.Validator.Constraint.Choice({
            choices: [1, 2, 3]
        });

        validator.validate(1, c);

        expect(violations.length).toEqual(0);
    });

    it('should not set a violation for multiple choices', function () {
        var c = new Sy.Validator.Constraint.Choice({
            choices: [1, 2, 3],
            multiple: true
        });

        validator.validate([1, 2], c);

        expect(violations.length).toEqual(0);
    });

    it('should not set a violation for min choices', function () {
        var c = new Sy.Validator.Constraint.Choice({
            choices: [1, 2, 3],
            multiple: true,
            min: 2
        });

        validator.validate([1, 2], c);

        expect(violations.length).toEqual(0);
    });

    it('should not set a violation for max choices', function () {
        var c = new Sy.Validator.Constraint.Choice({
            choices: [1, 2, 3],
            multiple: true,
            max: 2
        });

        validator.validate([1, 2], c);

        expect(violations.length).toEqual(0);
    });

    it('should set a violation', function () {
        var c = new Sy.Validator.Constraint.Choice({
            choices: [1, 2, 3]
        });

        validator.validate(4, c);

        expect(violations.length).toEqual(1);
    });

});

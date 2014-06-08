/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/ConstraintValidatorInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-include ../../../src/Validator/AbstractConstraintValidator.js
 * @venus-include ../../../src/Validator/Constraint/Ip.js
 * @venus-include ../../../src/Validator/ExecutionContext.js
 * @venus-include ../../../src/Validator/ConstraintViolation.js
 * @venus-include ../../../src/Validator/ConstraintViolationList.js
 * @venus-code ../../../src/Validator/Constraint/IpValidator.js
 */

describe('Ip constraint validator', function () {

    var validator,
        context,
        violations;

    beforeEach(function () {
        validator = new Sy.Validator.Constraint.IpValidator();
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
        var c = new Sy.Validator.Constraint.Ip({});

        validator.validate('0.0.0.0', c);
        validator.validate('255.255.255.255', c);

        expect(violations.length).toEqual(0);
    });

    it('should not set a violation with port', function () {
        var c = new Sy.Validator.Constraint.Ip({
            port: true
        });

        validator.validate('0.0.0.0:80', c);

        expect(violations.length).toEqual(0);
    });

    it('should not set a violation with mask', function () {
        var c = new Sy.Validator.Constraint.Ip({
            mask: true
        });

        validator.validate('0.0.0.0/32', c);

        expect(violations.length).toEqual(0);
    });

    it('should not set a violation with port and mask', function () {
        var c = new Sy.Validator.Constraint.Ip({
            mask: true,
            port: true
        });

        validator.validate('127.0.0.1:80/32', c);

        expect(violations.length).toEqual(0);
    });

    it('should set a violation', function () {
        var c = new Sy.Validator.Constraint.Ip({});

        validator.validate('0.0.0.', c);

        expect(violations.length).toEqual(1);
    });

    it('should set a violation with port', function () {
        var c = new Sy.Validator.Constraint.Ip({
            port: true
        });

        validator.validate('0.0.0.0:1234567', c);

        expect(violations.length).toEqual(1);
    });

    it('should set a violation with mask', function () {
        var c = new Sy.Validator.Constraint.Ip({
            mask: true
        });

        validator.validate('0.0.0.0/33', c);

        expect(violations.length).toEqual(1);
    });

    it('should set a violation with port and mask', function () {
        var c = new Sy.Validator.Constraint.Ip({
            mask: true
        });

        validator.validate('0.0.0.0:1234567/33', c);

        expect(violations.length).toEqual(1);
    });

});

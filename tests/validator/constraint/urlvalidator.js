/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/ConstraintValidatorInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-include ../../../src/Validator/AbstractConstraintValidator.js
 * @venus-include ../../../src/Validator/Constraint/Url.js
 * @venus-include ../../../src/Validator/ExecutionContext.js
 * @venus-include ../../../src/Validator/ConstraintViolation.js
 * @venus-include ../../../src/Validator/ConstraintViolationList.js
 * @venus-code ../../../src/Validator/Constraint/UrlValidator.js
 */

describe('Url constraint validator', function () {

    var validator,
        context,
        violations;

    beforeEach(function () {
        validator = new Sy.Validator.Constraint.UrlValidator();
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
        var c = new Sy.Validator.Constraint.Url({
            protocols: ['http', 'ftp']
        });

        validator.validate('http://foo', c);
        validator.validate('http://foo.tld/bar/baz?query=foo#!hashbang', c);
        validator.validate('ftp://somedomain.tld/absolute/path.img', c);

        expect(violations.length).toEqual(0);
    });

    it('should set a violation', function () {
        var c = new Sy.Validator.Constraint.Url({});

        validator.validate('foo', c);

        expect(violations.length).toEqual(1);
    });

    it('should not set a violation if empty value', function () {
        var c = new Sy.Validator.Constraint.Url({});

        validator.validate('', c);
        validator.validate(null, c);
        validator.validate(undefined, c);

        expect(violations.length).toEqual(0);
    });

});

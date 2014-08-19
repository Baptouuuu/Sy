/**
 * @venus-library jasmine
 * @venus-include ../../vendor/Reflection.js/reflection.js
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/PropertyAccessor.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/Validator/ConstraintValidatorFactory.js
 * @venus-include ../../src/Validator/ConstraintViolation.js
 * @venus-include ../../src/Validator/ConstraintViolationList.js
 * @venus-include ../../src/Validator/ConstraintInterface.js
 * @venus-include ../../src/Validator/ConstraintValidatorInterface.js
 * @venus-include ../../src/Validator/AbstractConstraint.js
 * @venus-include ../../src/Validator/AbstractConstraintValidator.js
 * @venus-include ../../src/Validator/Constraint/Blank.js
 * @venus-include ../../src/Validator/Constraint/BlankValidator.js
 * @venus-code ../../src/Validator/ExecutionContext.js
 */

describe('validator execution context', function () {

    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    var c = new Sy.Validator.ExecutionContext();

    beforeEach(function () {
        if (c.violations) {
            c.violations.violations = [];
            c.violations.length = 0;
        }
    });

    it('should throw if trying to set invalid constraint validator factory', function () {
        expect(function () {
            c.setConstraintValidatorFactory({});
        }).toThrow('Invalid constraint validator factory');
    });

    it('should set the constraint validator factory', function () {
        expect(c.setConstraintValidatorFactory(new Sy.Validator.ConstraintValidatorFactory())).toEqual(c);
    });

    it('should throw if trying to set invalid constraint violation list', function () {
        expect(function () {
            c.setViolationList({});
        }).toThrow('Invalid constraint violation list');
    });

    it('should set the constraint violation list', function () {
        expect(c.setViolationList(new Sy.Validator.ConstraintViolationList())).toEqual(c);
    });

    it('should return the violation list', function () {
        expect(c.getViolations() instanceof Sy.Validator.ConstraintViolationList).toBe(true);
    });

    it('should set the path being validated', function () {
        expect(c.setPath('foo')).toEqual(c);

        c.path = null;
    });

    it('should set the object being validated', function () {
        expect(c.setObject({})).toEqual(c);
        expect(c.getObject()).toEqual({});

        c.object = null;
    });

    it('should add a violation without a path', function () {
        c.addViolation('foo');

        expect(c.getViolations().length).toEqual(1);
        expect(c.getViolations().toJSON()[0]).toEqual({message: 'foo'});
    });

    it('should add a violation with the specified path', function () {
        c.addViolationAt('bar', 'baz');

        expect(c.getViolations().getViolationsAt('bar').length).toEqual(1);
        expect(c.getViolations().getViolationsAt('bar')[0].toJSON()).toEqual({message: 'baz', path: 'bar'});
    });

    it('should add a violation at the path specified in the execution context', function () {
        c.setPath('foobar');
        c.addViolation('foo');

        expect(c.getViolations().getViolationsAt('foobar').length).toEqual(1);

        c.path = null;
    });

    it('should validate the value', function () {
        var constraint = new Sy.Validator.Constraint.Blank();

        c.validate('', constraint);

        expect(c.getViolations().length).toEqual(0);

        c.validate('foo', constraint);

        expect(c.getViolations().length).toEqual(1);
    });

    it('should not add a violation if not in validation groups', function () {
        var constraint = new Sy.Validator.Constraint.Blank({
            groups: ['foo']
        });

        c.validate('foo', constraint, ['bar']);

        expect(c.getViolations().length).toEqual(0);
    });

    it('should add a violation if in validation groups', function () {
        var constraint = new Sy.Validator.Constraint.Blank({
            groups: ['foo']
        });

        c.validate('foo', constraint, ['foo']);

        expect(c.getViolations().length).toEqual(1);
    });

});

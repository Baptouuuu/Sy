/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Length.js
 */

describe('Length constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Length();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.LengthValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.Length({min: 1});

        expect(c.getMinMessage()).toEqual('The value is too short');
        expect(c.getMaxMessage()).toEqual('The value is too long');
        expect(c.getExactMessage()).toEqual('The value must be 1 long');

        c = new Sy.Validator.Constraint.Length({
            minMessage: 'foo',
            maxMessage: 'bar',
            exactMessage: 'baz',
        });

        expect(c.getMinMessage()).toEqual('foo');
        expect(c.getMaxMessage()).toEqual('bar');
        expect(c.getExactMessage()).toEqual('baz');
    });

    it('should return the minimum length', function () {
        var c = new Sy.Validator.Constraint.Length({min: 1});

        expect(c.getMin()).toEqual(1);
    });

    it('should return the maximum length', function () {
        var c = new Sy.Validator.Constraint.Length({max: 1});

        expect(c.getMax()).toEqual(1);
    });

});

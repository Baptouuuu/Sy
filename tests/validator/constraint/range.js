/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Range.js
 */

describe('Range constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Range();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.RangeValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.Range();

        expect(c.getMinMessage()).toEqual('The value is below the lower bound');
        expect(c.getMaxMessage()).toEqual('The value is above the upper bound');

        c = new Sy.Validator.Constraint.Range({
            minMessage: 'foo',
            maxMessage: 'bar'
        });

        expect(c.getMinMessage()).toEqual('foo');
        expect(c.getMaxMessage()).toEqual('bar');
    });

    it('should return the lower bound', function () {
        var c = new Sy.Validator.Constraint.Range({min: 1});

        expect(c.getMin()).toEqual(1);
    });

    it('should return the upper bound', function () {
        var c = new Sy.Validator.Constraint.Range({max: 1});

        expect(c.getMax()).toEqual(1);
    });

});

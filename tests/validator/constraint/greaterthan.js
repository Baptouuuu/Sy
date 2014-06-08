/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/GreaterThan.js
 */

describe('GreaterThan constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.GreaterThan();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.GreaterThanValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.GreaterThan({value: 'foo'});

        expect(c.getMessage()).toEqual('The value must be greater than "foo"');

        c = new Sy.Validator.Constraint.GreaterThan({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

    it('should return the minimum value', function () {
        var c = new Sy.Validator.Constraint.GreaterThan({value: 1});

        expect(c.getValue()).toEqual(1);
    });

});

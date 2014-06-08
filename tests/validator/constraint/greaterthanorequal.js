/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/GreaterThanOrEqual.js
 */

describe('GreaterThanOrEqual constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.GreaterThanOrEqual();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.GreaterThanOrEqualValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.GreaterThanOrEqual({value: 'foo'});

        expect(c.getMessage()).toEqual('The value must be greater than or equal to "foo"');

        c = new Sy.Validator.Constraint.GreaterThanOrEqual({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

    it('should return the minimum value', function () {
        var c = new Sy.Validator.Constraint.GreaterThanOrEqual({value: 1});

        expect(c.getValue()).toEqual(1);
    });

});

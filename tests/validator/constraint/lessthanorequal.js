/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/LessThanOrEqual.js
 */

describe('LessThanOrEqual constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.LessThanOrEqual();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.LessThanOrEqualValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.LessThanOrEqual({value: 'foo'});

        expect(c.getMessage()).toEqual('The value must be less than or equal to "foo"');

        c = new Sy.Validator.Constraint.LessThanOrEqual({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

    it('should return the maximum value', function () {
        var c = new Sy.Validator.Constraint.LessThanOrEqual({value: 3});

        expect(c.getValue()).toEqual(3);
    });

});

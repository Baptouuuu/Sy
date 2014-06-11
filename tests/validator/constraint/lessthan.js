/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/LessThan.js
 */

describe('LessThan constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.LessThan();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.LessThanValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.LessThan({value: 'foo'});

        expect(c.getMessage()).toEqual('The value must be less than "foo"');

        c = new Sy.Validator.Constraint.LessThan({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

    it('should return the maximum value', function () {
        var c = new Sy.Validator.Constraint.LessThan({value: 3});

        expect(c.getValue()).toEqual(3);
    });

});

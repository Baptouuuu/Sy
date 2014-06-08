/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/NotUndefined.js
 */

describe('NotUndefined constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.NotUndefined();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.NotUndefinedValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.NotUndefined();

        expect(c.getMessage()).toEqual('The value must not be undefined');

        c = new Sy.Validator.Constraint.NotUndefined({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

});

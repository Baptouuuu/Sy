/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/False.js
 */

describe('False constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.False();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.FalseValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.False();

        expect(c.getMessage()).toEqual('The value must be false');

        c = new Sy.Validator.Constraint.False({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

});

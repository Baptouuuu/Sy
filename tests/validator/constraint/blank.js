/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Blank.js
 */

describe('Blank constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Blank();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.BlankValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.Blank();

        expect(c.getMessage()).toEqual('This value must be blank');

        c = new Sy.Validator.Constraint.Blank({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

});

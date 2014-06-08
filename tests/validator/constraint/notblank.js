/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/NotBlank.js
 */

describe('NotBlank constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.NotBlank();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.NotBlankValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.NotBlank();

        expect(c.getMessage()).toEqual('This value must not be blank');

        c = new Sy.Validator.Constraint.NotBlank({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

});

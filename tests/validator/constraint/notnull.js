/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/NotNull.js
 */

describe('NotNull constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.NotNull();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.NotNullValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.NotNull();

        expect(c.getMessage()).toEqual('The value must not be null');

        c = new Sy.Validator.Constraint.NotNull({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

});

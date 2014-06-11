/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/NotEqualTo.js
 */

describe('NotEqualTo constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.NotEqualTo();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.NotEqualToValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.NotEqualTo({value: 'foo'});

        expect(c.getMessage()).toEqual('The value must not be equal to foo');

        c = new Sy.Validator.Constraint.NotEqualTo({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

    it('should return the wished value', function () {
        var c = new Sy.Validator.Constraint.NotEqualTo({value: 'foo'});

        expect(c.getValue()).toEqual('foo');
    });

});

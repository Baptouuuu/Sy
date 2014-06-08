/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Date.js
 */

describe('Date constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Date();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.DateValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.Date();

        expect(c.getMessage()).toEqual('The value is not a valid date');

        c = new Sy.Validator.Constraint.Date({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

});

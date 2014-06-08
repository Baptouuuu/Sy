/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Email.js
 */

describe('Email constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Email();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.EmailValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.Email();

        expect(c.getMessage()).toEqual('The value is not a valid email');

        c = new Sy.Validator.Constraint.Email({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

});

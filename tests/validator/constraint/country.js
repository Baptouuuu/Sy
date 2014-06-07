/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Country.js
 */

describe('Country constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Country();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.CountryValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.Country();

        expect(c.getMessage()).toEqual('This value is not a valid country');

        c = new Sy.Validator.Constraint.Country({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

});

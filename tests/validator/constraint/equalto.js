/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/EqualTo.js
 */

describe('EqualTo constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.EqualTo();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.EqualToValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.EqualTo({value: 'foo'});

        expect(c.getMessage()).toEqual('The value should be equal to foo');

        c = new Sy.Validator.Constraint.EqualTo({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

    it('should return the wished value', function () {
        var c = new Sy.Validator.Constraint.EqualTo({value: 'foo'});

        expect(c.getValue()).toEqual('foo');
    });

});

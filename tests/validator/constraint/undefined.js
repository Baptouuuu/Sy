/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Undefined.js
 */

describe('Undefined constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Undefined();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.UndefinedValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.Undefined();

        expect(c.getMessage()).toEqual('The value must be undefined');

        c = new Sy.Validator.Constraint.Undefined({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

});

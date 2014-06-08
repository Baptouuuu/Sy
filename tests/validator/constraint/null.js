/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Null.js
 */

describe('Null constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Null();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.NullValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.Null();

        expect(c.getMessage()).toEqual('The value must be null');

        c = new Sy.Validator.Constraint.Null({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

});

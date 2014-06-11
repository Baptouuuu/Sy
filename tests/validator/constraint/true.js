/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/True.js
 */

describe('True constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.True();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.TrueValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.True();

        expect(c.getMessage()).toEqual('The value must be true');

        c = new Sy.Validator.Constraint.True({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

});

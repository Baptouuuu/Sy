/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Type.js
 */

describe('Type constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Type();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.TypeValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.Type();

        expect(c.getMessage()).toEqual('The value differs from the specified type');

        c = new Sy.Validator.Constraint.Type({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

    it('should return the wished type', function () {
        var c = new Sy.Validator.Constraint.Type({type: 'foo'});

        expect(c.getType()).toEqual('foo');
    });

});

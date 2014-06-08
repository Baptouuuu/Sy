/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Regex.js
 */

describe('Regex constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Regex();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.RegexValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.Regex();

        expect(c.getMessage()).toEqual('The value do not match the wished pattern');

        c = new Sy.Validator.Constraint.Regex({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

    it('should return the regexp pattern', function () {
        var c = new Sy.Validator.Constraint.Regex({pattern: 'foo'});

        expect(c.getPattern()).toEqual('foo');
    });

    it('should return the regexp flags', function () {
        var c = new Sy.Validator.Constraint.Regex({flags: 'foo'});

        expect(c.getFlags()).toEqual('foo');
    });

});

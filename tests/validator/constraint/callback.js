/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Callback.js
 */

describe('Callback constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Callback({callback: 'foo'});

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.CallbackValidator');
    });

    it('should return the callback path', function () {
        var c = new Sy.Validator.Constraint.Callback({callback: 'foo'});

        expect(c.getCallback()).toEqual('foo');
    });

    it('should throw if no callback specified', function () {
        expect(function () {
            new Sy.Validator.Constraint.Callback();
        }).toThrow('Undefined constraint callback');
    });

});

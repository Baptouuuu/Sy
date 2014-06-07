/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Ip.js
 */

describe('Ip constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Ip();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.IpValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.Ip();

        expect(c.getMessage()).toEqual('The value is not a valid IP address');

        c = new Sy.Validator.Constraint.Ip({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

    it('should say if the ip must have a port specified or not', function () {
        var c = new Sy.Validator.Constraint.Ip({port: true});

        expect(c.hasPort()).toBe(true);

        c = new Sy.Validator.Constraint.Ip();

        expect(c.hasPort()).toBe(false);
    });

    it('should say if the ip must have a mask specified or not', function () {
        var c = new Sy.Validator.Constraint.Ip({mask: true});

        expect(c.hasMask()).toBe(true);

        c = new Sy.Validator.Constraint.Ip();

        expect(c.hasMask()).toBe(false);
    });

});

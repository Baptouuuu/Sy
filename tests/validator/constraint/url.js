/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/Validator/ConstraintInterface.js
 * @venus-include ../../../src/Validator/AbstractConstraint.js
 * @venus-code ../../../src/Validator/Constraint/Url.js
 */

describe('Url constraint', function () {

    it('should return the validator path', function () {
        var c = new Sy.Validator.Constraint.Url();

        expect(c.validatedBy()).toEqual('Sy.Validator.Constraint.UrlValidator');
    });

    it('should return the error message', function () {
        var c = new Sy.Validator.Constraint.Url();

        expect(c.getMessage()).toEqual('The value is not a valid url');

        c = new Sy.Validator.Constraint.Url({message: 'foo'});

        expect(c.getMessage()).toEqual('foo');
    });

    it('should return the protocols', function () {
        var c = new Sy.Validator.Constraint.Url({protocols: ['ftp']});

        expect(c.getProtocols()).toEqual(['ftp']);

        c = new Sy.Validator.Constraint.Url();

        expect(c.getProtocols()).toEqual(['http', 'https']);
    });

});

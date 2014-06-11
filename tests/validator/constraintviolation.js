/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-code ../../src/Validator/ConstraintViolation.js
 */

describe('validator constraint violation', function () {

    it('should return the message', function () {
        var v = new Sy.Validator.ConstraintViolation({
            message: 'foo'
        });

        expect(v.toString()).toEqual('foo');
    });

    it('should return the path in the object where the message apply', function () {
        var v = new Sy.Validator.ConstraintViolation({
            path: 'foo'
        });

        expect(v.getPath()).toEqual('foo');
    });

    it('should return a POJO of the violation', function () {
        var v = new Sy.Validator.ConstraintViolation({
            message: 'foo',
            path: 'foo'
        });

        expect(v.toJSON()).toEqual({
            message: 'foo',
            path: 'foo'
        })
    });

});

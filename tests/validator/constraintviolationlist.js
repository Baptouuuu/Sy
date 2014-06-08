/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/Validator/ConstraintViolation.js
 * @venus-code ../../src/Validator/ConstraintViolationList.js
 */

describe('validator constraint violation list', function () {

    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    var list;

    beforeEach(function () {
        list = new Sy.Validator.ConstraintViolationList();
    });

    it('should add a new violation without a path', function () {
        list.addViolation('foo');

        expect(list.length).toEqual(1);
        expect(list.violations[0] instanceof Sy.Validator.ConstraintViolation).toBe(true);
        expect(list.violations[0].toString()).toEqual('foo');
    });

    it('should add a new violation at the specified path', function () {
        list.addViolationAt('foo', 'foo');

        expect(list.length).toEqual(1);
        expect(list.violations[0] instanceof Sy.Validator.ConstraintViolation).toBe(true);
        expect(list.violations[0].toJSON()).toEqual({message: 'foo', path: 'foo'});
    });

    it('should apply a callback on each violation', function () {
        var data = [];

        list.addViolation('foo');

        list.forEach(function (v) {
            data.push(v.toString());
        });

        expect(data.length).toEqual(1);
        expect(data).toEqual(['foo']);
    });

    it('should return the array of violations', function () {
        list.addViolation('foo');

        var violations = list.getViolations();

        expect(violations instanceof Array).toBe(true);
        expect(violations.length).toEqual(1);
        expect(violations[0] instanceof Sy.Validator.ConstraintViolation).toBe(true);
        expect(violations[0].toString()).toEqual('foo');
    });

    it('should return an array of violations for the specified path', function () {
        list.addViolation('foo');
        list.addViolationAt('bar', 'baz');

        var violations = list.getViolationsAt('bar');

        expect(violations instanceof Array).toBe(true);
        expect(violations.length).toEqual(1);
        expect(violations[0] instanceof Sy.Validator.ConstraintViolation).toBe(true);
        expect(violations[0].toString()).toEqual('baz');
    });

    it('should return an array of POJO violations', function () {
        list.addViolation('foo');
        list.addViolationAt('bar', 'baz');

        var violations = list.toJSON();

        expect(violations instanceof Array).toBe(true);
        expect(violations.length).toEqual(2);
        expect(violations).toEqual([
            {message: 'foo'},
            {message: 'baz', path: 'bar'}
        ]);
    });

});

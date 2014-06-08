/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/Validator/ConstraintInterface.js
 * @venus-include ../../src/Validator/AbstractConstraint.js
 * @venus-include ../../src/Validator/Constraint/Blank.js
 * @venus-code ../../src/Validator/ConstraintFactory.js
 */

describe('constraint factory', function () {

    var factory = new Sy.Validator.ConstraintFactory();

    it('should throw a reference error', function () {
        expect(function () {
            factory.make('foo');
        }).toThrow('The constraint "foo" is undefined');
    });

    it('should throw if constraint does not implement constraint interface', function () {
        Sy.Validator.Constraint.Foo = function () {};

        expect(function () {
            factory.make('Foo');
        }).toThrow('"Foo" is not a valid constraint');
    });

    it('should return a valid constraint', function () {
        var c = factory.make('Blank', {message: 'foo'});

        expect(c instanceof Sy.Validator.Constraint.Blank).toBe(true);
        expect(c.getMessage()).toEqual('foo');
    });

});

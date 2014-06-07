/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/Validator/ConstraintValidatorFactory.js
 * @venus-include ../../src/Validator/ConstraintViolationList.js
 * @venus-include ../../src/Validator/ExecutionContext.js
 * @venus-code ../../src/Validator/ExecutionContextFactory.js
 */

describe('validator execution context factory', function () {

    var factory = new Sy.Validator.ExecutionContextFactory();

    it('should throw if trying to set invalid constraint validator factory', function () {
        expect(function () {
            factory.setConstraintValidatorFactory({});
        }).toThrow('Invalid constraint validator factory');
    });

    it('should set the constraint validator factory', function () {
        expect(factory.setConstraintValidatorFactory(new Sy.Validator.ConstraintValidatorFactory())).toEqual(factory);
    });

    it('should create new instance of execution context each time `make` is called', function () {
        var e1 = factory.make(),
            e2 = factory.make();

        expect(e1 instanceof Sy.Validator.ExecutionContext).toBe(true);
        expect(e2 instanceof Sy.Validator.ExecutionContext).toBe(true);
        expect(e1 === e2).toBe(false);
    });

});

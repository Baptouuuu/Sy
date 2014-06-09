/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/ConfiguratorInterface.js
 * @venus-include ../../src/Validator/Core.js
 * @venus-include ../../src/Form/FormInterface.js
 * @venus-include ../../src/Form/Form.js
 * @venus-include ../../src/Form/FormBuilderInterface.js
 * @venus-code ../../src/Form/FormBuilder.js
 */

describe('form form builder', function () {

    var builder;

    beforeEach(function () {
        builder = new Sy.Form.FormBuilder();
    });

    it('should add an element to the form', function () {
        expect(builder.add('foo')).toEqual(builder);
        expect(builder.getForm().elements.length).toEqual(1);
    });

    it('should set the options config to the form', function () {
        expect(builder.setOptions(new Sy.ConfiguratorInterface())).toEqual(builder);
        expect(builder.getForm().config instanceof Sy.ConfiguratorInterface).toBe(true);
    });

    it('should set the form name', function () {
        expect(builder.setName('foo')).toEqual(builder);
        expect(builder.getForm().getName()).toEqual('foo');
    });

    it('should set the object that hold data', function () {
        expect(builder.setObject({foo: 'bar'})).toEqual(builder);
        expect(builder.getForm().getObject()).toEqual({foo: 'bar'});
    });

    it('should return an instance of the form', function () {
        expect(builder.getForm() instanceof Sy.Form.FormInterface).toBe(true);
    });

    it('should set the validator to the form', function () {
        var validator = new Sy.Validator.Core();

        expect(builder.setValidator(validator)).toEqual(builder);
        expect(builder.getForm().validator).toEqual(validator);
    });

});

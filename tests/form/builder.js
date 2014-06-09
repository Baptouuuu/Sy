/**
 * @venus-library jasmine
 * @venus-include ../../vendor/underscore/underscore.js
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/ConfiguratorInterface.js
 * @venus-include ../../src/Configurator.js
 * @venus-include ../../src/Validator/Core.js
 * @venus-include ../../src/Form/FormInterface.js
 * @venus-include ../../src/Form/Form.js
 * @venus-include ../../src/Form/FormBuilderInterface.js
 * @venus-include ../../src/Form/FormBuilder.js
 * @venus-include ../../src/Form/FormTypeInterface.js
 * @venus-code ../../src/Form/Builder.js
 */

describe('form builder', function () {

    var abstractType = function () {},
        builder;

    window.User = function () {};

    abstractType.prototype = Object.create(Sy.Form.FormTypeInterface.prototype, {
        buildForm: {
            value: function (builder, options) {
                builder.add('foo');
            }
        },
        setDefaultOptions: {
            value: function (options) {
                options.set({
                    dataClass: 'User'
                });
            }
        },
        getName: {
            value: function () {
                return 'typeName';
            }
        }
    });

    beforeEach(function () {
        builder = new Sy.Form.Builder();
        builder.setValidator(new Sy.Validator.Core());
    });

    it('should throw if trying to set invalid validator', function () {
        expect(function () {
            builder.setValidator({});
        }).toThrow('Invalid validator');
    });

    it('should set the validator', function () {
        expect(builder.setValidator(new Sy.Validator.Core())).toEqual(builder);
        expect(builder.validator instanceof Sy.Validator.Core).toBe(true);
    });

    it('should create a form builder', function () {
        var object = {foo: 'bar'},
            formBuilder = builder.createFormBuilder(object, {optionKey: 'value'});

        expect(formBuilder instanceof Sy.Form.FormBuilderInterface).toBe(true);
        expect(formBuilder.getForm().getObject()).toEqual(object);
        expect(formBuilder.getForm().config.has('optionKey')).toBe(true);
    });

    it('should throw if trying to set invalid form type', function () {
        expect(function () {
            builder.registerFormType({});
        }).toThrow('Invalid form type');
    });

    it('should register a form type', function () {
        expect(builder.registerFormType(new abstractType())).toEqual(builder);
        expect(builder.types.typeName instanceof abstractType).toBe(true);
    });

    it('should throw if trying to create form from unknown form type', function () {
        expect(function () {
            builder.createForm('unknown');
        }).toThrow('Form type "unknown" is undefined');
    });

    it('should create a form from a registered form type', function () {
        builder.registerFormType(new abstractType());

        var form = builder.createForm('typeName', null, {
            someKey: 'value'
        });

        expect(form instanceof Sy.Form.FormInterface).toBe(true);
        expect(form.config.has('someKey')).toBe(true);
        expect(form.config.has('dataClass')).toBe(true);
        expect(form.config.get('dataClass')).toEqual('User');
        expect(form.elements.length).toEqual(1);
        expect(form.getObject() instanceof User).toBe(true);
    });

    it('should create a form from the form type instance', function () {
        var form = builder.createForm(new abstractType(), null, {
            someKey: 'value'
        });

        expect(form instanceof Sy.Form.FormInterface).toBe(true);
        expect(form.config.has('someKey')).toBe(true);
        expect(form.config.has('dataClass')).toBe(true);
        expect(form.config.get('dataClass')).toEqual('User');
        expect(form.elements.length).toEqual(1);
        expect(form.getObject() instanceof User).toBe(true);
    });

    it('should create a form with the given object as data holder', function () {
        var user = new User(),
            form = builder.createForm(new abstractType(), user, {
                someKey: 'value'
            });

        expect(form.getObject()).toEqual(user);
    });

    it('should throw if trying to use a data holder that is not an instance of the data class', function () {
        expect(function () {
            builder.createForm(new abstractType(), {});
        }).toThrow('The object is not an instance of "User"');
    });

    it('should throw if data class is undefined', function () {
        expect(function () {
            builder.createForm(new abstractType(), null, {
                dataClass: 'Unknown'
            });
        }).toThrow('Data class "Unknown" is undefined');
    });

});

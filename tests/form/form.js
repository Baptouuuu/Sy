/**
 * @venus-library jasmine
 * @venus-include ../../vendor/Reflection.js/reflection.js
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/ConfiguratorInterface.js
 * @venus-include ../../dist/validator.js
 * @venus-include ../../src/Form/FormInterface.js
 * @venus-code ../../src/Form/Form.js
 */

describe('form', function () {

    var form,
        element,
        validator;

    beforeEach(function () {
        var i1 = document.createElement('input'),
            i2 = document.createElement('input');
        form = new Sy.Form.Form();
        element = document.createElement('form');
        i1.name = 'foo';
        i1.value = 'bar';
        i2.name = 'bar';
        i2.value = 'baz';
        i2.required = true;
        element.appendChild(i1);
        element.appendChild(i2);

        var contextFactory = new Sy.Validator.ExecutionContextFactory();

        validator = new Sy.Validator.Core();

        contextFactory.setConstraintValidatorFactory(new Sy.Validator.ConstraintValidatorFactory());

        validator
            .setRulesRegistry(new Sy.Registry())
            .setContextFactory(contextFactory)
            .setConstraintFactory(new Sy.Validator.ConstraintFactory());
    })

    it('should add an element to the form', function () {
        expect(form.add('foo')).toEqual(form);
        expect(form.elements.length).toEqual(1);
    });

    it('should set the form name', function () {
        expect(form.setName('foo')).toEqual(form);
        expect(form.getName()).toEqual('foo');
    });

    it('should the object that will hold the data', function () {
        var o = {foo: 'bar'};
        expect(form.setObject(o)).toEqual(form);
        expect(form.getObject()).toEqual(o);
    });

    it('should throw if trying to handle form without reference', function () {
        expect(function () {
            form.handle();
        }).toThrow('Form element not found');
    });

    it('should populate object when handling given form', function () {
        form
            .add('foo')
            .add('bar');
        form.setObject({});
        form.handle(element);

        expect(form.getObject()).toEqual({
            foo: 'bar',
            bar: 'baz'
        });
    });

    it('should populate object when handling with previous handled form', function () {
        form
            .add('foo')
            .add('bar');
        form.setObject({});
        form.handle(element);

        element[1].value = 'bar';

        form.handle();

        expect(form.getObject()).toEqual({
            foo: 'bar',
            bar: 'bar'
        });
    });

    it('should populate object when handling with form found in dom', function () {
        document.body.appendChild(element);

        element.id = 'formName';

        form.setName('formName');
        form
            .add('foo')
            .add('bar');
        form.setObject({});
        form.handle();

        expect(form.getObject()).toEqual({
            foo: 'bar',
            bar: 'baz'
        });
    });

    it('should populate object when handling given form with specific setter', function () {
        var o = function () {
            this.foofoo = false;
            this.foobar = false;
        };
        o.prototype = {
            setFoo: function () {
                this.foofoo = true;
            },
            setBar: function () {
                this.foobar = true;
            }
        };

        form
            .add('foo')
            .add('bar');
        form.setObject(new o());
        form.handle(element);

        expect(form.getObject().foofoo).toBe(true);
        expect(form.getObject().foobar).toBe(true);
    });

    it('should populate object when handling given form with generic setter', function () {
        var o = function () {
            this.foofoo = false;
            this.foobar = false;
        };
        o.prototype = {
            set: function (name, value) {
                this['foo'+name] = value;
            }
        };

        form
            .add('foo')
            .add('bar');
        form.setObject(new o());
        form.handle(element);

        expect(form.getObject().foofoo).toEqual('bar');
        expect(form.getObject().foobar).toEqual('baz');
    });

    it('should validate with native form validation', function () {
        form
            .add('foo')
            .add('bar');
        form.setObject({});
        form.handle(element);

        expect(form.isValid()).toBe(true);

        element[1].value = null;

        expect(form.isValid()).toBe(false);
    });

    it('should validate with Sy validator', function () {
        window.User = function () {};

        validator.registerRule('User', {});

        form.setValidator(validator);
        form.setOptions(new Sy.ConfiguratorInterface());
        form.setObject(new User());
        form.handle(element);

        expect(form.isValid()).toBe(true);
    });

    it('should throw if trying to set invalid validator', function () {
        expect(function () {
            form.setValidator({});
        }).toThrow('Invalid validator');
    });

    it('should set the validator', function () {
        expect(form.setValidator(validator)).toEqual(form);
        expect(form.validator).toEqual(validator);
    });

    it('should throw if trying to set invalid options', function () {
        expect(function () {
            form.setOptions({});
        }).toThrow('Invalid configurator');
    });

    it('should set the options config', function () {
        expect(form.setOptions(new Sy.ConfiguratorInterface())).toEqual(form);
        expect(form.config instanceof Sy.ConfiguratorInterface).toBe(true);
    });

});

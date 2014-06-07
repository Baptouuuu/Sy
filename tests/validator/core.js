/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/Validator/ExecutionContext.js
 * @venus-include ../../src/Validator/ExecutionContextFactory.js
 * @venus-include ../../src/Validator/ConstraintInterface.js
 * @venus-include ../../src/Validator/ConstraintValidatorInterface.js
 * @venus-include ../../src/Validator/AbstractConstraint.js
 * @venus-include ../../src/Validator/AbstractConstraintValidator.js
 * @venus-include ../../src/Validator/ConstraintFactory.js
 * @venus-include ../../src/Validator/ConstraintValidatorFactory.js
 * @venus-include ../../src/Validator/ConstraintViolation.js
 * @venus-include ../../src/Validator/ConstraintViolationList.js
 * @venus-include ../../src/Validator/Constraint/NotBlank.js
 * @venus-include ../../src/Validator/Constraint/NotBlankValidator.js
 * @venus-include ../../src/Validator/Constraint/True.js
 * @venus-include ../../src/Validator/Constraint/TrueValidator.js
 * @venus-code ../../src/Validator/Core.js
 */

describe('validator', function () {

    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    var rules = {
            'Foo': {
                getters: {
                    isTrue: {
                        True: {
                            message: 'the getter does not return true',
                            groups: ['only_getter']
                        }
                    }
                },
                properties: {
                    bar: {
                        NotBlank: {message: 'bar should not be blank'}
                    }
                }
            }
        },
        v;

    window.Foo = function () {
        this.bar = 'foo';
        this.trueProp = true;
    };

    window.Foo.prototype = Object.create(Object.prototype, {
        isTrue: {
            value: function () {
                return this.trueProp;
            }
        }
    });

    beforeEach(function () {
        var exF = new Sy.Validator.ExecutionContextFactory();

        exF.setConstraintValidatorFactory(new Sy.Validator.ConstraintValidatorFactory());

        v = new Sy.Validator.Core();
        v.setRulesRegistry(new Sy.Registry());
        v.setContextFactory(exF);
        v.setConstraintFactory(new Sy.Validator.ConstraintFactory());
    });

    it('should throw if trying to set invalid rules registry', function () {
        expect(function () {
            v.setRulesRegistry({});
        }).toThrow('Invalid registry');
    });

    it('should set the rules registry', function () {
        expect(v.setRulesRegistry(new Sy.Registry())).toEqual(v);
    });

    it('should throw if trying to set invalid execution context factory', function () {
        expect(function () {
            v.setContextFactory({});
        }).toThrow('Invalid context factory');
    });

    it('should set the execution context factory', function () {
        var exF = new Sy.Validator.ExecutionContextFactory();

        exF.setConstraintValidatorFactory(new Sy.Validator.ConstraintValidatorFactory());

        expect(v.setContextFactory(exF)).toEqual(v);
    });

    it('should throw if trying to set invalid constraint factory', function () {
        expect(function () {
            v.setConstraintFactory({});
        }).toThrow('Invalid constraint factory');
    });

    it('should set the constraint factory', function () {
        expect(v.setConstraintFactory(new Sy.Validator.ConstraintFactory())).toEqual(v);
    });

    it('should register a set of rules', function () {
        expect(v.registerRules(rules)).toEqual(v);
        expect(v.rules.length()).toEqual(1);
    });

    it('should register a rule', function () {
        expect(v.registerRule('Foo', rules.Foo)).toEqual(v);
        expect(v.rules.length()).toEqual(1);
    });

    it('should throw if trying to set twice a rule with the name', function () {
        v.registerRule('Foo', rules.Foo);

        expect(function () {
            v.registerRule('Foo', rules.Foo);
        }).toThrow('Rules are already defined for the path "Foo"');
    });

    it('should validate a value', function () {
        var c = new Sy.Validator.Constraint.NotBlank({groups: ['foo']}),
            violations;

        violations = v.validateValue('', c);

        expect(violations instanceof Sy.Validator.ConstraintViolationList).toBe(true);
        expect(violations.length).toEqual(1);

        violations = v.validateValue('', [c]);

        expect(violations instanceof Sy.Validator.ConstraintViolationList).toBe(true);
        expect(violations.length).toEqual(1);

        violations = v.validateValue('', [c], 'foo');

        expect(violations instanceof Sy.Validator.ConstraintViolationList).toBe(true);
        expect(violations.length).toEqual(1);

        violations = v.validateValue('', [c], ['foo']);

        expect(violations instanceof Sy.Validator.ConstraintViolationList).toBe(true);
        expect(violations.length).toEqual(1);

    });

    it('should throw if trying to validate object without registered rules', function () {
        expect(function () {
            v.validate({});
        }).toThrow('No rules defined for the specified object');
    });

    it('should validate an object', function () {
        var o = new Foo(),
            violations;

        v.registerRules(rules);

        violations = v.validate(o);

        expect(violations.length).toEqual(0);

        o.bar = null;
        o.trueProp = false;

        violations = v.validate(o);

        expect(violations.length).toEqual(2);
        expect(violations.toJSON()).toEqual([
            {message: 'the getter does not return true', path: 'isTrue'},
            {message: 'bar should not be blank', path: 'bar'}
        ]);

        violations = v.validate(o, 'only_getter');

        expect(violations.length).toEqual(1);
        expect(violations.toJSON()).toEqual([
            {message: 'the getter does not return true', path: 'isTrue'}
        ]);

        violations = v.validate(o, ['only_getter']);

        expect(violations.length).toEqual(1);
        expect(violations.toJSON()).toEqual([
            {message: 'the getter does not return true', path: 'isTrue'}
        ]);
    });

});

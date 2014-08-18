/**
 * @venus-library jasmine
 * @venus-include ../../vendor/Reflection.js/reflection.js
 * @venus-include ../../vendor/underscore/underscore.js
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/PropertyAccessor.js
 * @venus-include ../../src/ConfiguratorInterface.js
 * @venus-include ../../src/Configurator.js
 * @venus-include ../../src/ServiceContainer/Alias.js
 * @venus-include ../../src/ServiceContainer/Definition.js
 * @venus-include ../../src/ServiceContainer/Parameter.js
 * @venus-include ../../src/ServiceContainer/Reference.js
 * @venus-code ../../src/ServiceContainer/Core.js
 */

describe('service container', function () {

    var sc;

    window.Foo = function () {};
    window.Factory = function () {};
    window.Configurator = function () {};

    window.Foo.prototype = Object.create(Object.prototype, {
        set: {
            value: function (val) {
                this.setterCalled = val;
            }
        },
        setDep: {
            value: function (dep) {
                this.dep = dep;
            }
        }
    });
    window.Factory.prototype = Object.create(Object.prototype, {
        make: {
            value: function (klass) {
                var s = new window.Foo();
                s.viaFactory = true;
                s.klass = klass;
                return s;
            }
        },
        makeInvalid: {
            value: function () {
                return {};
            }
        }
    });
    window.Configurator.prototype = Object.create(Object.prototype, {
        configure: {
            value: function (foo) {
                foo.configured = true;
            }
        }
    });

    beforeEach(function () {
        sc = new Sy.ServiceContainer.Core();
    });

    it('should set a initialized service', function () {
        var s = {};
        expect(sc.setInstance('foo', s)).toEqual(sc);
        expect(sc.has('foo')).toBe(true);
        expect(sc.isInitialized('foo')).toBe(true);
    });

    it('should set an alias', function () {
        expect(sc.set({'foo': '@bar'})).toEqual(sc);
        expect(sc.getDefinition('foo') instanceof Sy.ServiceContainer.Alias).toBe(true);
        expect(sc.getDefinition('foo').toString()).toEqual('bar');
    });

    it('should set a service definition', function () {
        sc.set({
            'service': {
                constructor: 'Foo',
                configurator: ['serviceA', 'configure'],
                factory: ['serviceB', 'make'],
                calls: [
                    ['setA', ['A']]
                ],
                private: null,
                abstract: null,
                prototype: null,
                parent: 'parentService',
                tags: [
                    {name: 'tag', some: 'value'}
                ]
            }
        });

        expect(sc.has('service')).toBe(true);
        expect(sc.isInitialized('servcie')).toBe(false);

        var def = sc.getDefinition('service');

        expect(def instanceof Sy.ServiceContainer.Definition).toBe(true);
        expect(def.getConstructor()).toEqual('Foo');
        expect(def.getFactoryService().toString()).toEqual('serviceB');
        expect(def.getFactoryMethod()).toEqual('make');
        expect(def.getConfigurator().toString()).toEqual('serviceA');
        expect(def.getConfiguratorMethod()).toEqual('configure');
        expect(def.getCalls()).toEqual([['setA', ['A']]]);
        expect(def.isPublic()).toBe(false);
        expect(def.isAbstract()).toBe(true);
        expect(def.isPrototype()).toBe(true);
        expect(def.getParent().toString()).toEqual('parentService');
        expect(def.getTags()).toEqual([['tag', {name: 'tag', some: 'value'}]]);
    });

    it('should throw if unknown service', function () {
        expect(function () {
            sc.get('foo');
        }).toThrow('Unknown service');
    });

    it('should throw if accessing private service', function () {
        sc.set({
            'private': {
                private: null
            }
        });

        expect(function () {
            sc.get('private');
        }).toThrow('Can\'t access private service');
    });

    it('should throw if accessing abstract service', function () {
        sc.set({
            'abstract': {
                abstract: null
            }
        });

        expect(function () {
            sc.get('abstract');
        }).toThrow('Can\'t access abstract service');
    });

    it('should throw if circular referencing detected', function () {
        sc.set({
            'foo' : {
                constructor: 'Foo',
                calls: [['setFoo', [new Sy.ServiceContainer.Reference('foo')]]]
            }
        });

        expect(function () {
            sc.get('foo');
        }).toThrow('Circular referencing');
    });

    it('should build the service via the factory', function () {
        sc.set({
            'factory': {
                constructor: 'Factory'
            },
            'service': {
                constructor: 'Foo',
                factory: ['factory', 'make']
            }
        });

        var s = sc.get('service');

        expect(s instanceof Foo).toBe(true);
        expect(s.viaFactory).toBe(true);
        expect(s.klass).toEqual('Foo');
    });

    it('should throw if factory build wrong instance', function () {
        sc.set({
            'factory': {
                constructor: 'Factory'
            },
            'service': {
                constructor: 'Foo',
                factory: ['factory', 'makeInvalid']
            }
        });

        expect(function () {
            sc.get('service');
        }).toThrow('Factory built an object different from the specified type');
    });

    it('should build the service and pass it to its configurator', function () {
        sc.set({
            'configurator': {
                constructor: 'Configurator'
            },
            'service': {
                constructor: 'Foo',
                configurator: ['configurator', 'configure']
            }
        });

        var s = sc.get('service');

        expect(s instanceof Foo).toBe(true);
        expect(s.configured).toBe(true);
    });

    it('should call the defined method calls', function () {
        sc.set({
            'service': {
                constructor: 'Foo',
                calls: [
                    ['set', [true]],
                    ['setDep', [new Sy.ServiceContainer.Reference('dep')]]
                ]
            },
            'dep': {
                constructor: 'Factory'
            }
        });

        var s = sc.get('service');

        expect(s instanceof Foo).toBe(true);
        expect(s.setterCalled).toBe(true);
        expect(s.dep instanceof Factory).toBe(true);
    });

    it('should return all the service ids', function () {
        sc.set({
            foo: {
                constructor: 'Foo'
            }
        });

        expect(sc.getServiceIds()).toEqual(['foo']);
    });

    it('should set the parameters object', function () {
        var c = new Sy.Configurator();

        c.set({
            foo: 'bar'
        });

        expect(sc.setParameters(c)).toEqual(sc);
        expect(sc.hasParameter('foo')).toBe(true);
        expect(sc.getParameter('foo')).toEqual('bar');
    });

    it('should throw if invalid object passed to parameters setter', function () {
        expect(function () {
            sc.setParameters({});
        }).toThrow('Invalid parameters object');
    });

    it('should call a setter with a parameter', function () {
        var c = new Sy.Configurator();

        c.set({
            foo: 'bar'
        });
        sc.setParameters(c);

        sc.set({
            'service': {
                constructor: 'Foo',
                calls: [
                    ['setDep', [new Sy.ServiceContainer.Parameter('foo')]]
                ]
            }
        });

        var s = sc.get('service');

        expect(s instanceof Foo).toBe(true);
        expect(s.dep).toEqual('bar');
    });

    it('should set a service as initialized once built', function () {
        sc.set({
            service: {
                constructor: 'Foo'
            }
        });

        expect(sc.isInitialized('service')).toBe(false);
        sc.get('service');
        expect(sc.isInitialized('service')).toBe(true);
    });

    it('should not set a service as initialized once built if it is a prototype', function () {
        sc.set({
            service: {
                constructor: 'Foo',
                prototype: null
            }
        });

        expect(sc.isInitialized('service')).toBe(false);
        sc.get('service');
        expect(sc.isInitialized('service')).toBe(false);
    });

    it('should return the list of services having the specified tag', function () {
        sc.set({
            a: {
                tags: [
                    {name: 'foo', data: ['foo']},
                    {name: 'bar', foo: 'bar'}
                ]
            },
            b: {
                tags: [
                    {name: 'bar', data: ['bar']},
                    {name: 'bar', foo: 'foobar'}
                ]
            }
        });

        var foo = sc.findTaggedServiceIds('foo'),
            bar = sc.findTaggedServiceIds('bar');

        expect(foo.length).toEqual(1);
        expect(foo[0].id).toEqual('a');
        expect(foo[0].tags).toEqual([['foo', {name: 'foo', data: ['foo']}]]);

        expect(bar.length).toEqual(2);
        expect(bar[1].id).toEqual('b');
        expect(bar[1].tags).toEqual([
            ['bar', {name: 'bar', data: ['bar']}],
            ['bar', {name: 'bar', foo: 'foobar'}]
        ]);
        expect(bar[0].id).toEqual('a');
        expect(bar[0].tags).toEqual([['bar', {name: 'bar', foo: 'bar'}]]);
    });

    it('shoud remove a service definition', function () {
        sc.set({
            'foo': {}
        });

        expect(sc.has('foo')).toBe(true);
        expect(sc.remove('foo')).toEqual(sc);
        expect(sc.has('foo')).toBe(false);
        expect(sc.isInitialized('foo')).toBe(false);
    });

    it('should set a definition', function () {
        expect(sc.has('foo')).toBe(false);
        expect(sc.setDefinition('foo', new Sy.ServiceContainer.Definition())).toEqual(sc);
        expect(sc.has('foo')).toBe(true);
        expect(sc.isInitialized('foo')).toBe(false);
    });

    it('should throw is setting non Definition object', function () {
        expect(function () {
            sc.setDefinition('foo', {});
        }).toThrow('Invalid definition');
    });

    it('should throw if trying to set a service twice', function () {
        sc.set({foo: {}});

        expect(function () {
            sc.set({foo: {}});
        }).toThrow('Service name already used');
    });

});

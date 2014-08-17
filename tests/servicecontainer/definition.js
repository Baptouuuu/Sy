/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/ServiceContainer/Reference.js
 * @venus-code ../../src/ServiceContainer/Definition.js
 */

describe('service container definition', function () {

    var d;

    beforeEach(function () {
        d = new Sy.ServiceContainer.Definition();
    });

    it('should set the constructor', function () {
        expect(d.setConstructor('Foo')).toEqual(d);
        expect(d.getConstructor()).toEqual('Foo');
    });

    it('should set the factory service', function () {
        var ref = new Sy.ServiceContainer.Reference('Foo');
        expect(d.setFactoryService(ref)).toEqual(d);
        expect(d.getFactoryService()).toEqual(ref);
    });

    it('should throw if factory service is not a reference', function () {
        expect(function () {
            d.setFactoryService('');
        }).toThrow('Invalid reference');
    });

    it('should set the factory method', function () {
        expect(d.setFactoryMethod('foo')).toEqual(d);
        expect(d.getFactoryMethod()).toEqual('foo');
    });

    it('should say a factory exist', function () {
        d.setFactoryService(new Sy.ServiceContainer.Reference('foo'));
        d.setFactoryMethod('foo');

        expect(d.hasFactory()).toBe(true);
    });

    it('should say a factory does not exist', function () {
        expect(d.hasFactory()).toBe(false);

        d.setFactoryMethod('foo');

        expect(d.hasFactory()).toBe(false);

        d.factoryMethod = null;
        d.setFactoryService(new Sy.ServiceContainer.Reference('foo'));

        expect(d.hasFactory()).toBe(false);
    });

    it('should set a configurator service', function () {
        var ref = new Sy.ServiceContainer.Reference('foo');
        expect(d.setConfigurator(ref)).toEqual(d);
        expect(d.getConfigurator()).toEqual(ref);
    });

    it('should throw if configurator service is not a reference', function () {
        expect(function () {
            d.setConfigurator('');
        }).toThrow('Invalid reference');
    });

    it('should set the configurator method', function () {
        expect(d.setConfiguratorMethod('foo')).toEqual(d);
        expect(d.getConfiguratorMethod()).toEqual('foo');
    });

    it('should say a configurator exist', function () {
        d.setConfigurator(new Sy.ServiceContainer.Reference('foo'));
        d.setConfiguratorMethod('foo');

        expect(d.hasConfigurator()).toBe(true);
    });

    it('should say a configurator does not exist', function () {
        expect(d.hasConfigurator()).toBe(false);

        d.setConfigurator(new Sy.ServiceContainer.Reference('foo'));

        expect(d.hasConfigurator()).toBe(false);

        d.configuratorService = null;
        d.setConfiguratorMethod('foo');

        expect(d.hasConfigurator()).toBe(false);
    });

    it('should add a new call', function () {
        expect(d.addCall('foo', [1])).toEqual(d);
        expect(d.getCalls()).toEqual([['foo', [1]]]);
    });

    it('should set the service as private', function () {
        expect(d.isPublic()).toBe(true);
        expect(d.setPrivate()).toEqual(d);
        expect(d.isPublic()).toBe(false);
    });

    it('should add a tag', function () {
        expect(d.addTag('foo', {some: 'prop'})).toEqual(d);
        expect(d.getTags()).toEqual([['foo', {some: 'prop'}]]);
    });

    it('should only return the tags matching the name', function () {
        d.addTag('foo', {foo: true});
        d.addTag('foo', {foo: false});
        d.addTag('bar', {bar: true});

        expect(d.getTag('foo')).toEqual([
            ['foo', {foo: true}],
            ['foo', {foo: false}]
        ]);
    });

    it('should set the service as abstract', function () {
        expect(d.isAbstract()).toBe(false);
        expect(d.setAbstract()).toEqual(d);
        expect(d.isAbstract()).toBe(true);
    });

    it('should set a parent', function () {
        var p = new Sy.ServiceContainer.Reference('parent');
        expect(d.hasParent()).toBe(false);
        expect(d.setParent(p)).toEqual(d);
        expect(d.hasParent()).toBe(true);
        expect(d.getParent()).toEqual(p);
    });

    it('should throw if parent is not a reference', function () {
        expect(function () {
            d.setParent('');
        }).toThrow('Invalid reference');
    });

    it('should set the service as prototype', function () {
        expect(d.isPrototype()).toBe(false);
        expect(d.setPrototype()).toEqual(d);
        expect(d.isPrototype()).toBe(true);
    });

});

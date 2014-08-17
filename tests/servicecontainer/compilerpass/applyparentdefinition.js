/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/PropertyAccessor.js
 * @venus-include ../../../src/ServiceContainer/Core.js
 * @venus-include ../../../src/ServiceContainer/Definition.js
 * @venus-include ../../../src/ServiceContainer/Reference.js
 * @venus-include ../../../src/ServiceContainer/CompilerPassInterface.js
 * @venus-code ../../../src/ServiceContainer/CompilerPass/ApplyParentDefinition.js
 */

describe('compiler pass parent', function () {

    var sc,
        pass;

    beforeEach(function () {
        sc = new Sy.ServiceContainer.Core();
        pass = new Sy.ServiceContainer.CompilerPass.ApplyParentDefinition();

        sc.set({
            'parent': {
                abstract: null,
                factory: ['factory', 'make'],
                configurator: ['configurator', 'configure'],
                calls: [
                    ['setA', ['A']],
                    ['setB', ['B']]
                ]
            },
            'childA': {
                calls: [
                    ['setC', ['C']]
                ],
                parent: 'parent'
            },
            'childB': {
                factory: ['another', 'another'],
                parent: 'parent'
            },
            'childC': {
                configurator: ['another', 'another'],
                parent: 'parent'
            }
        });
    });

    it('should apply factory, configurator and calls', function () {
        pass.process(sc);

        var def = sc.getDefinition('childA');

        expect(def.getFactoryService().toString()).toEqual('factory');
        expect(def.getFactoryMethod()).toEqual('make');

        expect(def.getConfigurator().toString()).toEqual('configurator');
        expect(def.getConfiguratorMethod()).toEqual('configure');

        expect(def.getCalls()).toEqual([
            ['setA', ['A']],
            ['setB', ['B']],
            ['setC', ['C']]
        ]);
    });

    it('should apply configurator and calls', function () {
        pass.process(sc);

        var def = sc.getDefinition('childB');

        expect(def.getFactoryService().toString()).toEqual('another');
        expect(def.getFactoryMethod()).toEqual('another');

        expect(def.getConfigurator().toString()).toEqual('configurator');
        expect(def.getConfiguratorMethod()).toEqual('configure');

        expect(def.getCalls()).toEqual([
            ['setA', ['A']],
            ['setB', ['B']]
        ]);
    });

    it('should apply factory and calls', function () {
        pass.process(sc);

        var def = sc.getDefinition('childC');

        expect(def.getFactoryService().toString()).toEqual('factory');
        expect(def.getFactoryMethod()).toEqual('make');

        expect(def.getConfigurator().toString()).toEqual('another');
        expect(def.getConfiguratorMethod()).toEqual('another');

        expect(def.getCalls()).toEqual([
            ['setA', ['A']],
            ['setB', ['B']]
        ]);
    });

});

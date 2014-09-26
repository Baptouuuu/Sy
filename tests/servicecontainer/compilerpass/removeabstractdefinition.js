/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/PropertyAccessor.js
 * @venus-include ../../../src/ServiceContainer/Core.js
 * @venus-include ../../../src/ServiceContainer/Definition.js
 * @venus-include ../../../src/ServiceContainer/Reference.js
 * @venus-include ../../../src/ServiceContainer/CompilerPassInterface.js
 * @venus-code ../../../src/ServiceContainer/CompilerPass/RemoveAbstractDefinitions.js
 */

describe('compiler pass parent', function () {

    var sc,
        pass;

    beforeEach(function () {
        sc = new Sy.ServiceContainer.Core();
        pass = new Sy.ServiceContainer.CompilerPass.RemoveAbstractDefinitions();

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
            }
        });
    });

    it('should remove the abstract definition', function () {
        expect(sc.has('parent')).toBe(true);
        expect(sc.has('childA')).toBe(true);

        pass.process(sc);

        expect(sc.has('parent')).toBe(false);
        expect(sc.has('childA')).toBe(true);
    });

});

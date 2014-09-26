/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/PropertyAccessor.js
 * @venus-include ../../../src/ServiceContainer/Core.js
 * @venus-include ../../../src/ServiceContainer/Definition.js
 * @venus-include ../../../src/ServiceContainer/Reference.js
 * @venus-include ../../../src/ServiceContainer/CompilerPassInterface.js
 * @venus-code ../../../src/ServiceContainer/CompilerPass/ResolveReferencePlaceholder.js
 */

describe('compiler pass parent', function () {

    var sc,
        pass;

    beforeEach(function () {
        sc = new Sy.ServiceContainer.Core();
        pass = new Sy.ServiceContainer.CompilerPass.ResolveReferencePlaceholder();

        sc.set({
            'service': {
                calls: [
                    ['setter', ['@ref', 'no']]
                ]
            },
            'ref': {}
        });
    });

    it('should replace service reference placeholders by Reference objects', function () {
        expect(sc.getDefinition('service').getCalls()).toEqual([
            ['setter', ['@ref', 'no']]
        ]);

        pass.process(sc);

        expect(sc.getDefinition('service').getCalls()[0][1][0] instanceof Sy.ServiceContainer.Reference).toBe(true);
        expect(sc.getDefinition('service').getCalls()[0][1][1]).toEqual('no');
        expect(sc.getDefinition('service').getCalls()[0][1][0].toString()).toEqual('ref');
    });

});

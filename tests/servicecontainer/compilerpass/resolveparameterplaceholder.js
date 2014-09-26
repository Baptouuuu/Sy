/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/PropertyAccessor.js
 * @venus-include ../../../src/ServiceContainer/Core.js
 * @venus-include ../../../src/ServiceContainer/Definition.js
 * @venus-include ../../../src/ServiceContainer/Parameter.js
 * @venus-include ../../../src/ServiceContainer/CompilerPassInterface.js
 * @venus-code ../../../src/ServiceContainer/CompilerPass/ResolveParameterPlaceholder.js
 */

describe('compiler pass parent', function () {

    var sc,
        pass;

    beforeEach(function () {
        sc = new Sy.ServiceContainer.Core();
        pass = new Sy.ServiceContainer.CompilerPass.ResolveParameterPlaceholder();

        sc.set({
            'service': {
                calls: [
                    ['setter', ['%foo%', '%bar.baz%', '%foo-bar_baz%', 'no']]
                ]
            }
        });
    });

    it('should replace parameter placeholders by Parameter objects', function () {
        expect(sc.getDefinition('service').getCalls()).toEqual([
            ['setter', ['%foo%', '%bar.baz%', '%foo-bar_baz%', 'no']]
        ]);

        pass.process(sc);

        expect(sc.getDefinition('service').getCalls()[0][1][0] instanceof Sy.ServiceContainer.Parameter).toBe(true);
        expect(sc.getDefinition('service').getCalls()[0][1][1] instanceof Sy.ServiceContainer.Parameter).toBe(true);
        expect(sc.getDefinition('service').getCalls()[0][1][2] instanceof Sy.ServiceContainer.Parameter).toBe(true);
        expect(sc.getDefinition('service').getCalls()[0][1][3]).toEqual('no');
        expect(sc.getDefinition('service').getCalls()[0][1][0].toString()).toEqual('foo');
        expect(sc.getDefinition('service').getCalls()[0][1][1].toString()).toEqual('bar.baz');
        expect(sc.getDefinition('service').getCalls()[0][1][2].toString()).toEqual('foo-bar_baz');
    });

});

/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/PropertyAccessor.js
 * @venus-include ../../../src/ServiceContainer/Core.js
 * @venus-include ../../../src/ServiceContainer/Definition.js
 * @venus-include ../../../src/ServiceContainer/Alias.js
 * @venus-include ../../../src/ServiceContainer/CompilerPassInterface.js
 * @venus-code ../../../src/ServiceContainer/CompilerPass/ReplaceAliasByDefinition.js
 */

describe('compiler pass parent', function () {

    var sc,
        pass;

    beforeEach(function () {
        sc = new Sy.ServiceContainer.Core();
        pass = new Sy.ServiceContainer.CompilerPass.ReplaceAliasByDefinition();

        sc.set({
            'alias': '@service',
            'service': {}
        });
    });

    it('should replace the alias by the definition', function () {
        expect(sc.getDefinition('alias') instanceof Sy.ServiceContainer.Alias).toBe(true);
        expect(sc.getDefinition('service') instanceof Sy.ServiceContainer.Definition).toBe(true);

        pass.process(sc);

        expect(sc.getDefinition('alias') instanceof Sy.ServiceContainer.Alias).toBe(false);
        expect(sc.getDefinition('service')).toEqual(sc.getDefinition('alias'));
    });

});

/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/PropertyAccessor.js
 * @venus-include ../../../src/ServiceContainer/Core.js
 * @venus-include ../../../src/ServiceContainer/Definition.js
 * @venus-include ../../../src/ServiceContainer/Reference.js
 * @venus-include ../../../src/ServiceContainer/CompilerPassInterface.js
 * @venus-code ../../../src/Kernel/CompilerPass/RegisterDriverFactoryPass.js
 */

describe('register storage driver factory', function () {

    var sc,
        pass;

    beforeEach(function () {
        sc = new Sy.ServiceContainer.Core();
        pass = new Sy.Kernel.CompilerPass.RegisterDriverFactoryPass();

        sc.set({
            'sy::core::storage::dbal::factory': {},
            'layout': {
                tags: [
                    {name: 'storage.driver_factory', alias: 'foo'},
                    {name: 'storage.driver_factory'}
                ]
            },
        });
    });

    it('should register one driver factory', function () {
        pass.process(sc);

        expect(
            sc
                .getDefinition('sy::core::storage::dbal::factory')
                .getCalls()
                .length
        ).toEqual(1);
    });

});

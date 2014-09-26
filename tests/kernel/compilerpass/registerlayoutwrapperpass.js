/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/PropertyAccessor.js
 * @venus-include ../../../src/ServiceContainer/Core.js
 * @venus-include ../../../src/ServiceContainer/Definition.js
 * @venus-include ../../../src/ServiceContainer/Reference.js
 * @venus-include ../../../src/ServiceContainer/CompilerPassInterface.js
 * @venus-code ../../../src/Kernel/CompilerPass/RegisterLayoutWrapperPass.js
 */

describe('register layout wrapper', function () {

    var sc,
        pass;

    beforeEach(function () {
        sc = new Sy.ServiceContainer.Core();
        pass = new Sy.Kernel.CompilerPass.RegisterLayoutWrapperPass();

        sc.set({
            'sy::core::view::factory::layout': {},
            'layout': {
                tags: [
                    {name: 'view.layout', alias: 'l', viewscreen: 'vs'},
                    {name: 'view.layout', alias: 'l2'},
                    {name: 'view.layout'}
                ]
            },
        });
    });

    it('should register two layouts to the factory', function () {
        pass.process(sc);

        expect(
            sc
                .getDefinition('sy::core::view::factory::layout')
                .getCalls()
                .length
        ).toEqual(1);
    });

});

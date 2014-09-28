/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/PropertyAccessor.js
 * @venus-include ../../../src/ServiceContainer/Core.js
 * @venus-include ../../../src/ServiceContainer/Definition.js
 * @venus-include ../../../src/ServiceContainer/Reference.js
 * @venus-include ../../../src/ServiceContainer/CompilerPassInterface.js
 * @venus-code ../../../src/ViewBundle/CompilerPass/RegisterViewScreenWrapperPass.js
 */

describe('register viewscreen wrapper', function () {

    var sc,
        pass;

    beforeEach(function () {
        sc = new Sy.ServiceContainer.Core();
        pass = new Sy.ViewBundle.CompilerPass.RegisterViewScreenWrapperPass();

        sc.set({
            'sy::core::view::factory::viewscreen': {},
            'viewscreen': {
                tags: [
                    {name: 'view.viewscreen', alias: 'vs'},
                    {name: 'view.viewscreen', alias: 'vs2'},
                    {name: 'view.viewscreen'}
                ]
            },
        });
    });

    it('should register two viewscreens to the factory', function () {
        pass.process(sc);

        expect(
            sc
                .getDefinition('sy::core::view::factory::viewscreen')
                .getCalls()
                .length
        ).toEqual(2);
    });

});

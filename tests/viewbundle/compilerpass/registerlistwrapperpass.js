/**
 * @venus-library jasmine
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/functions.js
 * @venus-include ../../../src/PropertyAccessor.js
 * @venus-include ../../../src/ServiceContainer/Core.js
 * @venus-include ../../../src/ServiceContainer/Definition.js
 * @venus-include ../../../src/ServiceContainer/Reference.js
 * @venus-include ../../../src/ServiceContainer/CompilerPassInterface.js
 * @venus-code ../../../src/ViewBundle/CompilerPass/RegisterListWrapperPass.js
 */

describe('register list wrapper', function () {

    var sc,
        pass;

    beforeEach(function () {
        sc = new Sy.ServiceContainer.Core();
        pass = new Sy.ViewBundle.CompilerPass.RegisterListWrapperPass();

        sc.set({
            'sy::core::view::factory::list': {},
            'list': {
                tags: [
                    {name: 'view.list', alias: 'l', viewscreen: 'vs', layout: 'l'},
                    {name: 'view.list', alias: 'l2', viewscreen: 'vs'},
                    {name: 'view.list', alias: 'l3', layout: 'l'},
                    {name: 'view.list', alias: 'l4'},
                    {name: 'view.list'},
                ]
            },
        });
    });

    it('should register two lists to the factory', function () {
        pass.process(sc);

        expect(
            sc
                .getDefinition('sy::core::view::factory::list')
                .getCalls()
                .length
        ).toEqual(1);
    });

});

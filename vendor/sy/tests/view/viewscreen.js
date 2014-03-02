/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/RegistryFactory.js
 * @venus-include ../../src/View/TemplateEngineInterface.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/Parser.js
 * @venus-include ../../src/View/Layout.js
 * @venus-include ../../src/View/ListFactoryInterface.js
 * @venus-include ../../src/View/LayoutFactoryInterface.js
 * @venus-include ../../src/View/LayoutFactory.js
 * @venus-include ../../src/View/ViewScreen.js
 * @venus-fixture ../../fixtures/view/viewscreen.html
 */

describe('viewscreen', function () {

    var viewscreen = new Sy.View.ViewScreen(),
        factory = new Sy.View.LayoutFactory(),
        node = document.querySelector('[data-sy-view]');

    factory.setTemplateEngine(new Sy.View.TemplateEngineInterface());
    factory.setParser(new Sy.View.Parser());
    factory.setRegistryFactory(new Sy.RegistryFactory());
    factory.setListFactory(new Sy.View.ListFactoryInterface());

    viewscreen.setParser(new Sy.View.Parser());
    viewscreen.setLayoutsRegistry(new Sy.Registry());
    viewscreen.setLayoutFactory(factory);
    viewscreen.setNode(node);

    it('should return the name', function () {

        expect(viewscreen.getName()).toEqual('viewScreenName');

    });

    it('should return the list of layouts', function () {
        expect(viewscreen.getLayouts() instanceof Array).toBe(true);
        expect(viewscreen.getLayouts().length).toEqual(1);

    });

});
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
 * @venus-include ../../src/View/ViewScreenFactoryInterface.js
 * @venus-include ../../src/View/ViewScreenFactory.js
 * @venus-fixture ../../fixtures/view/viewscreen.html
 */

describe('viewscreen factory', function () {

    var factory = new Sy.View.ViewScreenFactory(),
        viewscreen = new Sy.View.ViewScreen(),
        layoutFactory = new Sy.View.LayoutFactory(),
        node = document.querySelector('[data-sy-view]');

    layoutFactory.setParser(new Sy.View.Parser());
    layoutFactory.setTemplateEngine(new Sy.View.TemplateEngineInterface());
    layoutFactory.setRegistryFactory(new Sy.RegistryFactory());
    layoutFactory.setListFactory(new Sy.View.ListFactoryInterface());

    factory.setParser(new Sy.View.Parser());
    factory.setTemplateEngine(new Sy.View.TemplateEngineInterface());
    factory.setRegistryFactory(new Sy.RegistryFactory());
    factory.setLayoutFactory(layoutFactory);

    it('should return a viewscreen wrapper', function () {
        var wrapper = factory.make(node);

        expect(wrapper instanceof Sy.View.ViewScreen).toBe(true);
    });

});
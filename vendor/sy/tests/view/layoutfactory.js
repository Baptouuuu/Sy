/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/RegistryFactory.js
 * @venus-include ../../src/View/Parser.js
 * @venus-include ../../src/View/ListFactoryInterface.js
 * @venus-include ../../src/View/TemplateEngineInterface.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/Layout.js
 * @venus-include ../../src/View/LayoutFactoryInterface.js
 * @venus-include ../../src/View/LayoutFactory.js
 */

describe('view layout factory', function () {

    var factory = new Sy.View.LayoutFactory(),
        MockEngine = function () {},
        MockListFactory = function () {};

    MockEngine.prototype = Object.create(Sy.View.TemplateEngineInterface.prototype);
    MockListFactory.prototype = Object.create(Sy.View.ListFactoryInterface.prototype);

    factory.setParser(new Sy.View.Parser());
    factory.setTemplateEngine(new MockEngine());
    factory.setRegistryFactory(new Sy.RegistryFactory());
    factory.setListFactory(new MockListFactory());

    it('should make a layout wrapper', function () {
        var node = document.createElement('section'),
            wrapper;

        node.dataset.syLayout = 'name';
        wrapper = factory.make(node);

        expect(wrapper instanceof Sy.View.Layout).toBe(true);
    });

});
/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/RegistryFactory.js
 * @venus-include ../../src/View/TemplateEngineInterface.js
 * @venus-include ../../src/View/Parser.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/Layout.js
 * @venus-include ../../src/View/LayoutFactoryInterface.js
 * @venus-include ../../src/View/LayoutFactory.js
 * @venus-include ../../src/View/ViewScreen.js
 * @venus-include ../../src/View/ViewScreenFactoryInterface.js
 * @venus-include ../../src/View/ViewScreenFactory.js
 * @venus-include ../../src/View/Manager.js
 */

describe('view manager', function () {

    var manager = new Sy.View.Manager(),
        viewscreenFactory = new Sy.View.ViewScreenFactory(),
        layoutFactory = new Sy.View.LayoutFactory();

    viewscreenFactory.setParser(new Sy.View.Parser());
    viewscreenFactory.setTemplateEngine(new Sy.View.TemplateEngineInterface());
    viewscreenFactory.setRegistryFactory(new Sy.RegistryFactory());
    viewscreenFactory.setLayoutFactory(layoutFactory);

    manager.setViewsRegistry(new Sy.Registry());
    manager.setViewScreenFactory(viewscreenFactory);

    it('should register a new view screen', function () {

        var node = document.createElement('section');

        node.dataset.syView = 'name';

        manager.setViewScreen(node);

        expect(manager.getViewScreen('name') instanceof Sy.View.NodeWrapper).toBe(true);
        expect(manager.getViewScreen('name') instanceof Sy.View.ViewScreen).toBe(true);

    });

});
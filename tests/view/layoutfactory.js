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
 * @venus-code ../../src/View/LayoutFactory.js
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

    it('should throw if invalid parser', function () {
        expect(function () {
            factory.setParser({});
        }).toThrow('Invalid parser');
    });

    it('should throw if invalid template engine', function () {
        expect(function () {
            factory.setTemplateEngine({});
        }).toThrow('Invalid template engine');
    });

    it('should throw if invalid registry factory', function () {
        expect(function () {
            factory.setRegistryFactory({});
        }).toThrow('Invalid registry factory');
    });

    it('should throw if invalid list factory', function () {
        expect(function () {
            factory.setListFactory({});
        }).toThrow('Invalid list factory');
    });

    it('should make a layout wrapper', function () {
        var node = document.createElement('section'),
            wrapper;

        node.dataset.syLayout = 'name';
        wrapper = factory.make('viewscreen name', node);

        expect(wrapper instanceof Sy.View.Layout).toBe(true);
    });

});
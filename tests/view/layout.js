/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/View/TemplateEngineInterface.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/Parser.js
 * @venus-include ../../src/View/List.js
 * @venus-include ../../src/View/ListFactoryInterface.js
 * @venus-include ../../src/View/ListFactory.js
 * @venus-code ../../src/View/Layout.js
 * @venus-fixture ../../fixtures/view/layout.html
 */

describe('view layout', function () {

    var rawNode = document.querySelector('[data-sy-layout]'),
        engine = new Sy.View.TemplateEngineInterface(),
        factory = new Sy.View.ListFactory(),
        layout,
        node;

    factory.setTemplateEngine(engine);

    beforeEach(function () {
        node = rawNode.cloneNode(true);
        layout = new Sy.View.Layout();
        layout.setParser(new Sy.View.Parser());
        layout.setListsRegistry(new Sy.Registry());
        layout.setListFactory(factory);
        layout.setNode(node);
    });

    it('should throw if invalid parser', function () {
        expect(function () {
            layout.setParser({});
        }).toThrow('Invalid parser');
    });

    it('should throw if invalid registry', function () {
        expect(function () {
            layout.setListsRegistry({});
        }).toThrow('Invalid registry');
    });

    it('should throw if invalid list factory', function () {
        expect(function () {
            layout.setListFactory({});
        }).toThrow('Invalid list factory');
    });

    it('should return the layout name', function () {
        expect(layout.getName()).toEqual('layoutName');
    });

    it('should return the layouts array', function () {
        var lists = layout.getLists();

        expect(lists instanceof Array).toBe(true);
        expect(lists.length).toEqual(1);
    });

    it('should set the viewscreen name', function () {
        expect(layout.setViewScreenName('foo')).toEqual(layout);
    });

});
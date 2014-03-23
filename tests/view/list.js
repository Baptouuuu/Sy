/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/Lib/Generator/Interface.js
 * @venus-include ../../src/Lib/Generator/UUID.js
 * @venus-include ../../src/View/TemplateEngineInterface.js
 * @venus-include ../../src/View/TemplateEngine.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-code ../../src/View/List.js
 * @venus-fixture ../../fixtures/view/list.html
 */

describe('view list', function () {

    var rawNode = document.querySelector('ul'),
        engine = new Sy.View.TemplateEngine(),
        list,
        node;

    engine.setRegistry(new Sy.Registry());
    engine.setGenerator(new Sy.Lib.Generator.UUID());

    beforeEach(function () {
        node = rawNode.cloneNode(true);
        list = new Sy.View.List();
        list.setTemplateEngine(engine);
        list.setNode(node);
    });

    it('should return the list name', function () {
        expect(list.getName()).toEqual('listName');
    });

    it('should parse element types', function () {
        expect(list.elements.length).toEqual(2);
        expect(list.types).toEqual(['first', 'second']);
    });

    it('should append new elements of specified types', function () {
        list.append({foo: 'second'}, 'second');
        list.append({foo: 'first'}, 'first');

        expect(node.childElementCount).toEqual(2);
        expect(node.firstElementChild.dataset.type).toEqual('second');
        expect(node.firstElementChild.textContent).toEqual('second');
        expect(node.children[1].dataset.type).toEqual('first');
        expect(node.children[1].textContent).toEqual('first');
    });

    it('should prepend new elements of specified types', function () {
        list.prepend({foo: 'second'}, 'second');
        list.prepend({foo: 'first'}, 'first');

        expect(node.childElementCount).toEqual(2);
        expect(node.firstElementChild.dataset.type).toEqual('first');
        expect(node.firstElementChild.textContent).toEqual('first');
        expect(node.children[1].dataset.type).toEqual('second');
        expect(node.children[1].textContent).toEqual('second');
    });

    it('should append a new element of the first type defined', function () {
        list.append({foo: 'should be first'});

        expect(node.childElementCount).toEqual(1);
        expect(node.firstElementChild.dataset.type).toEqual('first');
        expect(node.firstElementChild.textContent).toEqual('should be first');
    });

    it('should prepend a new element of the first type defined', function () {
        list.prepend({foo: 'should be first'});

        expect(node.childElementCount).toEqual(1);
        expect(node.firstElementChild.dataset.type).toEqual('first');
        expect(node.firstElementChild.textContent).toEqual('should be first');
    });

    it('should render elements specified in the array', function () {
        var data = [
            {
                foo: 'second',
                _type: 'second'
            },
            {
                foo: 'first',
                _type: 'first'
            }
        ];

        list.render(data);

        expect(node.childElementCount).toEqual(2);
        expect(node.firstElementChild.dataset.type).toEqual('second');
        expect(node.firstElementChild.textContent).toEqual('second');
        expect(node.children[1].dataset.type).toEqual('first');
        expect(node.children[1].textContent).toEqual('first');

        data.reverse();

        list.render(data);

        expect(node.childElementCount).toEqual(2);
        expect(node.firstElementChild.dataset.type).toEqual('first');
        expect(node.firstElementChild.textContent).toEqual('first');
        expect(node.children[1].dataset.type).toEqual('second');
        expect(node.children[1].textContent).toEqual('second');
    });

});
/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/View/Manager.js
 * @venus-include ../../src/View/NodeWrapper.js
 * @venus-include ../../src/View/ViewScreen.js
 */

describe('view manager', function () {

    var manager = new Sy.View.Manager();

    it('should register a new view screen', function () {

        var node = document.createElement('section');

        node.dataset.syView = 'name';

        manager.setViewScreen(node);

        expect(manager.getViewScreen('name') instanceof Sy.View.NodeWrapper).toBe(true);
        expect(manager.getViewScreen('name') instanceof Sy.View.ViewScreen).toBe(true);

    });

});
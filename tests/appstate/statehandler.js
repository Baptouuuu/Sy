/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/AppState/State.js
 * @venus-code ../../src/AppState/StateHandler.js
 */

describe('appstate statehandler', function () {
    Function.prototype.bind = Function.prototype.bind || function (context) {
        var self = this;

        return function () {
            return self.apply(context, arguments);
        };
    };

    it('should create a new state', function () {
        var h = new Sy.AppState.StateHandler(),
            state = h.createState('uuid', 'route', {});

        expect(state instanceof Sy.AppState.State).toBe(true);
        expect(h.getState('uuid') instanceof Sy.AppState.State).toBe(true);
    });

    it('should load previous history states', function () {
        sessionStorage.setItem(
            'sy::history',
            JSON.stringify([{uuid: 'uuid', route: 'route', variables: {}}])
        );

        var h = new Sy.AppState.StateHandler();

        expect(h.getState('uuid') instanceof Sy.AppState.State).toBe(true);
    });

    it('should save the history in localstorage', function () {
        sessionStorage.removeItem('sy::history');

        var h = new Sy.AppState.StateHandler();

        h.createState('uuid', 'route', {});
        h.saveHistory();

        expect(!!sessionStorage.getItem('sy::history')).toBe(true);
        expect(JSON.parse(sessionStorage.getItem('sy::history'))).toEqual([{
            uuid: 'uuid',
            route: 'route',
            variables: {}
        }]);
    });
});

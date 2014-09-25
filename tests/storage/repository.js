/**
 * @venus-library jasmine
 * @venus-include ../../vendor/bluebird/js/browser/bluebird.js
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/EntityInterface.js
 * @venus-include ../../src/Storage/Manager.js
 * @venus-code ../../src/Storage/Repository.js
 */

describe('storage repository', function () {
    var Manager = function () {};

    Manager.prototype = Object.create(Sy.Storage.Manager.prototype, {
        clear: {
            value: function (alias) {
                this.alias = alias;
                return this;
            }
        },
        find: {
            value: function (alias, id) {
                this.alias = alias;
                this.id = id;
                return new Promise(function () {});
            }
        },
        getUnitOfWork: {
            value: function () {
                var that = this
                return {
                    findAll: function (alias) {
                        that.alias = alias;
                        return new Promise(function () {});
                    },
                    findBy: function (alias, index, value, limit) {
                        that.alias = alias;
                        that.index = index;
                        that.value = value;
                        that.limit = limit;
                        return new Promise(function (resolve, reject) {
                            if (alias === 'toreject') {
                                reject();
                            } else if (alias === 'toresolve') {
                                resolve(new Sy.EntityInterface());
                            }
                        });
                    }
                }
            }
        }
    });

    it('should throw if trying to create a repository with an invalid manager', function () {
        expect(function () {
            new Sy.Storage.Repository({}, 'Bundle::Entity');
        }).toThrow('Invalid entity manager');
    });

    it('should detach all the entities', function () {
        var m = new Manager(),
            r = new Sy.Storage.Repository(m, 'Bundle::Entity');

        expect(r.clear()).toEqual(r);
        expect(m.alias).toEqual('Bundle::Entity');
    });

    it('should return a promise when trying to find an entity', function () {
        var m = new Manager(),
            r = new Sy.Storage.Repository(m, 'Bundle::Entity');

        expect(r.find('eid') instanceof Promise).toBe(true);
        expect(m.alias).toEqual('Bundle::Entity');
        expect(m.id).toEqual('eid');
    });

    it('should return a promise when trying to return all entities', function () {
        var m = new Manager(),
            r = new Sy.Storage.Repository(m, 'Bundle::Entity');

        expect(r.findAll() instanceof Promise).toBe(true);
        expect(m.alias).toEqual('Bundle::Entity');
    });

    it('should return a promise when trying to get entities by criteria', function () {
        var m = new Manager(),
            r = new Sy.Storage.Repository(m, 'Bundle::Entity');

        expect(r.findBy('index', 'value', 1) instanceof Promise).toBe(true);
        expect(m.alias).toEqual('Bundle::Entity');
        expect(m.index).toEqual('index');
        expect(m.value).toEqual('value');
        expect(m.limit).toEqual(1);
    });

    it('should return a promise when trying to find one entity by criteria', function () {
        var m = new Manager(),
            r = new Sy.Storage.Repository(m, 'Bundle::Entity');

        expect(r.findOneBy('index', 'value') instanceof Promise).toBe(true);
        expect(m.alias).toEqual('Bundle::Entity');
        expect(m.index).toEqual('index');
        expect(m.value).toEqual('value');
        expect(m.limit).toEqual(1);
    });

    it('should throw if no entity found', function () {
        var m = new Manager(),
            r = new Sy.Storage.Repository(m, 'toreject'),
            thrown = false;

        r.findOneBy('index', 'value').catch(function () {
            thrown = true;
        }).then(function () {
            expect(thrown).toBe(true);
        })
        expect(m.alias).toEqual('toreject');
        expect(m.index).toEqual('index');
        expect(m.value).toEqual('value');
        expect(m.limit).toEqual(1);
    });

    it('should resolve with an entity as argument', function () {
        var m = new Manager(),
            r = new Sy.Storage.Repository(m, 'toresolve');

        r.findOneBy('index', 'value').then(function (d) {
            expect(d instanceof Sy.EntityInterface).toBe(true);
        });
        expect(m.alias).toEqual('toresolve');
        expect(m.index).toEqual('index');
        expect(m.value).toEqual('value');
        expect(m.limit).toEqual(1);
    });
});

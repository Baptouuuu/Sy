/**
 * @venus-library jasmine
 * @venus-include ../../src/functions.js
 * @venus-include ../../src/FactoryInterface.js
 * @venus-include ../../src/RegistryInterface.js
 * @venus-include ../../src/Registry.js
 * @venus-include ../../src/Storage/Repository.js
 * @venus-code ../../src/Storage/RepositoryFactory.js
 */

describe('storage repository factory', function () {
    var Repo = function () {},
        f;

    Repo.prototype = Object.create(Sy.Storage.Repository.prototype);

    beforeEach(function () {
        f = new Sy.Storage.RepositoryFactory();
    });

    it('should throw if setting invalid metadata registry', function () {
        expect(function () {
            f.setMetadataRegistry({});
        }).toThrow('Invalid registry');
    });

    it('should set the metadata registry', function () {
        expect(f.setMetadataRegistry(new Sy.Registry())).toEqual(f);
    });

    it('should throw if setting invalid repositories registry', function () {
        expect(function () {
            f.setRepositoriesRegistry({});
        }).toThrow('Invalid registry');
    });

    it('should set the repositories registry', function () {
        expect(f.setRepositoriesRegistry(new Sy.Registry())).toEqual(f);
    });

    it('should set a new repository', function () {
        f.setMetadataRegistry(new Sy.Registry());
        expect(f.setRepository('foo', Sy.Storage.Repository)).toEqual(f);
    });

    it('should throw if unknown repository alias', function () {
        f.setMetadataRegistry(new Sy.Registry());
        f.setRepositoriesRegistry(new Sy.Registry());

        expect(function () {
            f.make('em', 'unknown');
        }).toThrow('Unknown entity alias "unknown"');
    });

    it('should throw if building repository not inheriting from generic one', function () {
        f.setMetadataRegistry(new Sy.Registry());
        f.setRepositoriesRegistry(new Sy.Registry());
        f.setRepository('foo', function () {});

        expect(function () {
            f.make('em', 'foo');
        }).toThrow('Invalid repository');
    });

    it('should build the repository from the given class', function () {
        f.setMetadataRegistry(new Sy.Registry());
        f.setRepositoriesRegistry(new Sy.Registry());
        f.setRepository('foo', Repo);

        expect(f.make('em', 'foo') instanceof Repo).toBe(true);
    });

    it('should always return the same repo instance', function () {
        f.setMetadataRegistry(new Sy.Registry());
        f.setRepositoriesRegistry(new Sy.Registry());
        f.setRepository('foo', Repo);

        var repo = f.make('em', 'foo');

        expect(f.make('em', 'foo')).toEqual(repo);
    });
});

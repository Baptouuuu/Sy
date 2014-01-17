Sy Javascript Framework
=======================

[![Build Status](https://travis-ci.org/Baptouuuu/Sy.png?branch=develop)](https://travis-ci.org/Baptouuuu/Sy)

## Philosophy

The aim of this framework is to help you build Single-Page Application (SPA). Sy is built around three principles:

- **Fully asynchronous**
- **Avoiding closures (as much as possible)**
- **Building apps not websites**

## Project state

Sy is still in development, but some libraries are already fully functional:

- HTTP manager
- Generator
- Logger
- Mediator (Pub/Sub library)
- Configurator
- Queue
- Registry
- Service container

Bare in mind that until the first release some methods of those libraries may change.

## Documentation

The framework documentation is available in the [wiki](https://github.com/Baptouuuu/Sy/wiki).

## Conventions

### Naming

To declare namespaces, use the `UpperCamelCase` syntax, examples:

- `App.Bundle.Foo.Controller.Bar`
- `App.Bundle.Foo.Entity.Baz`

A "class" naming also use `UpperCamelCase`.

An "instance" or any variables is declared using `lowerCamelCase`.

Services name are `lowercase` and words are separated by a double colon (ie: `foo::bar::baz`).

### Structure

For better scability, Sy uses a strong structure in the namespacing of your app. Your app folder should look something like this:

```
App
 |- Bundle
 |	 |- DefaultBundle
 |	 	 |- Controller
 |	 	 |- Entity
 | 	 	 |- Config
 |	 	 |- Service
 |
 |- Library
 	 |- MyLibrary
```

Your app folder should reflect this namespace structure. If you worry about the number of files you'll have to load, I strongly recommend you to look at [uglifyjs](https://github.com/mishoo/UglifyJS2)

### Contributing

Sy framework uses [gitflow](http://nvie.com/posts/a-successful-git-branching-model/), so any pull request have to be made into develop.

Before submitting new issues, make sure no one already opened a discussion in the [tracker](https://github.com/baptouuuu/sy/issues) related to yours.

Please follow the coding style explained above.

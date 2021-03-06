Sy Javascript Framework
=======================

[![Build Status](https://travis-ci.org/Baptouuuu/Sy.png?branch=develop)](https://travis-ci.org/Baptouuuu/Sy) [develop]

[![Build Status](https://travis-ci.org/Baptouuuu/Sy.png?branch=master)](https://travis-ci.org/Baptouuuu/Sy) [master]

## Philosophy

The aim of this framework is to help you build Single-Page Application (SPA). The goal is not, like all other frameworks, to quickly build an app but instead build a strong code architecture to build build strong, large scale, applications.

## Project state

Sy is still in development, but all the libraries available in the branch `develop` are fully functional.

Bear in mind that until the release 1.0 some methods of those libraries may change.

## Documentation

Please read the framework [book](docs/book/), you should also take a look at the [components documentations](docs/README.md).

## How to use

Head to the [tutorial](docs/tutorial/README.md) to understand step by step how to build an app.

## Conventions

### Naming

To declare namespaces, use the `UpperCamelCase` syntax, examples:

- `App.Bundle.Foo.Controller.Bar`
- `App.Bundle.Foo.Entity.Baz`

A "class" naming also use `UpperCamelCase`.

An "instance" or any variables is declared using `lowerCamelCase`.

Services name are `lowercase` and words are separated by a double colon (ie: `foo::bar::baz`).

### Structure

For better scalability, Sy uses a strong structure in the namespacing of your app. Your app folder should look something like this:

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

Please follow the coding style explained above (Most of the coding style is checked via a grunt task, so any error will appear in travis).

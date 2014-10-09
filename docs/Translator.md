# Translator

The translator provided with the framework offers a basic structure allowing you to store your translations string by language and domains. Domains are just a way to group translated strings so you can better organise your strings (especially when your app becomes bigger).

## Register translations strings

You have two ways of registering translations, one by one like below:
```js
translator.registerTranslation('language', 'domain', 'key', 'translated string');
```
or by set:
```js
translator.registerTranslations('language', [
  {
    domain: 'named group of translations', //optional, default to 'root'
    key: 'key to identify the string',
    translation: 'translated string in the language specified above'
  },
  //etc...
]);
```

## Usage

You can then retrieve a translated string in 3 slightly different ways. The first one below specify globally the target language, so you don't have to use throughout your app the current language when you translate a string.
```js
translator.setLanguage('fr');
var frenchSymphony = translator.translate('symphony');
```

The second way to call `translate` is by passing a domain as second argument:
```js
translator.translate('your key', 'specific domain');
```

The last way is by passing a third argument, this one enforce the target language:
```js
translator.translate('key', 'domain', 'en');
```

**Note**: In all cases if a translation is not found it will return the key.

**Note 2**: If the domain is not specified or set to `null` or `undefined` it will be defaulted to `root`.


## Create

By default the translator comes as a service under the name `translator` (alias of `sy::core::translator`). But you can build your own if you want.
```js
var translator = new Sy.Translator();
translator.setRegistry(new Sy.Registry());
translator.setStateRegistryFactory(app.getContainer().get('sy::core::stateregistry::factory'));
```

The first dependency is used to hold translations at the language level; and the second is used to ease the process of storing actual translations by domains. (See the framework [services declarations](../src/FrameworkBundle/Config/Service.js) to understand how to create a state registry factory);
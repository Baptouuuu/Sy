# Form

This component is used to extract data off a html form element and put it in an object. The component is also used to ease the form validation.

The process is dead simple:

* create a form wrapper
* check if it's valid
* get the data

In code it translate like this:
```js
var form = builder.createFormBuilder({})
    .setName('formId')
    .add('inputName1')
    .add('inputName2')
    .getForm();

form.handle();

if (form.isValid()) {
    form.getObject(); //<- do whatever you want with it
}
```

This sample create a wrapper for the form with the id `formId`, tell we want the values of inputs with the names `inputName1` and `inputName2`. The method `handle` will look in the DOM for the form and set inputs data inside the object passed to the `createFormBuilder` method.

Here the method `isValid` will call the native `checkValidity` method on the form, but below you'll learn how to use the [validator](Validation.md) instead.

## Creation

If you use this component inside the framework, the builder is available as a [service](Service-container.md) under the name `sy::core::form`.

To get a builder up and running, it's straightforward:
```js
var builder = new Sy.Form.Builder();
```

Yes, that's all.

If you want to use the framework validator, you need to inject it in the builder like so:
```js
builder.setValidator(validator);
```

## From the form builder

The `createFormBuilder` method accepts 2 arguments. The first is the object that will hold your data, the second is an option object.

The data object can be either a POJO (`{}`) or your own custom object (say an entity object). The component use [reflection](https://github.com/Baptouuuu/Reflection.js) to inject the data in the object, and supports 3 ways to set the data. First it will look for a specific setter (ie: `set{InputName}`), then for a generic setter and will pass the input name and data (ie: `set(inputName, inputValue)`) and in last it will directly set the value in the object (ie: `object[inputName] = inputValue`).

Here the option object is useful in the case you use the framework validator, in the object you can specify the validation groups used whan calling `form.isValid()`. To specify one, just pass an object like this `{validationGroups: ['group_name']}`.

Once you have called `createFormBuilder`, you have an instance of `Sy.Form.FormBuilderInterface`. At this point, there's only 3 methods you need to care about: `add`, `setName` and `getForm`.

The `add` method is used to define the name of an input inside the form. Inputs defined will have their values injected in the object defined earlier. This method only takes one argument, the input name.

The `setName` method define the CSS id of the form. You can omit this call in the case you pass the form element whan calling `form.handle()`.

`getForm`, as its name indicates, return the instance of the form wrapper (`Sy.Form.FormInterface`).

Let's have a full example:
```js
var User = function () {
        this.name = null;
        this.password = null;
    },
    user,
    form;

User.prototype = {
    setName: function (name) {
        this.name = name;
    },
    setPwd: function (pwd) {
        this.password = pwd;
    }
};

user = new User();

form = builder.createFormBuilder(user, {validationGroups: ['creation']})
    .add('name')
    .add('pwd')
    .getForm();

form.handle(formElement); //formElement instanceof HTMLFormElement, here the form data is injected in the user

form.isValid(); //if framework validator set, it will validate `user` with the validation group `creation`

form.getObject(); //instanceof User
form.getObject().name; //=== name input value
form.getObject().password; //=== pwd input value
form.getObject().pwd; //=== undefined
```

## From a form type

Using the form builder is simple, but not really DRY if you want to reuse a form elsewhere in your app. A form type is a class where you define the elements that should be used in the form, validation groups and the path string to the class that should be used to hold the form data.

First when creating a form type, it must implement `Sy.Form.FormTypeInterface`.

Example:
```js
MyFormType = function () {};
MyFormType.prototype = Object.create(Sy.Form.FormTypeInterface.prototype, {

    buildForm: {
        value: function (builder, options) {
            //builder instanceof Sy.Form.FormBuilderInterface
            //options instanceof Sy.ConfiguratorInterface

            builder.add('input name');
        }
    },

    setDefaultOptions: {
        value: function (options) {
            options.set({
                dataClass: 'User',
                validationGroups: ['42']
            });
        }
    },

    getName: {
        value: function () {
            return 'form name';
        }
    }

});
```

Above we defined a form wrapper for one called `form name`, it will get the value of the `input name` input and will inject it in an instance of `User`. When validated, it will do it with the group `42`.

Now to get a form wrapper we can do it like this:
```js
var form = builder.createForm(new MyFormType());
```

If you call `form.getObject()` it will return an instance of `User`. But if you already have an instance of a user and want to use it to get form data, you can do it like this:
```js
var user = new User(),
    form = builder.createForm(new MyFormType(), user);
```

The `createForm` method also can take a third argument, which is an option object. You can use it to modify the elements added to the form.

Example:
```js
//MyFormType.js
buildForm: {
    value: function (builder, options) {
        if (options.get('myKey') === 'some value') {
            builder.add('input1');
        } else {
            builder.add('input2');
        }
    }
}
//...

var form = builder.createForm(new MyFormType(), undefined, {myKey: 'some value'});
```
Here `form` will only handle `input1`.

With `MyFormType` you can easily reuse it wherever you want in your app, however you still have to know where it's defined which is not great if you want to loose coupling. Fortunately, you can register your form type in the component, so you'll only have to know its name to use it.

Example:
```js
builder.registerFormType(new MyFormType());
var form = builder.createForm('form name');
```

The string used here is the one returned by `MyFormType.getName()`, so be careful in the naming to not overrideyour form types.
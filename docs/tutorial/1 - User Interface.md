# User Interface

Like in any project, the first thing to do is build what the app will look like.

For the address book there's 3 pages to build. The home to display all the profiles, the create page and another one to edit the profile.

As the framework intends, we're building a SPA, so all of our html will be contained in a signle `index.html` file.

**Note**: [Polymer](https://www.polymer-project.org) has been used to build the UI faster, but this tutorial won't explain how to use it.

## Boilerplate

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Address Book</title>
        <link rel="stylesheet" href="style.css">
        <link rel="import" href="vendor/core-toolbar/core-toolbar.html">
        <link rel="import" href="vendor/core-icons/core-icons.html">
        <link rel="import" href="vendor/core-input/core-input.html">
        <link rel="import" href="vendor/paper-icon-button/paper-icon-button.html">
        <link rel="import" href="vendor/paper-shadow/paper-shadow.html">
        <link rel="import" href="vendor/paper-toast/paper-toast.html">
        <link rel="stylesheet" href="vendor/bootstrap/dist/css/bootstrap.min.css">
    </head>
    <body>
        <section class="viewport"></section>
    </body>
</html>
```

At this point, nothing fancy. The only thing to notice here is the `section` in the `body`. This is the first part of the framework, later when you'll ask the framework to display a viewscreen it will inject the dom element in this `section`.

A good practice is to put your viewscreen alongside this viewport, and of course hide everything outside (so only the viewport is displayed).

## Home

Here's the html for this page:
```html
<section data-sy-view="home">
    <core-toolbar class="toolbar">
        <input class="search" placeholder="Search a contact" flex />
        <paper-icon-button icon="add"></paper-icon-button>
        <paper-shadow z="1"></paper-shadow>
    </core-toolbar>
    <section class="contacts">
        <div flex horizontal layout wrap>
            <div class="contact-card" horizontal layout>
                <img src="http://www.gravatar.com/avatar/00000000000000000000000000000000?s=125" alt="" >
                <div class="infos" flex self-center>
                    <div class="line">firstname lastnamediv>
                    <div class="line">address</div>
                    <div class="line">zipcode citydiv>
                    <div class="line">phone</div>
                </div>
                <paper-shadow z="1"></paper-shadow>
            </div>
        </div>
    </section>
</section>
```
So here we only have a toolbar with a search field and a button to create a profile; and a list with only one profile for now.

Notice the `data-sy-view` on the main element, the value of this attribute defines the name of the viewscreen. This is this name that you'll always use in the framework for everything related to viewscreens.

## Create

```html
<section data-sy-view="create">
    <core-toolbar class="toolbar">
        <paper-icon-button icon="arrow-back"></paper-icon-button>
        <span flex>New profile</span>
        <paper-icon-button icon="check"></paper-icon-button>
        <paper-shadow z="1"></paper-shadow>
    </core-toolbar>
    <section class="profile-edit" horizontal layout>
        <form class="form-horizontal">
            <div class="form-group">
                <label for="firstname" class="col-sm-2 control-label">Firstname</label>
                <div class="col-sm-8">
                    <input id="firstname" name="firstname" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="lastname" class="col-sm-2 control-label">Lastname</label>
                <div class="col-sm-8">
                    <input id="lastname" name="lastname" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="picture" class="col-sm-2 control-label">Picture</label>
                <div class="col-sm-8">
                    <input id="picture" name="picture" type="file" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="phone" class="col-sm-2 control-label">Phone</label>
                <div class="col-sm-4">
                    <input id="phone" name="phone" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="address" class="col-sm-2 control-label">Address</label>
                <div class="col-sm-8">
                    <input id="address" name="address" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="zip" class="col-sm-2 control-label">Zipcode</label>
                <div class="col-sm-2">
                    <input id="zip" name="zipcode" class="form-control">
                </div>
                <label for="city" class="col-sm-1 control-label">City</label>
                <div class="col-sm-5">
                    <input id="city" name="city" class="form-control">
                </div>
            </div>
        </form>
        <paper-toast class="error" text="Some values are incorrect"></paper-toast>
    </section>
</section>
```
Just a standard form and buttons in the toolbar to go back to the list and another one to create the profile.

## Edit

```html
<section data-sy-view="edit">
    <core-toolbar class="toolbar">
        <paper-icon-button icon="arrow-back"></paper-icon-button>
        <span flex>Fullname</span>
        <paper-icon-button icon="check"></paper-icon-button>
        <paper-icon-button icon="delete"></paper-icon-button>
        <paper-shadow z="1"></paper-shadow>
    </core-toolbar>
    <section class="profile-edit" horizontal layout>
        <form class="form-horizontal" flex>
            <div class="form-group">
                <label for="firstname" class="col-sm-2 control-label">Firstname</label>
                <div class="col-sm-8">
                    <input id="firstname" name="firstname" class="form-control" value="firstname">
                </div>
            </div>
            <div class="form-group">
                <label for="lastname" class="col-sm-2 control-label">Lastname</label>
                <div class="col-sm-8">
                    <input id="lastname" name="lastname" class="form-control" value="lastname">
                </div>
            </div>
            <div class="form-group">
                <label for="picture" class="col-sm-2 control-label">Picture</label>
                <div class="col-sm-8">
                    <input id="picture" name="picture" type="file" class="form-control">
                </div>
            </div>
            <div class="form-group">
                <label for="phone" class="col-sm-2 control-label">Phone</label>
                <div class="col-sm-4">
                    <input id="phone" name="phone" class="form-control" value="phone">
                </div>
            </div>
            <div class="form-group">
                <label for="address" class="col-sm-2 control-label">Address</label>
                <div class="col-sm-8">
                    <input id="address" name="address" class="form-control" value="address">
                </div>
            </div>
            <div class="form-group">
                <label for="zip" class="col-sm-2 control-label">Zipcode</label>
                <div class="col-sm-2">
                    <input id="zip" name="zipcode" class="form-control" value="zipcode">
                </div>
                <label for="city" class="col-sm-1 control-label">City</label>
                <div class="col-sm-5">
                    <input id="city" name="city" class="form-control" value="city">
                </div>
            </div>
        </form>
        <div class="profile-picture" flex horizontal layout center-justified>
            <img src="pictureUrl" alt="" self-center>
        </div>
        <paper-toast class="error" text="Some values are incorrect"></paper-toast>
        <paper-toast class="saved" text="Profile saved"></paper-toast>
    </section>
</section>
```
Here we have the same form as the one to create a profile, and we also display the profile picture on the right. And in the toolbar a new button to remove the profile.

## Conclusion

Nothing hard in this first step. Just remind that `data-sy-view` attribute value on your viewscreen element define its name in the framework.

The `.viewport` element is where a viewscreen is displayed, hence everything outside it must be hidden.

Also keep in mind to declare your viewscreens alongside this viewport.

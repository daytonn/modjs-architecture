# modjs-architecture [![Build Status](https://secure.travis-ci.org/daytonn/modjs-architecture.png)](http://travis-ci.org/daytonn/modjs-architecture)

##About

Mod.js is a small Javascript framework for building large javascript applications. The goal of Mod.js is to provide a solid foundation from which to build your javascript application. Combined with the ArchitectureJS build tool, modjs-architecture is a cohesive javascript development workflow.

##Installation
It's easiest to install modjs-architecture through rubygems like this:

	gem install modjs-architecture

You can also include it in your project's Gemfile

	gem 'modjs-architecture'

## Getting Started
To create your modjs application, use the architect command using the modjs blueprint:

	architect create myapp example -b modjs

This will create the myapp application in the example folder (creating the folder if it does not exist) with the modjs scaffolding. Now your ready to build your application.

## The Application object
Mod.js creates an application object which acts as a namespace for your entire application. This global variable will encapsulate most of the code in your web application and act as the central hub of your modules.

The application object really couldn't be much simpler. It has one method and one property. The name property is just a string that identifys the object. It's only method is add_module, which creates a new module, adds that module as a property, and returns a reference to the new module. This method's only purpose is to attach a new module to the global namespace.

```js
myapp.add_module('dashboard'); // creates myapp.dashboard module
```

## Modules
Modules are the heart of a modjs application. They're not exactly controllers and they're not exactly classes but they share a lot of the same responsibilities as you'd expect from these classical constructs. Modules are based on the typical browser-based workflow. Wait for the DOM, when it's ready attach events, setup plugins, and ajax the shit out of it, etc.

Mod.js modules encapsulate this common pattern and create a coherent way to design and create javascript solutions. Modules are only slightly more sophisticated than the application object itself. A modules two main method's are actions and run.

Calling run will wait for the dom to be loaded and then call the actions method. By default, the actions method does nothing. You will provide the code for the actions method. The actions method should follow the composed method pattern, a simple list of functions to call when the dom is ready. An example of a typical module looks something like this:

```js
(function(app) {
    var m = app.add_module('dashboard');

    m.actions = function() {
        setup_tabbed_navigation();
        open_external_links_in_new_tab();
    };

    m.run();

    // Private methods

    function setup_tabbed_navigation() {
        $('#navigation').tabs();
    }

    function open_external_links_in_new_tab() {
        var links = $('a');
        var re_local = new RegExp(location.hostname);
        var external_links = links.filter(function(i, link) {
            if (is_defined($(link).attr('href'))) {
                if (href.match(/^https?\:\/\//) && !re_local.test(href)) {
                    return true;
                }
            }
        });
        external_links.attr('target', '_blank');
    }
})(myapp);
```

This probably looks similar to the code you write currently, Mod.js simply makes it formal. Let's take a tour through this module.

Notice that the entire module is wrapped in a closure. This creates a private scope specific to this module. Public methods and properties can be created by attaching them to the module, private properties and methods are simply defined inside the closure, with no connection to the global scope. Also notice that the application object is passed into the closure and aliased as `app`. This means if application name changes or you wish to copy this module into another application, you only need to change the name in one place. It also has the added advantage of being short when referencing the namespace.

Next is the module instantiation: `var m = app.add_module('dashboard')`. This line adds a new Mod.js module to the application and returns a reference to that module to be stored as `m`. This serves multiple purposes. For one, it provides a concrete reference to the current module, we won't have to juggle the `this` variable throughout the code. It also serves to attach public methods and properties to the module's scope.

Next we see the `actions` method declaration. This is where we put all the code we wish to run when the DOM is ready to be manipulated. Notice that the `setup_tabbed_navigation` method and the `open_external_links_in_new_tab` method are both defined as private methods inside the closure. By using this pattern, only the `dashboard` module has access to these methods. If we wanted to make these methods publicly accessible, simply add the methods to the module namespace. The previous module re-written with public methods would look like this:

```js
(function(app) {
    var m = app.add_module('dashboard');

    m.actions = function() {
        m.setup_tabbed_navigation();
        m.open_external_links_in_new_tab();
    };

    m.setup_tabbed_navigation = function() {
        $('#navigation').tabs();
    };

    m.open_external_links_in_new_tab = function() {
        var links = $('a');
        var re_local = new RegExp(location.hostname);
        var external_links = links.filter(function(i, link) {
            if (is_defined($(link).attr('href'))) {
                if (href.match(/^https?\:\/\//) && !re_local.test(href)) {
                    return true;
                }
            }
        });
        external_links.attr('target', '_blank');
    }

    m.run();
})(myapp);
```

This makes these methods available publicly through the application namespace. For example, if we wanted to call the `open_external_links_in_new_tab` in another module, we could do the following:

```js
(function(app){
    var m = app.add_module('some_other_module');

    m.actions = function() {
        app.dashboard.open_external_links_in_new_tab();
    }

    m.run();
})(myapp);
```

You should avoid modules having knowledge of other modules, but it can be handy when solving certain kinds of problems. Most of the time you won't need too many publicly available methods so keeping them hidden to the global scope is a great idea.

## ArchitectureJS and the Sprockets engine

Other than establishing a namespace and providing this simple module API, Mod.js does little else to influence how you write your application. Part of what makes Mod.js such a pleasure to work with is the ArchitectureJS build system and the Sprockets engine.

Sprockets is a javascript concatenation engine, written in ruby (which eventually became the Rails asset pipeline). Sprockets allows you to concatenate scripts together using special comments called directives. These directives tell Sprockets to search for the file in the project's load path an include it in the compiled source. To learn more about Sprockets directives please view the [Sprockets documentation](http://daytonn.github.com/architecture-js/sprockets.html) on the ArchitectureJS website.

ArchitectureJS is a build system for javascript that is similar to the [compass](https://github.com/chriseppstein/compass) css preprocessor. Using Sprockets directives, ArchitectureJS will compile your application scripts into the build directory with all of their dependencies included.

To learn more about using ArchitectureJS visit [https://github.com/daytonn/architecture-js](https://github.com/daytonn/architecture-js)

## Requiring support files
The modules and application directories contain the main scripts of your application, you may be wondering what all the other folders are used for. Using the Sprockets `//= require` directive, we can include scripts from these other directories into our modules and application file. This let's us divide our code into logical pieces on the filesystem. Let's look at an example of using the require directive in the `dashboard` module we defined earlier:

```js
//= require "../plugins/foo"

(function(app) {
    var m = app.add_module('dashboard');

    ...
})(myapp);
```

This module assumes that a `foo.js` file exists inside the `plugins` directory. This line will find that file and include it in the dashboard.js file that is compiled into the application directory. Notice that the file is referenced from the application folder so the `require` line needs the `../` prepended to the path. Also notice that we do not need to add the `.js` because Sprockets only compiles javascript files. In this way you can manage all the dependencies of a given module without including another script tag in your application.

The plugins, lib, and test directories are just arbitrary folders for various script assets. The elements and models directories have special meaning to the modjs framework.

## Elements

In this day and age of javascript programming, it seems everyone starts with a DOM polyfill like jQuery or Prototype. Using these frameworks, it's become practice to cache the DOM selections so the element can be referenced many times without querying the DOM again. In practice this means that our code tends to be littered with statements querying the DOM for specific elements to be acted on. At best they are all defined in one place. At worst they are strewn about the code making it easy for teams to duplicate effort and create inefficient code. Either way it can end up creating a lot of noise in our scripts amd can become hard to manage. Mod.js solves this problem by using `//= require` to separate the DOM selections from the module file that uses those elements to define behavior. This keeps our module file clean and only concerned with behavior. Let's take a look at how this might look in practice, again using the `dashboard` module example:

```js
(function(app) {
    var m = app.add_module('dashboard');

    //= require "../elements/dashboard.elements"

    m.actions = function() {
        setup_tabbed_navigation();
        open_external_links_in_new_tab();
    };

    ...
})(myapp);
```

We `require` the /elements/dashboard.elements.js _inside_ the module closure. This is necessary to use the `m` variable that is only available inside the closure. Let's take a look at the dashboard.elements file and how it interacts with it's module:

```js
    m.elements({
        navigation: $('#navigation'),
        links: $('a')
    });
```

The elements method is defined by `Mod.Module` and simply let's you create an object hash of named selectors. To set an element property of a module simply provide an object with a key (name of the element property) and a cached selector (in this case a jQuery object). To retrieve the cached selector simply call `elements` and pass it the name of the element you wish to retrieve. To access the navigation element we've cached we would write this: 

```js
m.elements('navigation'); // $('#navigation')
```

Now we need to update the dashboard.module file to use the new cahced selectors:

```js
(function(app) {
    var m = app.add_module('dashboard');

    m.actions = function() {
        setup_tabbed_navigation();
        open_external_links_in_new_tab();
    };

    m.run();

    // Private methods

    function setup_tabbed_navigation() {
        m.navigation.tabs();
    }

    function open_external_links_in_new_tab() {
        var re_local = new RegExp(location.hostname);
        var external_links = m.elements('links').filter(function(i, link) {
            if (is_defined($(link).attr('href'))) {
                if (href.match(/^https?\:\/\//) && !re_local.test(href)) {
                    return true;
                }
            }
        });
        external_links.attr('target', '_blank');
    }
})(myapp);
```

Notice in `setup_tabbed_navigation`, `$('#navigation')` became `m.elements('navigation')` and in `open_external_links_in_new_tab`, `$('a')` became `m.elements('links')`. Before you start thinking that this is overkill consider what this allows us to do. If we decide to swap out jQuery for another framework like Prototype, we have one place to change all the selections for all modules. Even if we don't ever change frameworks, this elements method can be extended to provide extra functionality. This wrapper technique helps us stay agile by abstracting the method of selection from the practice.

## Models ##

Coming soon...

###contributing to modjs-architecture
 
* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it
* Fork the project
* Start a feature/bugfix branch
* Commit and push until you are happy with your contribution
* Make sure to add tests for it. This is important so I don't break it in a future version unintentionally.
* Please try not to mess with the Rakefile, version, or history. If you want to have your own version, or is otherwise necessary, that is fine, but please isolate to its own commit so I can cherry-pick around it.

##Copyright

Copyright (c) 2011 Dayton Nolan. See LICENSE.txt for
further details.


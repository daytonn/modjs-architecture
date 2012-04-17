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

Next is the module instantiation: `var m = app.add_module('dashboard')`. This line adds a new Mod.js module to the application and returns a reference to that module to be stored as `m`. This serves multiple purposes. For one, it provides a concrete reference to the current module, you won't have to juggle the `this` variable throughout the code. It also serves to attach public methods and properties to the module's scope.

Next, see the `actions` method declaration. This is where to put all the code which runs when the DOM is ready to be manipulated. Notice that the `setup_tabbed_navigation` method and the `open_external_links_in_new_tab` method are both defined as private methods inside the closure. By using this pattern, only the `dashboard` module has access to these methods. If you wanted to make these methods publicly accessible, simply add the methods to the module namespace. The previous module re-written with public methods would look like this:

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

This makes these methods available publicly through the application namespace. For example, to call `open_external_links_in_new_tab` from another module, do the following:

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
The modules and application directories contain the main scripts of your application, you may be wondering what all the other folders are used for. Using the Sprockets `//= require` directive, you can include scripts from these other directories into the modules or application file. This let's us divide code into logical pieces on the filesystem. Let's look at an example of using the require directive in the `dashboard` module used earlier:

```js
//= require "../plugins/foo"

(function(app) {
    var m = app.add_module('dashboard');

    ...
})(myapp);
```

This module assumes that a `foo.js` file exists inside the `plugins` directory. This line will find that file and include it in the dashboard.js file that is compiled into the application directory. Notice that the file is referenced from the application folder so the `require` line needs the `../` prepended to the path. Also notice that you do not need to add the `.js` because Sprockets only compiles javascript files. In this way you can manage all the dependencies of a given module without including another script tag in your application.

The `plugins`, `lib`, and `spec` directories are just arbitrary folders for various script assets (although some of them contain resources you may want/need). Feel free to add your own folders to organize your scripts in whatever way you feel comfortable. BE SURE NOT TO REMOVE OR RENAME THE `lib` folder because it contains a copy of the mod.js library that get's compiled into the application file. The `elements` and `models` directories have special meaning to the modjs framework.

## Elements

In this day and age of javascript programming, it seems everyone starts with a DOM polyfill like jQuery or Prototype. Using these frameworks, it's become practice to cache the DOM selections so the element can be referenced many times without querying the DOM again. In practice this means that the code tends to be littered with statements querying the DOM for specific elements to be acted on. At best they are all defined in one place. At worst they are strewn about the code making it easy for teams to duplicate effort and create inefficient code. Either way it can end up creating a lot of noise in scripts and can become hard to manage. Mod.js solves this problem by using `//= require` to separate the DOM selections from the module file that uses those elements to define behavior. This keeps the module file clean and only concerned with behavior. Let's take a look at how this might look in practice, again using the `dashboard` module example:

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

The elements method is defined by `Mod.Module` and simply let's you create an object hash of named selectors. To set an element property of a module simply provide an object with a key (name of the element property) and a cached selector (in this case a jQuery object). To retrieve the cached selector simply call `elements` and pass it the name of the element you wish to retrieve. To access the cached navigation element: 

```js
m.elements('navigation'); // $('#navigation')
```

Now to update the dashboard.module file to use the new cahced selectors:

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

Notice in `setup_tabbed_navigation`, `$('#navigation')` became `m.elements('navigation')` and in `open_external_links_in_new_tab`, `$('a')` became `m.elements('links')`. Before you start thinking that this is overkill consider what this allows us to do. If you decide to swap out jQuery for another framework like Prototype, there's one place to change all the selections for all modules. Even if you don't ever change frameworks, this elements method can be extended to provide extra functionality not provided by the framework. This wrapper technique helps us stay agile by abstracting the method of selection from the practice.

## Models

Models in Mod.js are simply json structures that are owned by the module. Each module has a data attribute that is basically a key-value store of basic properties shared throughout the module. The idea behind this is similar to the elements abstraction. Many times we use several object literals to define configuration or other miscellaneous tasks. Models formalize these otherwise autonomous pieces of data. Here's how a using models in Mod.js works:

```js
(function(app) {
    var m = app.add_module('dashboard');

    //= require "../elements/dashboard.elements"
    //= require "../models/dashboard.model"

    m.actions = function() {
        setup_tabbed_navigation();
        open_external_links_in_new_tab();
    };

    ...
})(myapp);
```

Now that the model is included in our module we can use the `dashboard.model.js` file to attach data to our module. Using the simple example of a plugin configuration object, we'll add configuration data to the `tabs` plugin being used by `setup_tabbed_navigation`:

```js
    m.set_data('tab_config', {
        selectedTab: 2,
        transition: 'fade'
    });
```

This is a made up example of a configuration object used on the fictional `tabs` plugin used in `setup_tabbed_navigation`. Now that the data is defined in the model, we can access it in the module like so:

```js
    ...
    function setup_tabbed_navigation() {
        m.navigation.tabs(m.data.tab_config);
    }
    ...
```

This way we can reuse the `m.data.tab_config` in the module without having to redefine the object literal each time we use the plugin. We can even use jQuery's extend method to modify parts of the config while keeping the defaults. Using the previous example, we can easily use the `tab_config` data to setup another instance of the tab plugin with slightly different configuration:

```js
    ...
    function setup_tabbed_navigation() {
        m.navigation.tabs(m.data.tab_config);
        m.some_other_tabs($.extend({ selectedTab: 1 }, m.data.tab_config));
    }
    ...
```

This way we can reuse as much as possible and are only definig the difference between the default and the custom plugin instantiation.

## Conclusion

That's pretty much Mod.js in a nutshell. It focuses on providing a solid base for modern javscript web development. The simple abstraction adhere's to best practices and let's ou focus on building features and not managing a mess of scripts and scopes. Happy scripting ;)

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


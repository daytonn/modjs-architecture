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

## ArchitectureJS and the Sprockets engine ##

... To be continued

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


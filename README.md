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
Modules are the heart of a modjs application. They're not exactly controllers and they're not exactly classes but they share a lot of the same responsibilities as you'd expect from these classical constructs. Modules are based on the typical browser-based workflow. Wait for the DOM, when it's ready attach events, setup plugins, and ajax the shit out of it.

Mod.js modules encapsulate this common pattern and create a coherent way to design and create javascript solutions. Modules are only slightly more sophisticated than the application object itself. A modules two main method's are actions and run.

Calling run will wait for the dom to be loaded and then call the actions method. By default, the actions method does nothing. You will provide the code for the actions method. The actions method is a composed method

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


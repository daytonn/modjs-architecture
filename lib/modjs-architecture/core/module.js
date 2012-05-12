//## Mod.Module

// Modules are responsible for defining the specific behavior
// of pieces of your application. All the functionality of your 
// application will be defined in modules.
Mod.Module = (function() {

    // Each module contains a `dom` property which is a [Mod.DOM](dom.html) 
    // instance to act as the module's API to the DOM. The `data` attribute 
    // is a simple object literal that serves to store module-wide configuration 
    // and properties (which prevents polluting the modules namespace and collision with public methods). 
    // The `name` property is a convenience to be able to ask a module it's name.
    function Module(name) {
        if (isUndefined(name)) {
            throw new Error("Mod.Module(name): name is undefined");
        }

        this.dom = new Mod.DOM;
        this.data = {};
        this.name = name;
    }

    //### init
    // The init method is a placholder to be overwritten in each instance
    Module.prototype.init = function() {};

    //### initWhenReady
    // Wait for the DOM to be ready and execute the actions
    Module.prototype.initWhenReady = function() {
        var mod = this;
        this.dom.callWhenReady(mod.init);
    };

    //### elements
    // Serves as an api to set and get elements from the module's `dom` property.
    // passing a string retrieves an element, passing an object sets elements
    Module.prototype.elements = function(elements) {
        if (isUndefined(elements)) {
            return this.dom.cache;
        }

        // Look up cached element by string key
        if (isString(elements)) {
            var name = elements;
            return this.dom.cache[name];
        }
        // cache the DOM objects
        else {
            this.dom.addElements(elements);
        }
    };

    //### setData
    // Convenience method to add properties to the `data` property of the module
    Module.prototype.setData = function(key, value) {
        if (isUndefined(key)) {
            throw new Error(this.name + '.setData(key, value): key is undefined');
        }

        if (isTypeof(String, key) && isUndefined(value)) {
            throw new SyntaxError(this.name + 'Module.setData(key, value): value is undefined');
        }

        if (isTypeof(String, key)) {
            this.data[key] = value;
        }
        else if (isTypeof(Object, key)) {
            var data = key;
            for(var property in data) {
                this.data[property] = data[property];
            }
        }

        return this;
    };

    return Module;
})();

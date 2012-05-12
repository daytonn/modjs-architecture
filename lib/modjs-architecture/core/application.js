//## Mod.Application

// The application object serves as a basic namespace for your application
// with a convenience method for attaching modules.
Mod.Application = (function() {

    // Constructing an application requires a name.
    function Application(name) {
        if (isUndefined(name)) {
            throw new Error("new Mod.Application(name): name is undefined");
        }

        this.name = name;
    }

    //### addModule
    // A factory method to attach modules to the application object.
    // This method makes sure to avaoid naming collisions
    Application.prototype.addModule = function(name) {
        if (isUndefined(name)) {
            throw new Error("Mod.Application.addModule(name): name is undefined");
        }

        if (isDefined(this[name])) {
            throw new Error("Mod.Application.addModule('" + name + "'): '" + name + "' already declared");
        }

        if (this.name === name) {
            throw new Error("Mod.Application.addModule('" + name + "'): a module cannot have the same name as the application. It's bad idea. Do you really want to write " + name + "." + name + "? It's confusing.'");
        }

        return this[name] = new Mod.Module(name);
    };

    // Return the application object as a reference
    return Application;
})();

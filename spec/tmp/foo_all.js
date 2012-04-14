(function(app) {
    var m = app.add_module("foo_all");

    //= require "../elements/foo_all.elements"

    //= require "../models/foo_all.model"

    m.actions = function() {
        
    }

    m.run();
})(myapp);
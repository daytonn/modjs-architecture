(function(app) {
    var m = app.add_module("foo_all");

    //= require "../elements/foo_all.elements"

    //= require "../models/foo_all.model"

    m.init = function() {
        
    };

    m.init_when_ready();

})(myapp);
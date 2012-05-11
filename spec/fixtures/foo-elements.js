(function(app) {
    var m = app.add_module("foo-elements");

    //= require "../elements/foo-elements.elements"

    m.init = function() {
        
    };

    m.init_when_ready();

})(myapp);
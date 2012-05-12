(function(app) {
    var m = app.addModule("foo_elements");

    //= require "../elements/foo_elements.elements"

    m.init = function() {
        
    };

    m.initWhenReady();

})(myapp);
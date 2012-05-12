(function(app) {
    var m = app.addModule("foo-elements");

    //= require "../elements/foo-elements.elements"

    m.init = function() {
        
    };

    m.initWhenReady();

})(myapp);
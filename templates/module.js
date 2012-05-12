(function(app) {
    var m = app.addModule("<%= arguments[1].gsub(/^_/, '') %>");
<% if options[:e] %>

    //= require "../elements/<%= arguments[1] %>.elements"
<% end %>
<% if options[:m] %>

    //= require "../models/<%= arguments[1] %>.model"
<% end %>

    m.init = function() {
        
    };

    m.initWhenReady();

})(<%= blueprint[:name] %>);
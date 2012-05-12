describe("Mod.Application", function() {

  it("should require a name attribute", function() {
    expect(function() {
      var app = new Mod.Application;
    }).toThrow("new Mod.Application(name): name is undefined");
    
  });

  it("should create a new application instance", function() {
    var app = new Mod.Application('app');
    expect(app).toBeTruthy();
    expect(app.name).toEqual('app');
  });

  it("should have a module factory method", function() {
    var app = new Mod.Application('app');
    app.addModule('foo');
    expect(app.foo).toBeTruthy();
    expect(app.foo.name).toEqual('foo');
  });

});
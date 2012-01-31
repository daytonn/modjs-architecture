describe("Mod.DOM", function() {
    var dom;

    beforeEach(function() {
        dom = new Mod.DOM;
    });

    it("should have an is_ready flag", function() {
        expect(is_bool(dom.is_ready)).toBeTruthy();
    });

    it("should have a cache", function() {
        expect(dom.cache).toEqual({});
    });

    it("should add elements when the DOM is ready", function() {
        
    });
});
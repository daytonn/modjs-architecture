describe("Mod.DOM", function() {
    var dom;

    beforeEach(function() {
        dom = new Mod.DOM;
    });

    it("should have a cache", function() {
        expect(dom.cache).toEqual({});
    });

    it("should have an is_ready property", function() {
        expect(is_bool(dom.is_ready)).toBeTruthy();
    });

    it("should add an element to the cache", function() {
        dom.add_element('foo', document.getElementById('body'));
        expect(dom.cache.foo).toEqual(document.getElementById('body'));
    });

    it("should add a hash of elements to the cache", function() {
        dom.add_elements({
            bar: document.getElementsByTagName('html')[0],
            baz: document.getElementsByTagName('head')[0]
        });

        expect(dom.cache.bar).toEqual(document.getElementsByTagName('html')[0]);
        expect(dom.cache.baz).toEqual(document.getElementsByTagName('head')[0]);
    });

    it("should have an add_event method", function() {
        expect(dom.add_event).toBeTruthy();
    });

    it("should have a remove_event method", function() {
        expect(dom.remove_event).toBeTruthy();
    });

    it("should have a call_when_ready method", function() {
        dom.call_when_ready(function() {
            var body = document.getElementsByTagName('body')[0],
                h1 = document.createElement('h1');

                h1.setAttribute('id', 'foo');
                body.appendChild(h1);
                expect(document.getElementById('foo')).toBeTruthy();
        });
    });
});
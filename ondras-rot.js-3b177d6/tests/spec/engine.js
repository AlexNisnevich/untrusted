describe("Engine", function() {
	var RESULT = 0;
	var E = null;
	var A50 = {getSpeed: function() { return 50; }, act: function() { RESULT++; } };
	var A70 = {getSpeed: function() { return 70; }, act: function() { RESULT++; E.addActor(A100); } };
	var A100 = {getSpeed: function() { return 100; }, act: function() { E.lock(); } };

	beforeEach(function() {
		RESULT = 0;
		E = new ROT.Engine();
	});

	it("should stop when locked", function() {
		E.addActor(A50);
		E.addActor(A100);

		E.start();
		expect(RESULT).toEqual(0);
	});

	it("should run until locked", function() {
		E.addActor(A50);
		E.addActor(A70);
		E.start();
		expect(RESULT).toEqual(2);
	});

	it("should run only when unlocked", function() {
		E.addActor(A70);
		E.lock();
		E.start();
		expect(RESULT).toEqual(0);
		E.start();
		expect(RESULT).toEqual(1);
	});

});

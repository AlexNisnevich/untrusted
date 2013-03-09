describe("RNG", function() {
	describe("getUniform", function() {
		var value = ROT.RNG.getUniform();
		it("should return a number", function() {
			expect(typeof(value)).toEqual("number");
		});
		it("should return a number 0..1", function() {
			expect(value).toBeGreaterThan(0);
			expect(value).toBeLessThan(1);
		});
	});

	describe("seeding", function() {
		it("should return a seed number", function() {
			expect(typeof(ROT.RNG.getSeed())).toEqual("number");
		});

		it("should return the same value for a given seed", function() {
			var seed = Math.round(Math.random()*1000000);
			ROT.RNG.setSeed(seed);
			var val1 = ROT.RNG.getUniform();
			ROT.RNG.setSeed(seed);
			var val2 = ROT.RNG.getUniform();
			expect(val1).toEqual(val2);
		});

		it("should return a precomputed value for a given seed", function() {
			ROT.RNG.setSeed(12345);
			var val = ROT.RNG.getUniform();
			expect(val).toEqual(0.01198604702949524);
		});
	});
	
	describe("state manipulation", function() {
		it("should return identical values after setting identical states", function() {
			ROT.RNG.getUniform();
			
			var state = ROT.RNG.getState();
			var val1 = ROT.RNG.getUniform();
			ROT.RNG.setState(state);
			var val2 = ROT.RNG.getUniform();

			expect(val1).toEqual(val2);
		});
	});

});

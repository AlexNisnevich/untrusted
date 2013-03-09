describe("Display", function() {
	describe("drawText", function() {
		it("should provide default maxWidth", function() {
			var d = new ROT.Display({width:10, height:10});
			var lines = d.drawText(7, 0, "aaaaaa");
			expect(lines).toBe(2);
		});
	});

	describe("computeSize", function() {
		describe("rectangular layout", function() {
			var d1 = new ROT.Display({fontSize:18, spacing:1});
			var d2 = new ROT.Display({fontSize:18, spacing:1.2});

			it("should compute integer size for spacing 1", function() {
				var size = d1.computeSize(1/0, 180);
				expect(size[1]).toBe(10);
			});

			it("should compute fractional size for spacing 1", function() {
				var size = d1.computeSize(1/0, 170);
				expect(size[1]).toBe(9);
			});

			it("should compute integer size for spacing >1", function() {
				var size = d2.computeSize(1/0, 220);
				expect(size[1]).toBe(10);
			});

			it("should compute fractional size for spacing >1", function() {
				var size = d2.computeSize(1/0, 210);
				expect(size[1]).toBe(9);
			});
		});

		describe("hex layout", function() {
			var d1 = new ROT.Display({fontSize:18, spacing:1, layout:"hex"});
			var d2 = new ROT.Display({fontSize:18, spacing:1.2, layout:"hex"});

			it("should compute size for spacing 1", function() {
				var size = d1.computeSize(1/0, 96);
				expect(size[1]).toBe(5);
			});

			it("should compute size for spacing >1", function() {
				var size = d2.computeSize(1/0, 96);
				expect(size[1]).toBe(4);
			});
		});
	});

	describe("computeFontSize", function() {
		describe("rectangular layout", function() {
			var d1 = new ROT.Display({width:100, height:20, spacing:1});
			var d2 = new ROT.Display({width:100, height:20, spacing:1.2});

			it("should compute integer size for spacing 1", function() {
				var size = d1.computeFontSize(1/0, 180);
				expect(size).toBe(9);
			});

			it("should compute fractional size for spacing 1", function() {
				var size = d1.computeFontSize(1/0, 170);
				expect(size).toBe(8);
			});

			it("should compute integer size for spacing >1", function() {
				var size = d2.computeFontSize(1/0, 180);
				expect(size).toBe(7);
			});

			it("should compute fractional size for spacing >1", function() {
				var size = d2.computeFontSize(1/0, 170);
				expect(size).toBe(6);
			});
		});

		describe("hex layout", function() {
			var d1 = new ROT.Display({width:100, height:5, spacing:1, layout:"hex"});
			var d2 = new ROT.Display({width:100, height:5, spacing:1.3, layout:"hex"});

			xit("should compute size for spacing 1", function() {
				var size = d1.computeFontSize(1/0, 96);
				expect(size).toBe(18);
			});

			it("should compute size for spacing >1", function() {
				var size = d2.computeFontSize(1/0, 96);
				expect(size).toBe(14);
			});
		});
	});
});

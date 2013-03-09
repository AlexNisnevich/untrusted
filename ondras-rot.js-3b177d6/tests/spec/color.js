describe("Color", function() {
	describe("add", function() {
		it("should add two colors", function() {
			expect(ROT.Color.add([1,2,3], [3,4,5])).toEqual([4,6,8]);
		});
		it("should add three colors", function() {
			expect(ROT.Color.add([1,2,3], [3,4,5], [100,200,300])).toEqual([104,206,308]);
		});
		it("should add one color (noop)", function() {
			expect(ROT.Color.add([1,2,3])).toEqual([1,2,3]);
		});

		it("should not modify first argument values", function() {
			var c1 = [1,2,3];
			var c2 = [3,4,5];
			ROT.Color.add(c1, c2);
			expect(c1).toEqual([1,2,3]);
		});
	});

	describe("add_", function() {
		it("should add two colors", function() {
			expect(ROT.Color.add_([1,2,3], [3,4,5])).toEqual([4,6,8]);
		});
		it("should add three colors", function() {
			expect(ROT.Color.add_([1,2,3], [3,4,5], [100,200,300])).toEqual([104,206,308]);
		});
		it("should add one color (noop)", function() {
			expect(ROT.Color.add_([1,2,3])).toEqual([1,2,3]);
		});

		it("should modify first argument values", function() {
			var c1 = [1,2,3];
			var c2 = [3,4,5];
			ROT.Color.add_(c1, c2);
			expect(c1).toEqual([4,6,8]);
		});
		it("should return first argument", function() {
			var c1 = [1,2,3];
			var c2 = [3,4,5];
			var c3 = ROT.Color.add_(c1, c2);
			expect(c1).toBe(c3);
		});
	});

	describe("multiply", function() {
		it("should multiply two colors", function() {
			expect(ROT.Color.multiply([100,200,300], [51,51,51])).toEqual([20,40,60]);
		});
		it("should multiply three colors", function() {
			expect(ROT.Color.multiply([100,200,300], [51,51,51], [510,510,510])).toEqual([40,80,120]);
		});
		it("should multiply one color (noop)", function() {
			expect(ROT.Color.multiply([1,2,3])).toEqual([1,2,3]);
		});
		it("should not modify first argument values", function() {
			var c1 = [1,2,3];
			var c2 = [3,4,5];
			ROT.Color.multiply(c1, c2);
			expect(c1).toEqual([1,2,3]);
		});
		it("should round values", function() {
			expect(ROT.Color.multiply([100,200,300], [10, 10, 10])).toEqual([4,8,12]);
		});
	});

	describe("multiply_", function() {
		it("should multiply two colors", function() {
			expect(ROT.Color.multiply_([100,200,300], [51,51,51])).toEqual([20,40,60]);
		});
		it("should multiply three colors", function() {
			expect(ROT.Color.multiply_([100,200,300], [51,51,51], [510,510,510])).toEqual([40,80,120]);
		});
		it("should multiply one color (noop)", function() {
			expect(ROT.Color.multiply_([1,2,3])).toEqual([1,2,3]);
		});
		it("should modify first argument values", function() {
			var c1 = [100,200,300];
			var c2 = [51,51,51];
			ROT.Color.multiply_(c1, c2);
			expect(c1).toEqual([20,40,60]);
		});
		it("should round values", function() {
			expect(ROT.Color.multiply_([100,200,300], [10, 10, 10])).toEqual([4,8,12]);
		});
		it("should return first argument", function() {
			var c1 = [1,2,3];
			var c2 = [3,4,5];
			var c3 = ROT.Color.multiply_(c1, c2);
			expect(c1).toBe(c3);
		});
	});

	describe("fromString", function() {
		it("should handle rgb() colors", function() {
			expect(ROT.Color.fromString("rgb(10, 20, 33)")).toEqual([10, 20, 33]);
		});
		it("should handle #abcdef colors", function() {
			expect(ROT.Color.fromString("#1a2f3c")).toEqual([26, 47, 60]);
		});
		it("should handle #abc colors", function() {
			expect(ROT.Color.fromString("#ca8")).toEqual([204, 170, 136]);
		});
		it("should handle named colors", function() {
			expect(ROT.Color.fromString("red")).toEqual([255, 0, 0]);
		});
		it("should not handle nonexistant colors", function() {
			expect(ROT.Color.fromString("lol")).toEqual([0, 0, 0]);
		});
	});

	describe("toRGB", function() {
		it("should serialize to rgb", function() {
			expect(ROT.Color.toRGB([10, 20, 30])).toEqual("rgb(10,20,30)");
		});
		it("should clamp values to 0..255", function() {
			expect(ROT.Color.toRGB([-100, 20, 2000])).toEqual("rgb(0,20,255)");
		});
	});

	describe("toHex", function() {
		it("should serialize to hex", function() {
			expect(ROT.Color.toHex([10, 20, 40])).toEqual("#0a1428");
		});
		it("should clamp values to 0..255", function() {
			expect(ROT.Color.toHex([-100, 20, 2000])).toEqual("#0014ff");
		});
	});

	describe("interpolate", function() {
		it("should intepolate two colors", function() {
			expect(ROT.Color.interpolate([10, 20, 40], [100, 200, 300], 0.1)).toEqual([19, 38, 66]);
		});
		it("should round values", function() {
			expect(ROT.Color.interpolate([10, 20, 40], [15, 30, 53], 0.5)).toEqual([13, 25, 47]);
		});
		it("should default to 0.5 factor", function() {
			expect(ROT.Color.interpolate([10, 20, 40], [20, 30, 40])).toEqual([15, 25, 40]);
		});
	});

	describe("interpolateHSL", function() {
		it("should intepolate two colors", function() {
			expect(ROT.Color.interpolateHSL([10, 20, 40], [100, 200, 300], 0.1)).toEqual([12, 33, 73]);
		});
	});

	describe("randomize", function() {
		it("should maintain constant diff when a number is used", function() {
			var c = ROT.Color.randomize([100, 100, 100], 100);
			expect(c[0]).toBe(c[1]);
			expect(c[1]).toBe(c[2]);
		});
	});

	describe("rgb2hsl and hsl2rgb", function() {
		it("should correctly convert to HSL and back", function() {
			var rgb = [
				[255, 255, 255],
				[0, 0, 0],
				[255, 0, 0],
				[30, 30, 30],
				[100, 120, 140]
			]

			while (rgb.length) {
				var color = rgb.pop();
				var hsl = ROT.Color.rgb2hsl(color);
				var rgb2 = ROT.Color.hsl2rgb(hsl);
				expect(rgb2).toEqual(color);
			}
		});
	});
});

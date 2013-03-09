describe("FOV", function() {
	var MAP8_RING0 = [
		"#####",
		"#####",
		"##@##",
		"#####",
		"#####"
	];
	var RESULT_MAP8_RING0 = [
		"     ",
		" ... ",
		" ... ",
		" ... ",
		"     "
	];

	var MAP8_RING1 = [
		"#####",
		"#...#",
		"#.@.#",
		"#...#",
		"#####"
	];
	var RESULT_MAP8_RING1 = [
		".....",
		".....",
		".....",
		".....",
		"....."
	]

	var buildLightCallback = function(map) {
		var center = [0, 0];
		/* locate center */
		for (var j=0;j<map.length;j++) {
			for (var i=0;i<map[j].length;i++) {
				if (map[j].charAt(i) == "@") {
					center = [i, j];
				}
			}
		}

		var result = function(x, y) {
			var ch = map[y].charAt(x);
			return (ch != "#");
		};
		result.center = center;
		return result;
	}

	var checkResult = function(fov, center, result) {
		var used = {};
		var callback = function(x, y, dist) {
			expect(result[y].charAt(x)).toEqual(".");
			used[x+","+y] = 1;
		}

		fov.compute(center[0], center[1], 2, callback);
		for (var j=0;j<result.length;j++) {
			for (var i=0;i<result[j].length;i++) {
				if (result[j].charAt(i) != ".") { continue; }
				expect((i+","+j) in used).toEqual(true);
			}
		}
	}

	describe("Discrete Shadowcasting", function() {
		describe("8-topology", function() {
			it("should compute visible ring0", function() {
				var lightPasses = buildLightCallback(MAP8_RING0);
				var fov = new ROT.FOV.DiscreteShadowcasting(lightPasses, {topology:8});
				checkResult(fov, lightPasses.center, RESULT_MAP8_RING0);
			});
			it("should compute visible ring1", function() {
				var lightPasses = buildLightCallback(MAP8_RING1);
				var fov = new ROT.FOV.DiscreteShadowcasting(lightPasses, {topology:8});
				checkResult(fov, lightPasses.center, RESULT_MAP8_RING1);
			});
		});
	});

	describe("Precise Shadowcasting", function() {
		describe("8-topology", function() {
			it("should compute visible ring0", function() {
				var lightPasses = buildLightCallback(MAP8_RING0);
				var fov = new ROT.FOV.PreciseShadowcasting(lightPasses, {topology:8});
				checkResult(fov, lightPasses.center, RESULT_MAP8_RING0);
			});
			it("should compute visible ring1", function() {
				var lightPasses = buildLightCallback(MAP8_RING1);
				var fov = new ROT.FOV.PreciseShadowcasting(lightPasses, {topology:8});
				checkResult(fov, lightPasses.center, RESULT_MAP8_RING1);
			});
		});
	});

}); /* FOV */


var VERBOTEN = ['eval', 'prototype', 'delete', 'return', 'moveToNextLevel'];

var validationRulesByLevel = [ null ];

var DummyDisplay = function () {
	this.clear = function () {};
	this.draw = function () {};
	this.drawObject = function () {};
};

Game.prototype.validate = function(allCode, playerCode, level) {
	function validateAtLeastXObjects(map, num, type) {
		var count = 0;
		for (var x = 0; x < map.getWidth(); x++) {
			for (var y = 0; y < map.getHeight(); y++) {
				if (map.getGrid()[x][y].type === type) {
					count++;
				}
			}
		}
		if (count < num) {
			throw 'Not enough ' + type + 's on the map! Expected: ' + num + ', found: ' + count;
		}
	}

	function validateExactlyXManyObjects(map, num, type) {
		var count = 0;
		for (var x = 0; x < map.getWidth(); x++) {
			for (var y = 0; y < map.getHeight(); y++) {
				if (map.getGrid()[x][y].type === type) {
					count++;
				}
			}
		}
		if (count != num) {
			throw 'Wrong number of ' + type + 's on the map! Expected: ' + num + ', found: ' + count;
		}
	}

	validateLevel = function () {};

	this.output.clear();
	try {
		for (var i = 0; i < VERBOTEN.length; i++) {
			var badWord = VERBOTEN[i];
			if (playerCode.indexOf(badWord) > -1) {
				throw 'You are not allowed to use ' + badWord + '!';
			}
		}

		var display = this.display; var output = this.output;
		var dummyMap = new Map(new DummyDisplay);

		eval(allCode); // get startLevel and (opt) validateLevel methods

		startLevel(dummyMap);
		if (typeof(validateLevel) != 'undefined') {
			validateLevel(dummyMap);
		}

		return startLevel;
	} catch (e) {
		this.output.drawText(0, 0, e.toString());
		throw e;
	}
}

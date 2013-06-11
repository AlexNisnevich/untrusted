
Game.prototype.VERBOTEN = ['eval', 'prototype', 'delete', 'return', 'moveToNextLevel'];

// We may want to have level-specific hidden validation rules in the future.
// var validationRulesByLevel = [ null ];

var DummyDisplay = function () {
	this.clear = function () {};
	this.draw = function () {};
	this.drawObject = function () {};
};

Game.prototype.validators = {
	validateAtLeastXObjects: function(map, num, type) {
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
	},

	validateExactlyXManyObjects: function(map, num, type) {
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
}

Game.prototype.validate = function(allCode, playerCode) {
	var validateAtLeastXObjects = this.validators.validateAtLeastXObjects;
	var validateExactlyXManyObjects = this.validators.validateExactlyXManyObjects;

	validateLevel = function () {};

	this.output.clear();
	try {
		for (var i = 0; i < this.VERBOTEN.length; i++) {
			var badWord = this.VERBOTEN[i];
			if (playerCode.indexOf(badWord) > -1) {
				throw 'You are not allowed to use ' + badWord + '!';
			}
		}

		var display = this.display; var output = this.output;
		var dummyMap = new Map(new DummyDisplay, this);

		eval(allCode); // get startLevel and (opt) validateLevel methods

		startLevel(dummyMap);
		if (typeof(validateLevel) != 'undefined') {
			validateLevel(dummyMap);
		}

		return startLevel;
	} catch (e) {
		this.output.write(e.toString());
		return function () {};
	}
}

// makes sure nothing un-kosher happens during a callback within the game
// e.g. item collison; function phone
Game.prototype.validateCallback = function(callback) {
	var validateAtLeastXObjects = this.validators.validateAtLeastXObjects;
	var validateExactlyXManyObjects = this.validators.validateExactlyXManyObjects;

	this.output.clear();
	eval(this.editor.getCode()); // get validateLevel method if it exists
	try {
		// run the callback
		callback();

		// check if validator still passes
		try {
			if (typeof(validateLevel) != 'undefined') {
				validateLevel(this.map);
			}
		} catch (e) {
			// validation failed - not much to do here but restart the level, unfortunately
			alert('validateLevel failed!\n\n' + e.toString() + '\n\nRestarting level ...');
			this.evalLevelCode();
		}

		// refresh the map, just in case
		this.map.refresh();
	} catch (e) {
		this.output.write(e.toString());
	}
}

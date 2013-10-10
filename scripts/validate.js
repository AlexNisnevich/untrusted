Game.prototype.VERBOTEN = ['eval', 'prototype', 'delete', 'return', 'moveToNextLevel', 'startTimer', 'removeItemFromMap'];
Game.prototype.allowedTime = 2000;

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

Game.prototype.validate = function(allCode, playerCode, preserveOutput) {
	var game = this;

	var validateAtLeastXObjects = this.validators.validateAtLeastXObjects;
	var validateExactlyXManyObjects = this.validators.validateExactlyXManyObjects;

	validateLevel = function () {};

	if (!preserveOutput) {
		this.output.clear();
	}

	try {
		for (var i = 0; i < this.VERBOTEN.length; i++) {
			var badWord = this.VERBOTEN[i];
			if (playerCode.indexOf(badWord) > -1) {
				throw 'You are not allowed to use ' + badWord + '!';
			}
		}

		var display = this.display; var output = this.output;

		var dummyMap = new Map(new DummyDisplay, this);
		dummyMap.setProperties(this.editor.getProperties()['mapProperties']);

		// modify the code to always check time to prevent infinite loops
		allCode = $.map(allCode.split('\n'), function (line, i) {
			return line.replace(/((for|while) .*){/g,
				"startTime = Date.now();" +
				"$1{" +
					"if (Date.now() - startTime > " + game.allowedTime + ") {" +
						"throw '[Line " + (i+1) + "] TimeOutException: Maximum loop execution time of " + game.allowedTime + " ms exceeded.';" +
					"}");
		}).join('\n');

		// evaluate the code to get startLevel() and (opt) validateLevel() methods
		eval(allCode);

		// start the level on a dummy map to validate
		startLevel(dummyMap);
		if (typeof(validateLevel) != 'undefined') {
			validateLevel(dummyMap);
		}

		return startLevel;
	} catch (e) {
		var exceptionText = e.toString();
		if (e instanceof SyntaxError) {
			if (lineNum = this.findSyntaxError(allCode, e.message)) {
				exceptionText = "[Line " + lineNum + "] " + exceptionText;
			}
		}
		this.output.write(exceptionText);
		return null;
	}
}

// makes sure nothing un-kosher happens during a callback within the game
// e.g. item collison; function phone
Game.prototype.validateCallback = function(callback) {
	var validateAtLeastXObjects = this.validators.validateAtLeastXObjects;
	var validateExactlyXManyObjects = this.validators.validateExactlyXManyObjects;

	this.output.clear();
	eval(this.editor.getGoodState()['code']); // get validateLevel method from last good state (if such a method exists)
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

// awful awful awful method that tries to find the line
// of code where a given error occurs
Game.prototype.findSyntaxError = function(code, errorMsg) {
	var lines = code.split('\n');
	for (var i = 1; i <= lines.length; i++) {
		var testCode = lines.slice(0, i).join('\n');

		try {
			eval(testCode);
		} catch (e) {
			if (e.message == errorMsg) {
				return i;
			}
		}
	}
	return null;
}

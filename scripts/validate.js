Game.prototype.verbotenWords = [
	'eval', 'prototype', 'delete', 'return', 'console', 'debugger',
	'setTimeout', 'setInterval', 'level', 'Level', 'removeItemFromMap'
];
Game.prototype.allowedTime = 2000;

// We may want to have level-specific hidden validation rules in the future.
// var validationRulesByLevel = [ null ];

var DummyDisplay = function () {
	this.clear = function () {};
	this.drawAll = function () {};
	this.drawObject = function () {};
	this.drawText = function () {};
};

Game.prototype.validate = function(allCode, playerCode) {
	var game = this;

	try {
		for (var i = 0; i < this.verbotenWords.length; i++) {
			var badWord = this.verbotenWords[i];
			if (playerCode.indexOf(badWord) > -1) {
				throw 'You are not allowed to use ' + badWord + '!';
			}
		}

		var dummyMap = new Map(new DummyDisplay(), this);
		dummyMap.setProperties(this.editor.getProperties().mapProperties);

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
		validateLevel = function () {}; // in case validateLevel isn't defined
		eval(allCode);

		// start the level on a dummy map to validate
		startLevel(dummyMap);
		if (typeof(validateLevel) !== 'undefined') {
			validateLevel(dummyMap);
		}

		this.onExit = function () { return true; };
		if (typeof onExit !== "undefined") {
			this.onExit = onExit;
		}

		return startLevel;
	} catch (e) {
		var exceptionText = e.toString();
		if (e instanceof SyntaxError) {
			var lineNum = this.findSyntaxError(allCode, e.message);
			if (lineNum) {
				exceptionText = "[Line " + lineNum + "] " + exceptionText;
			}
		}
		this.display.appendError(exceptionText);
		return null;
	}
};

// makes sure nothing un-kosher happens during a callback within the game
// e.g. item collison; function phone
Game.prototype.validateCallback = function(callback) {
	eval(this.editor.getGoodState().code); // get validateLevel method from last good state (if such a method exists)
	try {
		// run the callback
		callback();

		// check if validator still passes
		try {
			if (typeof(validateLevel) !== 'undefined') {
				validateLevel(this.map);
			}
		} catch (e) {
			// validation failed - not much to do here but restart the level, unfortunately
			this.display.appendError(e.toString(), "%c{red}Validation failed! Please reload the level.");

			// play error sound
			this.sound.playSound('static');

			// disable player movement
			this.map.getPlayer().canMove = false;
		}

		// refresh the map, just in case
		this.map.refresh();
	} catch (e) {
		this.display.writeStatus(e.toString());
	}
};

// awful awful awful method that tries to find the line
// of code where a given error occurs
Game.prototype.findSyntaxError = function(code, errorMsg) {
	var lines = code.split('\n');
	for (var i = 1; i <= lines.length; i++) {
		var testCode = lines.slice(0, i).join('\n');

		try {
			eval(testCode);
		} catch (e) {
			if (e.message === errorMsg) {
				return i;
			}
		}
	}
	return null;
};

// Specific validators go here

Map.prototype.validateAtLeastXObjects = function(num, type) {
	var count = this.countObjects(type);
	if (count < num) {
		throw 'Not enough ' + type + 's on the map! Expected: ' + num + ', found: ' + count;
	}
};

Map.prototype.validateExactlyXManyObjects = function(num, type) {
	var count = this.countObjects(type);
	if (count != num) {
		throw 'Wrong number of ' + type + 's on the map! Expected: ' + num + ', found: ' + count;
	}
};

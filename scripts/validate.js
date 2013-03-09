
var VERBOTEN = ['eval', 'prototype'];

var validationRulesByLevel = [ null ];

var DummyDisplay = function () {
	this.clear = function () {};
	this.drawObject = function () {};
}

function validate(playerCode, level) {
	output.clear();
	try {
		for (var i = 0; i < VERBOTEN.length; i++) {
			var badWord = VERBOTEN[i];
			if (playerCode.indexOf(badWord) > -1) {
				throw 'You are not allowed to use ' + badWord + '!';
			}
		}

		var dummyMap = new Map(new DummyDisplay);

		eval(playerCode); // get startLevel and (opt) validateLevel methods

		startLevel(dummyMap);
		if (typeof(validateLevel) != 'undefined') {
			validateLevel(dummyMap);
		}

		return startLevel;
	} catch (e) {
		output.drawText(0, 0, e.toString());
	}
}


var validationRulesByLevel = [ null ];

var DummyDisplay = function () {
	this.clear = function () {};
	this.drawObject = function () {};
}

function validate(playerCode, level) {
	var dummyMap = new Map(new DummyDisplay);

	eval(playerCode); // get startLevel and (opt) validateLevel methods

	if (typeof(validateLevel) != 'undefined' && !validateLevel(dummyMap)) {
	} else {
		return startLevel;
	}
}

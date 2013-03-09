
// directions for moving entities
var keys = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
};

var levelFileNames = [
	'blocks.js',
	'theReturnOfBlocks.js',
	'levelThree.js',
	'multiplicity.js',
	'traps.js',
    'trees.js',
];

var display;
var output;
var editor;
var map;

var currentLevel = 0; // level numbers start at 0 because coding :\

function init() {
	display = new ROT.Display({width: dimensions.width, height: dimensions.height,
		fontSize: 20, fontStyle: "bold"});

	// drawObject takes care of looking up an object's symbol and color
	// according to name (NOT according to the actual object literal!)
	display.drawObject = function (x, y, object, bgColor, multiplicand) {
		var symbol = objects[object].symbol;
		var color;
		if (objects[object].color) {
			color = objects[object].color;
		} else {
			color = "#fff";
		}

		if (!bgColor) {
			bgColor = "#000";
		}

		if (multiplicand) {
			color = ROT.Color.toHex(ROT.Color.multiply(multiplicand, ROT.Color.fromString(color)));
			bgColor = ROT.Color.toHex(ROT.Color.multiply(multiplicand, ROT.Color.fromString(bgColor)));
		}

		display.draw(x, y, symbol, color, bgColor);
	};

	display.drawAll = function(map, multiplicand) {
		for (var x = 0; x < dimensions.width; x++) {
			for (var y = 0; y < dimensions.height; y++) {
				this.drawObject(x, y, map._grid[x][y].type, map._grid[x][y].bgColor, multiplicand);
			}
		}
		if (map.player) { map.player.draw(); }

	}

	display.fadeOut = function (map, callback, i) {
		if (i <= 0) {
			if (callback) { callback(); }
		} else {
			if (!i) { i = 255; }
			this.drawAll(map, [i, i, i]);
			setTimeout(function () { display.fadeOut(map, callback, i-10); }, 10);
		}
	};

	display.fadeIn = function (map, callback, i) {
		if (i > 255) {
			if (callback) { callback(); }
		} else {
			if (!i) { i = 0; }
			this.drawAll(map, [i, i, i]);
			setTimeout(function () { display.fadeIn(map, callback, i+5); }, 10);
		}
	};

	$('#screen').append(display.getContainer());

	// required so all canvas elements can detect keyboard events
	$("canvas").first().attr("contentEditable", "true");
	display.getContainer().addEventListener("keydown", function(e) {
		if (keys[e.keyCode]) {
			map.player.move(keys[e.keyCode]);
		}
	});
	display.getContainer().addEventListener("click", function(e) {
		$(display.getContainer()).addClass('focus');
		$('.CodeMirror').removeClass('focus');
	});

	output = new ROT.Display({width: dimensions.width * 1.33, height: 2, fontSize: 15});
	$('#output').append(output.getContainer());
	output.write = function(text) {
		output.clear();
		output.drawText(0, 0, text);
	}

	map = new Map(display);
	getLevel(currentLevel);
	focusOnMap();
}

function moveToNextLevel() {
	currentLevel++;
	display.fadeOut(map, function () {
		getLevel(currentLevel);
	})
};

// makes an ajax request to get the level text file and
// then loads it into the game
function getLevel(levelNumber) {
	var fileName;
	if (levelNumber < levelFileNames.length) {
		fileName = levelFileNames[levelNumber];
	}
	else {
		fileName = "dummyLevel.js";
	}
	$.get('levels/' + fileName, function (codeText) {
		if (editor) {
			editor.toTextArea();
		}
		loadLevel(codeText, levelNumber);
	});
}

function loadLevel(lvlCode, lvlNum) {
	// initialize CodeMirror editor
	editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
		theme: 'vibrant-ink',
		lineNumbers: true,
		dragDrop: false,
		extraKeys: {'Enter': function () {}}
	});
	editor.setSize(600, 500);
	editor.on("focus", function(instance) {
		$('.CodeMirror').addClass('focus');
		$('#screen canvas').removeClass('focus');
	});

	// initialize level
	editor.setValue(lvlCode);

	// get editable line ranges from level metadata
	levelMetadata = editor.getLine(0);
	editableLineRanges = JSON.parse(levelMetadata.slice(3)).editable;
	editableLines = [];
	for (var j = 0; j < editableLineRanges.length; j++) {
		range = editableLineRanges[j];
		for (var i = range[0]; i <= range[1]; i++) {
			editableLines.push(i - 1);
		}
	}
	editor.removeLine(0);

	// only allow editing on editable lines, and don't allow removal of lines
	// also, set a line length limit of 80 chars
	editor.on('beforeChange', function (instance, change) {
		if (editableLines.indexOf(change.to.line) == -1 ||
				change.to.line != change.from.line ||
				(change.to.ch > 80 && change.to.ch >= change.from.ch)) {
			change.cancel();
		}
	});

	// set bg color for uneditable line
	editor.on('update', function (instance) {
		for (var i = 0; i < editor.lineCount(); i++) {
			if (editableLines.indexOf(i) == -1) {
				instance.addLineClass(i, 'wrap', 'disabled');
			}
		}
	});
	editor.refresh();

	// editor.getPlayerCode returns only the code written in editable lines
	editor.getPlayerCode = function () {
		var code = '';
		for (var i = 0; i < editor.lineCount(); i++) {
			if (editableLines.indexOf(i) > -1) {
				code += editor.getLine(i) + ' \n';
			}
		}
		return code;
	}

	// start the level
	evalLevelCode(lvlNum);

	// on first level, display intro text
	if (currentLevel == 0) {
		output.write('Dr. Eval awoke in a strange dungeon, with no apparent way out. He spied his trusty computer ...');
	}
}

function focusOnMap() {
	$('canvas').first().attr('tabindex', '0').click().focus();
}

function focusOnEditor() {
	editor.focus();
}

function resetEditor() {
    getLevel(currentLevel);
}

function evalLevelCode(lvlNum) {
	var allCode = editor.getValue();
	var playerCode = editor.getPlayerCode();
	var validatedStartLevel = validate(allCode, playerCode, currentLevel);
	if (validatedStartLevel) {
		map.reset();
		validatedStartLevel(map);
		if (lvlNum < levelFileNames.length) {
			// don't do this for dummy level
			display.drawAll(map);
			display.fadeIn(map);
		}
	}
}

function usePhone() {
	if (map.player._phoneFunc) {
		map.player._phoneFunc();
	} else {
		output.write('RotaryPhoneException: Your function phone is not bound to any function.')
	}
}

shortcut.add('ctrl+1', focusOnMap);
shortcut.add('ctrl+2', focusOnEditor);
shortcut.add('ctrl+4', resetEditor);
shortcut.add('ctrl+5', evalLevelCode);
shortcut.add('ctrl+6', usePhone);
shortcut.add('ctrl+0', moveToNextLevel);

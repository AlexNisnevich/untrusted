
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
	// Initialize map display
	display = new ROT.Display({
		width: dimensions.width,
		height: dimensions.height,
		fontFamily: '"droid sans mono", monospace',
		fontSize: 20,
		// fontStyle: "bold" // Droid Sans Mono's boldface makes many characters spill over
	});
	display.setupEventHandlers();
	$('#screen').append(display.getContainer());

	// Initialize output display
	output = new ROT.Display({
		width: dimensions.width * 1.33,
		height: 2,
		fontFamily: '"droid sans mono", monospace',
		fontSize: 15
	});
	$('#output').append(output.getContainer());

	// Start first level
	map = new Map(display);
	editor = createEditor("editor", '', 600, 500); // dummy editor
	getLevel(currentLevel);
	display.focus();

	// Enable shortcut keys
	shortcut.add('ctrl+1', function () { display.focus(); return true; });
	shortcut.add('ctrl+2', function () { editor.focus(); return true; });
	shortcut.add('ctrl+3', function () { return true; });
	shortcut.add('ctrl+4', function () { resetEditor(); return true; });
	shortcut.add('ctrl+5', function () { evalLevelCode(); return true; });
	shortcut.add('ctrl+6', function () { usePhone(); return true; });
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
    editor = createEditor("editor", lvlCode, 600, 500);

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

	// start the level and fade in
	evalLevelCode(lvlNum);
	if (lvlNum < levelFileNames.length) {
		// don't fade in for dummy level
		display.fadeIn(map);
	}

	// on first level, display intro text
	if (currentLevel == 0) {
		output.write('Dr. Eval awoke in a strange dungeon, with no apparent way out. He spied his trusty computer ...');
	}
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
		if (lvlNum >= levelFileNames.length) {
			// don't do this for dummy level
			return;
		}
		display.drawAll(map);
	}
}

function usePhone() {
	if (map.getPlayer()._phoneFunc) {
		map.getPlayer()._phoneFunc();
	} else {
		output.write('RotaryPhoneException: Your function phone is not bound to any function.')
	}
}
ROT.Display.prototype.setupEventHandlers = function() {
	// directions for moving entities
	var keys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	// contentEditable is required for canvas elements to detect keyboard events
	$(this.getContainer()).attr("contentEditable", "true");
	this.getContainer().addEventListener("keydown", function(e) {
		if (keys[e.keyCode]) {
			map.getPlayer().move(keys[e.keyCode]);
		}
	});

	this.getContainer().addEventListener("click", function(e) {
		$(this).addClass('focus');
		$('.CodeMirror').removeClass('focus');
	});
}

// drawObject takes care of looking up an object's symbol and color
// according to name (NOT according to the actual object literal!)
ROT.Display.prototype.drawObject = function (x, y, object, bgColor, multiplicand) {
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

	this.draw(x, y, symbol, color, bgColor);
};

ROT.Display.prototype.drawAll = function(map, multiplicand) {
	for (var x = 0; x < dimensions.width; x++) {
		for (var y = 0; y < dimensions.height; y++) {
			this.drawObject(x, y, map.getGrid()[x][y].type, map.getGrid()[x][y].bgColor, multiplicand);
		}
	}
	if (map.getPlayer()) { map.getPlayer().draw(); }
}

ROT.Display.prototype.fadeOut = function (map, callback, i) {
	var display = this;
	if (i <= 0) {
		if (callback) { callback(); }
	} else {
		if (!i) { i = 255; }
		this.drawAll(map, [i, i, i]);
		setTimeout(function () {
			display.fadeOut(map, callback, i-10);
		}, 10);
	}
};

ROT.Display.prototype.fadeIn = function (map, callback, i) {
	var display = this;
	if (i > 255) {
		if (callback) { callback(); }
	} else {
		if (!i) { i = 0; }
		this.drawAll(map, [i, i, i]);
		setTimeout(function () {
			display.fadeIn(map, callback, i+5);
		}, 10);
	}
};

ROT.Display.prototype.write = function(text) {
	output.clear();
	output.drawText(0, 0, text);
}

ROT.Display.prototype.focus = function() {
	$(display.getContainer()).attr('tabindex', '0').click().focus();
}

// Editor object

var createEditor = function (domElemId, levelCode, width, height) {
	var ed = CodeMirror.fromTextArea(document.getElementById(domElemId), {
		theme: 'vibrant-ink',
		lineNumbers: true,
		dragDrop: false,
		extraKeys: {'Enter': function () {}}
	});

	ed.setSize(width, height); //TODO this line causes wonky cursor behavior, might be a bug in CodeMirror?
	ed.setValue(levelCode);
	ed.on("focus", function(instance) {
		$('.CodeMirror').addClass('focus');
		$('#screen canvas').removeClass('focus');
	});

	return ed;
};
var dimensions = {
	width: 50,
	height: 25
};

function Map(display) {
	// Private variables
	var _player;
	var _grid;

	this.reset = function () {
		this.display.clear();
		_grid = new Array(dimensions.width);
		for (var x = 0; x < dimensions.width; x++) {
			_grid[x] = new Array(dimensions.height);
			for (var y = 0; y < dimensions.height; y++) {
				_grid[x][y] = {type: 'empty'};
			}
		}
		_player = null;
	};

	this.getPlayer = function () { return _player; }
	this.getGrid = function () { return _grid; }
	this.getWidth = function () { return dimensions.width; }
	this.getHeight = function () { return dimensions.height; }

	this.placeObject = function (x, y, type, bgColor) {
        if (typeof(_grid[x]) !== 'undefined' && typeof(_grid[x][y]) !== 'undefined') {
            if (!_player.atLocation(x, y) || type == 'empty') {
                _grid[x][y].type = type;
            }
        }
	};

	this.placePlayer = function (x, y) {
		if (_player) {
			throw "Can't place player twice!";
		}
		_player = new Player(x, y, this);
		_player.draw();
	};

	this.setSquareColor = function (x, y, bgColor) {
		_grid[x][y].bgColor = bgColor;
	};

	this.canMoveTo = function (x, y) {
		if (x < 0 || x >= dimensions.width || y < 0 || y >= dimensions.height) {
			return false;
		}
		return objects[map.getGrid()[x][y].type].passable;
	};

	// Initialize with empty grid
	this.display = display;
	this.reset();
};
var pickedUpComputer = false;
var pickedUpPhone = false;

var objects = {
	'empty' : {
		'symbol': ' ',
		'passable': true
	},
	'block': {
		'symbol': '#',
		'color': '#f00',
		'passable': false
	},
	'tree': {
		'symbol': '♣',
		'color': '#080',
		'passable': false
	},
	'trap': {
		'symbol': ' ',
		'passable': true,
		'onCollision': function (player) {
			player.killedBy('an invisible trap');
		}
	},
    'stream': {
        'symbol': '░',
        'passable': true,
        'onCollision': function (player) {
            player.killedBy('drowning in deep dark water');
        }
    },
	'exit' : {
		'symbol' : String.fromCharCode(0x2395), // ⎕
		'color': '#0ff',
		'passable': true,
		'onCollision': function (player) {
			moveToNextLevel();
		}
	},
	'player' : {
		'symbol': '@',
		'color': '#0f0',
		'passable': false
	},
	'computer': {
		'symbol': String.fromCharCode(0x2318), // ⌘
		'color': '#ccc',
		'passable': true,
		'onCollision': function (player) {
			player.pickUpItem();
			pickedUpComputer = true;
			output.write('You have picked up the computer! You can use it to get past the walls to the exit.');
			$('#editorPane').fadeIn();
			editor.refresh();
		}
	},
	'phone': {
		'symbol': String.fromCharCode(0x260E), // ☎
		'passable': true,
		'onCollision': function (player) {
			player.pickUpItem();
			pickedUpPhone = true;
			output.write('You have picked up the function phone! You can use it to call functions, as defined by setPhoneCallback in the level code.');
			$('#phoneButton').show();
		}
	}
};
var Player = function(x, y, map) {
	var _x = x;
	var _y = y;
	this._rep = "@";
	this._fgColor = "#0f0";
	this._display = map.display;

	this.getX = function () { return _x; }
	this.getY = function () { return _y; }

	this.draw = function () {
		var bgColor = map.getGrid()[_x][_y].bgColor
		this._display.draw(_x, _y, this._rep, this._fgColor, bgColor);
	}

	this.atLocation = function (x, y) {
		return (_x === x && _y === y);
	}

	this.move = function (direction) {
		var cur_x = _x;
		var cur_y = _y;
		var new_x;
		var new_y;

		if (direction === 'up') {
			new_x = cur_x;
			new_y = cur_y - 1;
		}
		else if (direction === 'down') {
			new_x = cur_x;
			new_y = cur_y + 1;
		}
		else if (direction === 'left') {
			new_x = cur_x - 1;
			new_y = cur_y;
		}
		else if (direction === 'right') {
			new_x = cur_x + 1;
			new_y = cur_y;
		}

		if (map.canMoveTo(new_x, new_y)) {
			this._display.drawObject(cur_x,cur_y, map.getGrid()[cur_x][cur_y].type, map.getGrid()[cur_x][cur_y].bgColor);
			_x = new_x;
			_y = new_y;
			this.draw();
			if (objects[map.getGrid()[new_x][new_y].type].onCollision) {
				objects[map.getGrid()[new_x][new_y].type].onCollision(this);
			}
		}
		else {
			console.log("Can't move to " + new_x + ", " + new_y + ", reported from inside Player.move() method");
		}
	};

	this.killedBy = function (killer) {
		alert('You have been killed by ' + killer + '!');
		getLevel(currentLevel);
	}

	this.pickUpItem = function () {
		map.placeObject(_x, _y, 'empty');
		// do a little dance to get rid of graphical artifacts //TODO fix this
		this.move('left');
		this.move('right');
	}

	this.setPhoneCallback = function(func) {
	    this._phoneFunc = func;
	}
}

var VERBOTEN = ['eval', 'prototype', 'delete', 'return', 'moveToNextLevel'];

var validationRulesByLevel = [ null ];

var DummyDisplay = function () {
	this.clear = function () {};
	this.draw = function () {};
	this.drawObject = function () {};
};

function validate(allCode, playerCode, level) {
	validateLevel = function () {};

	output.clear();
	try {
		for (var i = 0; i < VERBOTEN.length; i++) {
			var badWord = VERBOTEN[i];
			if (playerCode.indexOf(badWord) > -1) {
				throw 'You are not allowed to use ' + badWord + '!';
			}
		}

		var dummyMap = new Map(new DummyDisplay);

		eval(allCode); // get startLevel and (opt) validateLevel methods

		startLevel(dummyMap);
		if (typeof(validateLevel) != 'undefined') {
			validateLevel(dummyMap);
		}

		return startLevel;
	} catch (e) {
		output.drawText(0, 0, e.toString());
	}
}

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

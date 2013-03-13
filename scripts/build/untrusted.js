function Game() {
	this.levelFileNames = [
		'blocks.js',
		'theReturnOfBlocks.js',
		'levelThree.js',
		'multiplicity.js',
		'traps.js',
	    'trees.js',
	];

	this.currentLevel = 0; // level numbers start at 0 because coding :\

	this.init = function () {
		// Initialize map display
		this.display = new ROT.Display({
			width: dimensions.width,
			height: dimensions.height,
			fontFamily: '"droid sans mono", monospace',
			fontSize: 20,
			// fontStyle: "bold" // Droid Sans Mono's boldface makes many characters spill over
		});
		this.display.setupEventHandlers();
		$('#screen').append(this.display.getContainer());

		// Initialize output display
		this.output = new ROT.Display({
			width: dimensions.width * 1.33,
			height: 2,
			fontFamily: '"droid sans mono", monospace',
			fontSize: 15
		});
		$('#output').append(this.output.getContainer());

		// Start first level
		this.map = new Map(this.display);
		this.editor = createEditor("editor", '', 600, 500); // dummy editor
		this.getLevel(this.currentLevel);
		this.display.focus();

		// Enable shortcut keys
		shortcut.add('ctrl+1', function () { game.display.focus(); return true; });
		shortcut.add('ctrl+2', function () { game.editor.focus(); return true; });
		shortcut.add('ctrl+3', function () { return true; });
		shortcut.add('ctrl+4', function () { game.resetEditor(); return true; });
		shortcut.add('ctrl+5', function () { game.evalLevelCode(); return true; });
		shortcut.add('ctrl+6', function () { game.usePhone(); return true; });
	}

	this.moveToNextLevel = function () {
		var game = this;
		this.currentLevel++;
		this.display.fadeOut(this.map, function () {
			game.getLevel(game.currentLevel);
		})
	};

	// makes an ajax request to get the level text file and
	// then loads it into the game
	this.getLevel = function (levelNumber) {
		var game = this;
		this.currentLevel = levelNumber;

		var fileName;
		if (levelNumber < this.levelFileNames.length) {
			fileName = this.levelFileNames[levelNumber];
		} else {
			fileName = "dummyLevel.js";
		}

		$.get('levels/' + fileName, function (codeText) {
			if (game.editor) {
				game.editor.toTextArea();
			}
			game.loadLevel(codeText, levelNumber);
		});
	}

	this.loadLevel = function (lvlCode, lvlNum) {
		// initialize CodeMirror editor
	    this.editor = createEditor("editor", lvlCode, 600, 500);

		// start the level and fade in
		this.evalLevelCode(lvlNum);
		if (lvlNum < this.levelFileNames.length) {
			// don't fade in for dummy level
			this.display.fadeIn(this.map);
		}

		// on first level, display intro text
		if (this.currentLevel == 0) {
			this.output.write('Dr. Eval awoke in a strange dungeon, with no apparent way out. He spied his trusty computer ...');
		}
	}

	this.resetEditor = function () {
	    this.getLevel(this.currentLevel);
	}

	this.evalLevelCode = function (lvlNum) {
		var allCode = this.editor.getValue();
		var playerCode = this.editor.getPlayerCode();
		var validatedStartLevel = this.validate(allCode, playerCode, this.currentLevel);
		if (validatedStartLevel) {
			this.map.reset();
			var map = this.map; var display = this.display; var output = this.output;
			validatedStartLevel(map);
			if (lvlNum >= this.levelFileNames.length) {
				// don't call drawAll on dummy level
				return;
			}
			this.display.drawAll(map);
		}
	}

	this.usePhone = function () {
		if (this.map.getPlayer()._phoneFunc) {
			this.map.getPlayer()._phoneFunc();
		} else {
			this.output.write('RotaryPhoneException: Your function phone is not bound to any function.')
		}
	}

	// Constructor
	this.init();
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
			game.map.getPlayer().move(keys[e.keyCode]);
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
	this.clear();
	this.drawText(0, 0, text);
}

ROT.Display.prototype.focus = function() {
	$(this.getContainer()).attr('tabindex', '0').click().focus();
}

// Editor object

function createEditor(domElemId, levelCode, width, height) {
	var ed = CodeMirror.fromTextArea(document.getElementById(domElemId), {
		theme: 'vibrant-ink',
		lineNumbers: true,
		dragDrop: false,
		extraKeys: {'Enter': function (instance) {
			var cursorPos = instance.getCursor();
			cursorPos.line++;
			instance.setCursor(cursorPos);
		}}
	});

	ed.setSize(width, height); //TODO this line causes wonky cursor behavior, might be a bug in CodeMirror?
	ed.setValue(levelCode);

	ed.on("focus", function(instance) {
		$('.CodeMirror').addClass('focus');
		$('#screen canvas').removeClass('focus');
	});

	this.editableLines = [];
	if (levelCode && levelCode != '') {
		// get editable line ranges from level metadata
		var levelMetadata = levelCode.split('\n')[0];
		var editableLineRanges = JSON.parse(levelMetadata.slice(3)).editable;
		for (var j = 0; j < editableLineRanges.length; j++) {
			range = editableLineRanges[j];
			for (var i = range[0]; i <= range[1]; i++) {
				this.editableLines.push(i - 1);
			}
		}
		ed.removeLine(0);

		// beforeChange event handler handles editing restrictions
		ed.on('beforeChange', function (instance, change) {
			if (this.editableLines.indexOf(change.to.line) == -1) {
				// only allow editing on editable lines
				change.cancel();
				return;
			} else if (change.origin == '+delete') {
				// don't allow multi-line deletion
				if (change.to.line != change.from.line) {
					change.cancel();
				}
			} else { // change.origin is '+input' or 'paste'
				// don't allow multi-line paste - only paste first line
				if (change.text.length > 1) {
					change.text = [change.text[0]]
				}

				// enforce 80-char limit
				var lineLength = instance.getLine(change.to.line).length;
				if (lineLength + change.text[0].length > 80) {
					var allowedLength = Math.max(80 - lineLength, 0)
					change.text[0] = change.text[0].substr(0, allowedLength);
				}
			}
			console.log(change);
		});

		// set bg color for uneditable lines
		ed.on('update', function (instance) {
			for (var i = 0; i < instance.lineCount(); i++) {
				if (this.editableLines.indexOf(i) == -1) {
					instance.addLineClass(i, 'wrap', 'disabled');
				}
			}
		});
		ed.refresh();
	}

	return ed;
};

// editor.getPlayerCode returns only the code written in editable lines
CodeMirror.prototype.getPlayerCode = function () {
	var code = '';
	for (var i = 0; i < this.lineCount(); i++) {
		if (this.editableLines && this.editableLines.indexOf(i) > -1) {
			code += game.editor.getLine(i) + ' \n';
		}
	}
	return code;
}
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
		return objects[this.getGrid()[x][y].type].passable;
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
			game.map.getPlayer().killedBy('an invisible trap');
		}
	},
    'stream': {
        'symbol': '░',
        'passable': true,
        'onCollision': function (player) {
            game.map.getPlayer().killedBy('drowning in deep dark water');
        }
    },
	'exit' : {
		'symbol' : String.fromCharCode(0x2395), // ⎕
		'color': '#0ff',
		'passable': true,
		'onCollision': function (player) {
			game.moveToNextLevel();
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
			game.map.getPlayer().pickUpItem();
			pickedUpComputer = true;
			game.output.write('You have picked up the computer! You can use it to get past the walls to the exit.');
			$('#editorPane').fadeIn();
			game.editor.refresh();
		}
	},
	'phone': {
		'symbol': String.fromCharCode(0x260E), // ☎
		'passable': true,
		'onCollision': function (player) {
			game.map.getPlayer().pickUpItem();
			pickedUpPhone = true;
			game.output.write('You have picked up the function phone! You can use it to call functions, as defined by setPhoneCallback in the level code.');
			$('#phoneButton').show();
		}
	}
};
function Player(x, y, map) {
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

$(document).ready(function() {
	new Game();
});

function Game() {
	_currentPlayer = null;

	this.levelFileNames = [
		null, // to start levels at 1
		'blocks.js',
		'theReturnOfBlocks.js',
		'levelThree.js',
		'multiplicity.js',
		'traps.js',
	    'trees.js',
	];

	this.currentLevel = 1;

	this.setCurrentPlayer = function (p) { _currentPlayer = p; }
	this.getCurrentPlayer = function () { return _currentPlayer; }

	this.init = function () {
		var game = this;

		// Initialize map display
		this.display = ROT.Display.create(this, {
			width: dimensions.width,
			height: dimensions.height,
			fontSize: 20,
			// fontStyle: "bold" // Droid Sans Mono's boldface makes many characters spill over
		});
		this.display.setupEventHandlers();
		$('#screen').append(this.display.getContainer());

		// Initialize output display
		this.output = ROT.Display.create(this, {
			width: dimensions.width * 1.33,
			height: 2,
			fontSize: 15
		});
		$('#output').append(this.output.getContainer());

		// Start first level
		this.map = new Map(this.display, this);
		_currentPlayer = new Player(-1, -1, this.map);
		this.editor = CodeMirror.create("editor", '', 600, 500, this); // dummy editor
		this.getLevel(this.currentLevel);
		this.display.focus();

		// Enable shortcut keys
		shortcut.add('ctrl+1', function () { game.display.focus(); return true; });
		shortcut.add('ctrl+2', function () { game.editor.focus(); return true; });
		shortcut.add('ctrl+3', function () { return true; });
		shortcut.add('ctrl+4', function () { game.resetEditor(); return true; });
		shortcut.add('ctrl+5', function () { game.evalLevelCode(); return true; });
		shortcut.add('ctrl+6', function () { game.usePhone(); return true; });

		// Enable buttons
		$("#mapButton").click( function () { game.display.focus();} );
		$("#editorButton").click( function () { game.editor.focus();} );
		$("#resetButton").click( function () { game.resetEditor();} );
		$("#executeButton").click( function () { game.evalLevelCode();} );
		$("#phoneButton").click( function () { game.usePhone();} );
	}

	this.moveToNextLevel = function () {
		var game = this;

		this.currentLevel++;
		this.output.write('Loading level ' + this.currentLevel + ' ...');
		this.getCurrentPlayer().canMove = false;
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
	    this.editor = CodeMirror.create("editor", lvlCode, 600, 500, this);

		// start the level and fade in
		this.evalLevelCode(lvlNum);
		if (lvlNum < this.levelFileNames.length) {
			// don't fade in for dummy level
			this.display.fadeIn(this.map, function () {
			});
		}

		// on first level, display intro text
		if (this.currentLevel == 1) {
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

			var game = this; var map = this.map; var display = this.display; var output = this.output;
			validatedStartLevel(map);

			_currentPlayer = this.map.getPlayer();
			_currentPlayer.canMove = true;

			// don't refresh display for dummy level
			if (!(lvlNum >= this.levelFileNames.length)) {
				this.map.refresh();
			}
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
ROT.Display.create = function(game, opts) {
	opts['fontFamily'] = '"droid sans mono", monospace';
	var display = new ROT.Display(opts);
	display.game = game;
	return display;
}

ROT.Display.prototype.setupEventHandlers = function() {
	var game = this.game;

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
	var symbol = this.game.objects[object].symbol;
	var color;
	if (this.game.objects[object].color) {
		color = this.game.objects[object].color;
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

CodeMirror.create = function(domElemId, levelCode, width, height, game) {
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

	ed.game = game;
	ed.setSize(width, height); //TODO this line causes wonky cursor behavior, might be a bug in CodeMirror?
	ed.setValue(levelCode);

	ed.on("focus", function(instance) {
		$('.CodeMirror').addClass('focus');
		$('#screen canvas').removeClass('focus');
	});

	ed.editableLines = [];
	if (levelCode && levelCode != '') {
		// get editable line ranges from level metadata
		var levelMetadata = levelCode.split('\n')[0];
		var editableLineRanges = JSON.parse(levelMetadata.slice(3)).editable;
		for (var j = 0; j < editableLineRanges.length; j++) {
			range = editableLineRanges[j];
			for (var i = range[0]; i <= range[1]; i++) {
				ed.editableLines.push(i - 1);
			}
		}
		ed.removeLine(0);

		// beforeChange event handler handles editing restrictions
		ed.on('beforeChange', function (instance, change) {
			if (ed.editableLines.indexOf(change.to.line) == -1) {
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
		});

		// set bg color for uneditable lines
		ed.on('update', function (instance) {
			for (var i = 0; i < instance.lineCount(); i++) {
				if (ed.editableLines.indexOf(i) == -1) {
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
			code += this.game.editor.getLine(i) + ' \n';
		}
	}
	return code;
}
var dimensions = {
	width: 50,
	height: 25
};

function Map(display, game) {
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

	this.refresh = function () {
		this.display.drawAll(this);
	}

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
		return !(this.game.objects[this.getGrid()[x][y].type].impassable);
	};

	// Initialize with empty grid
	this.game = game;
	this.display = display;
	this.reset();
};
/*
Objects can have the following parameters:
	color: '#fff' by default
	impassable: true if it blocks the player from movement (false by default)
	onCollision: function (player, game) called when player moves over the object
	onPickUp: function (player, game) called when player picks up the item
	symbol: Unicode character representing the object
	type: 'item' or null
*/

Game.prototype.objects = {
	// special

	'empty' : {
		'symbol': ' '
	},

	'player' : {
		'symbol': '@',
		'color': '#0f0'
	},

	'exit' : {
		'symbol' : String.fromCharCode(0x2395), // ⎕
		'color': '#0ff',
		'onCollision': function (player, game) {
			game.moveToNextLevel();
		}
	},

	// obstacles

	'block': {
		'symbol': '#',
		'color': '#f00',
		'impassable': true
	},

	'tree': {
		'symbol': '♣',
		'color': '#080',
		'impassable': true
	},

	'trap': {
		'symbol': ' ',
		'onCollision': function (player, game) {
			player.killedBy('an invisible trap');
		}
	},

	'stream': {
		'symbol': '░',
		'onCollision': function (player, game) {
			player.killedBy('drowning in deep dark water');
		}
	},

	// items

	'computer': {
		'type': 'item',
		'symbol': String.fromCharCode(0x2318), // ⌘
		'color': '#ccc',
		'onPickUp': function (player, game) {
			game.output.write('You have picked up the computer! You can use it to get past the walls to the exit.');
			$('#editorPane').fadeIn();
			game.editor.refresh();
		}
	},

	'phone': {
		'type': 'item',
		'symbol': String.fromCharCode(0x260E), // ☎
		'onPickUp': function (player, game) {
			game.output.write('You have picked up the function phone! You can use it to call functions, as defined by setPhoneCallback in the level code.');
			$('#phoneButton').show();
		}
	}
};
function Player(x, y, map) {
	var _x = x;
	var _y = y;
	var _inventory = [];

	this.rep = "@";
	this.fgColor = "#0f0";

	this.map = map;
	this.display = map.display;
	this.game = map.game;

	this.canMove = false;

	this.getX = function () { return _x; }
	this.getY = function () { return _y; }

	this.init = function () {
		// inherit global items from game.currentPlayer
		// (Ideally, it would be nice to store global items as
		//	a class variable, but then we can't make them private.)
		var currentPlayer = this.game.getCurrentPlayer()
		if (currentPlayer) {
			if (currentPlayer.hasItem('computer')) {
				_inventory.push('computer');
			}
			if (currentPlayer.hasItem('phone')) {
				_inventory.push('phone');
			}
		}
	}

	this.draw = function () {
		var bgColor = this.map.getGrid()[_x][_y].bgColor
		this.display.draw(_x, _y, this.rep, this.fgColor, bgColor);
	}

	this.atLocation = function (x, y) {
		return (_x === x && _y === y);
	}

	this.move = function (direction) {
		// are we allowing keyboard input right now?
		if (!this.canMove) {
			return false;
		}

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

		if (this.map.canMoveTo(new_x, new_y)) {
			this.display.drawObject(cur_x,cur_y, this.map.getGrid()[cur_x][cur_y].type, this.map.getGrid()[cur_x][cur_y].bgColor);
			_x = new_x;
			_y = new_y;
			this.draw();
			this.afterMove(_x, _y);
		}
	};

	this.afterMove = function (x, y) {
		var objectName = this.map.getGrid()[x][y].type;
		var object = this.game.objects[objectName];
		if (object.type == 'item') {
			this.pickUpItem(objectName, object);
		} else if (object.onCollision) {
			object.onCollision(this, this.game);
		}
	}

	this.killedBy = function (killer) {
		alert('You have been killed by ' + killer + '!');
		getLevel(currentLevel);
	}

	this.pickUpItem = function (objectName, object) {
		_inventory.push(objectName);
		map.placeObject(_x, _y, 'empty');
		map.refresh();

		if (object.onPickUp) {
			object.onPickUp(this, this.game);
		}
	}

	this.hasItem = function (object) {
		return _inventory.indexOf(object) > -1;
	}

	this.setPhoneCallback = function(func) {
	    this._phoneFunc = func;
	}

	// Constructor
	this.init();
}

var VERBOTEN = ['eval', 'prototype', 'delete', 'return', 'moveToNextLevel'];

// We may want to have level-specific hidden validation rules in the future.
// var validationRulesByLevel = [ null ];

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

		var game = this; var display = this.display; var output = this.output;
		var dummyMap = new Map(new DummyDisplay, this);

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

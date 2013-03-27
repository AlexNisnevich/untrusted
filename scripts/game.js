$(document).ready(function() {
	new Game();
});

function Game() {
	_currentPlayer = null;

	this.levelFileNames = [
		null, // to start levels at 1
		'blocks.jsx',
		'theReturnOfBlocks.jsx',
		'levelThree.jsx',
		'multiplicity.jsx',
		'traps.jsx',
	    'trees.jsx',
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
		this.editor = new CodeEditor("editor", 600, 500);
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

    //TODO clean up getLevel and loadLevel to make the code path
    //more readable and also not re-create the editor every time

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
			game.loadLevel(codeText, levelNumber);
		});
	}

	this.loadLevel = function (lvlCode, lvlNum) {
		// load level code in editor
	    this.editor.loadCode(lvlCode);

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
		var allCode = this.editor.getCode();
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

function Game() {

	var dimensions = {
		width: 50,
		height: 25
	};

	this.dimensions = dimensions;

	_currentPlayer = null;
	_currentCode = '';

	this.levelFileNames = [
		'dummyLevel.jsx', // dummy level to display when level not found
		'blocks.jsx', // levels start here
		'theReturnOfBlocks.jsx',
		'levelThree.jsx',
		'multiplicity.jsx',
		'traps.jsx',
		'trees.jsx',
		'river.jsx',
		'colors.jsx',
		'monster.jsx'
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
			fontSize: 20
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

	// makes an ajax request to get the level text file and
	// then loads it into the game
	this.getLevel = function (levelNumber) {
		var game = this;

		this.currentLevel = levelNumber;

		var fileName;
		if (levelNumber < this.levelFileNames.length) {
			fileName = this.levelFileNames[levelNumber];
		} else {
			fileName = this.levelFileNames[0];
		}

		$.get('levels/' + fileName, function (codeText) {
			game.loadLevel(codeText, levelNumber);
		});
	}

	this.loadLevel = function (lvlCode, lvlNum) {
		// load level code in editor
		this.editor.loadCode(lvlCode);

		// start the level and fade in
		this.evalLevelCode();
		if (lvlNum < this.levelFileNames.length) {
			// don't fade in for dummy level
			this.display.fadeIn(this.map, function () {});
		}

		// on first level, display intro text
		if (this.currentLevel == 1) {
			this.output.write('Dr. Eval awoke in a strange dungeon, with no apparent way out. He spied his trusty computer ...');
		}
	}

	// restart level with currently loaded code
	this.restartLevel = function () {
		this.editor.setCode(_currentCode);
		this.evalLevelCode();
	}

	// reset level
	this.resetEditor = function () {
		this.getLevel(this.currentLevel);
	}

	this.evalLevelCode = function (allCode, playerCode) {
		var game = this;

		// by default, get code from the editor
		var loadedFromEditor = false;
		if (!allCode) {
			allCode = this.editor.getCode();
			playerCode = this.editor.getPlayerCode();
			loadedFromEditor = true;
		}

		// validate the code
		// if it passes validation, return the startLevel function if it pass
		// if it fails validation, return false
		var validatedStartLevel = this.validate(allCode, playerCode, !loadedFromEditor);

		console.log(validatedStartLevel);
		if (validatedStartLevel) {
			// valid code - reset the map, save editor state, and load the level

			this.map.reset();

			_currentCode = allCode;
			if (loadedFromEditor) {
				this.editor.saveGoodState();
			}

			var map = this.map; var display = this.display; var output = this.output;
			validatedStartLevel(map);
			map.refresh();

			_currentPlayer = this.map.getPlayer();
			this.map.getPlayer().canMove = true;

			$('#static').hide();
		} else {
			// show static and reload from last good state
			$('#static').show();
			setTimeout(function () {
				var goodState = game.editor.getGoodState();
				game.evalLevelCode(goodState.code, goodState.playerCode);
			}, 1000);
		}
	}

	this.usePhone = function () {
		if (this.map.getPlayer()._phoneFunc) {
			this.validateCallback(this.map.getPlayer()._phoneFunc);
		} else {
			this.output.write('RotaryPhoneException: Your function phone is not bound to any function.')
		}
	}

	// Constructor
	this.init();
}

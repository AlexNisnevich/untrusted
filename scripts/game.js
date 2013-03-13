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

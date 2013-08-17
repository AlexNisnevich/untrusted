function Game() {

	var dimensions = {
		width: 50,
		height: 25
	};

	this.dimensions = dimensions;

	_currentCode = '';
	_globalInventory = [];
	_commands = [];

	this.levelFileNames = [
		'blocks.jsx', // levels start here
		'theReturnOfBlocks.jsx',
		'levelThree.jsx',
		'multiplicity.jsx',
		'traps.jsx', // 5
		'trees.jsx',
		'river.jsx',
		'colors.jsx',
		'monster.jsx',
		'robot.jsx' // 10
	];

	this.currentLevel = 1;
	this.levelReached = 1;

	this.addToGlobalInventory = function (item) { _globalInventory.push(item); }
	this.checkGlobalInventory = function (item) { return _globalInventory.indexOf(item) > -1; }

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
		this.editor = new CodeEditor("editor", 600, 500);
		this.getLevel(this.currentLevel);
		this.display.focus();

		// Enable shortcut keys
		shortcut.add('ctrl+1', function () { game.openHelp(); return true; });
		shortcut.add('ctrl+2', function () { game.display.focus(); return true; });
		shortcut.add('ctrl+3', function () { game.editor.focus(); return true; });
		shortcut.add('ctrl+4', function () { game.resetEditor(); return true; });
		shortcut.add('ctrl+5', function () { game.evalLevelCode(); return true; });
		shortcut.add('ctrl+6', function () { game.usePhone(); return true; });
		shortcut.add('ctrl+0', function () { game.openMenu(); return true; });

		// Enable buttons
		$("#helpButton").click( function () { game.openHelp();} );
		$("#mapButton").click( function () { game.display.focus();} );
		$("#editorButton").click( function () { game.editor.focus();} );
		$("#resetButton").click( function () { game.resetEditor();} );
		$("#executeButton").click( function () { game.evalLevelCode();} );
		$("#phoneButton").click( function () { game.usePhone();} );
		$("#menuButton").click( function () { game.openMenu();} );

		$("#helpPaneCloseButton").click ( function () {  $('#helpPane').hide();} );
		$("#muteButton").click( function () { game.sound.toggleSound(); } );

		// Start sound
		this.sound = new Sound();
	}

	this.moveToNextLevel = function () {
		var game = this;

		this.currentLevel++;
		this.output.write('Loading level ' + this.currentLevel + ' ...');
		this.map.getPlayer().canMove = false;
		this.display.fadeOut(this.map, function () {
			game.getLevel(game.currentLevel);
		})
	};

	// jumps to the level of the given number
	this.jumpToNthLevel = function (levelNum) {
		// Give the player all necessary objects
		if (levelNum > 1) {
			this.addToGlobalInventory('computer');
			$('#editorPane').fadeIn();
			this.editor.refresh();
		}
		if (levelNum > 6) {
			this.addToGlobalInventory('phone');
			$('#phoneButton').show();
		}
		this.getLevel(levelNum);
	}

	// makes an ajax request to get the level text file and
	// then loads it into the game
	this.getLevel = function (levelNumber) {
		var game = this;

		this.currentLevel = levelNumber;
		this.levelReached = Math.max(levelNumber, this.levelReached);

		var fileName = this.levelFileNames[levelNumber - 1];
		$.get('levels/' + fileName, function (codeText) {
			game.loadLevel(codeText);
		});
	}

	this.loadLevel = function (lvlCode) {
		// load level code in editor
		this.editor.loadCode(lvlCode);

		// start the level and fade in
		this.evalLevelCode();
		this.display.fadeIn(this.map, function () {});

		// store the commands introduced in this level (for api reference)
		_commands = _commands.concat(this.editor.getProperties().commandsIntroduced);

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
		// if it passes validation, returns the startLevel function if it pass
		// if it fails validation, returns false
		var validatedStartLevel = this.validate(allCode, playerCode, !loadedFromEditor);

		if (validatedStartLevel) { // code is valid
			// reset the map
			this.map.reset();

			// save editor state
			_currentCode = allCode;
			if (loadedFromEditor) {
				this.editor.saveGoodState();
			}

			// start the level
			var map = this.map; var display = this.display; var output = this.output;
			validatedStartLevel(map);

			// draw the map
			map.refresh();
			$('#static').hide();

			// finally, allow player movement
			this.map.getPlayer().canMove = true;
		} else { // code is invalid
			// show static and reload from last good state
			$('#static').show();
			setTimeout(function () {
				var goodState = game.editor.getGoodState();
				game.evalLevelCode(goodState.code, goodState.playerCode);
			}, 1000);
		}
	}

	this.openHelp = function () {
		var game = this;

		var categories = [];

		$('#helpPaneSidebar ul').html('');
		$('#helpPaneContent').html('');

		$.each(_commands, function (i, command) {
			if (game.reference[command]) {
				var reference = game.reference[command];

				if (categories.indexOf(reference.category) == -1) {
					categories.push(reference.category);

					var categoryLink = $('<li class="category" id="'+ reference.category +'">');
					categoryLink.text(reference.category)
						.click(function () {
							$('#helpPaneSidebar .category').removeClass('selected');
							$(this).addClass('selected');

							$('#helpPaneContent .category').hide();
							$('#helpPaneContent .category#' + this.id).show();
					});
					$('#helpPaneSidebar ul').append(categoryLink);

					$('#helpPaneContent').append($('<div class="category" id="'+ reference.category +'">'));
				}

				var $command = $('<div class="command">');
				$command.appendTo($('#helpPaneContent .category#' + reference.category));

				var $commandTitle = $('<div class="commandTitle">');
				$commandTitle.text(reference.name)
					.appendTo($command);

				var $commandDescription = $('<div class="commandDescription">');
				$commandDescription.html(reference.description)
					.appendTo($command);

			}
		})

		if (!$('#helpPane').is(':visible')) {
			$('#helpPane').show();
			$('#helpPaneSidebar .category#global').click();
		} else {
			$('#helpPane').hide();
		}
	}

	this.openMenu = function () {
		var game = this;

		$('#menuPane #levels').html('');
		$.each(game.levelFileNames, function (levelNum, fileName) {
			levelNum += 1;
			var levelName = levelNum + ". " + fileName.split('.')[0];

			var levelButton = $('<button>');
			if (levelNum <= game.levelReached) {
				levelButton.text(levelName).click(function () {
					game.jumpToNthLevel(levelNum);
					$('#menuPane').hide();
				});
			} else {
				levelButton.text('???').addClass('disabled');
			}
			levelButton.appendTo('#menuPane #levels');
		});

		if (!$('#menuPane').is(':visible')) {
			$('#menuPane').show();
		} else {
			$('#menuPane').hide();
		}
	}

	this.usePhone = function () {
		if (this.map.getPlayer()._phoneFunc) {
			this.validateCallback(this.map.getPlayer()._phoneFunc);
		} else {
			this.output.write('PhoneException: Your function phone is not bound to any function.')
		}
	}

	// Constructor
	this.init();
}

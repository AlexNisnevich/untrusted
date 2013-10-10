Game.prototype.enableShortcutKeys = function () {
	var game = this;

	shortcut.add('ctrl+1', function () {
		game.sound.playSound('select');
		game.openHelp();
		return true;
	});

	shortcut.add('ctrl+2', function () {
		game.sound.playSound('select');
		game.display.focus();
		return true;
	});

	shortcut.add('ctrl+3', function () {
		game.sound.playSound('select');
		game.editor.focus();
		return true;
	});

	shortcut.add('ctrl+4', function () {
		game.sound.playSound('select');
		game.resetEditor();
		return true;
	});

	shortcut.add('ctrl+5', function () {
		game.sound.playSound('blip');
		game.evalLevelCode();
		return true;
	});

	shortcut.add('ctrl+6', function () {
		game.sound.playSound('select');
		game.usePhone();
		return true;
	});

    shortcut.add('z', function () {
		game.sound.playSound('select');
		game.usePhone();
		return true;
    });

	shortcut.add('ctrl+0', function () {
		game.sound.playSound('select');
		game.openMenu();
		return true;
	});
}

Game.prototype.enableButtons = function () {
	var game = this;

	$("#helpButton").click( function () {
		game.sound.playSound('select');
		game.openHelp();
	});

	$("#mapButton").click( function () {
		game.sound.playSound('select');
		game.display.focus();
	});

	$("#editorButton").click( function () {
		game.sound.playSound('select');
		game.editor.focus();
	});

	$("#resetButton").click( function () {
		game.sound.playSound('select');
		game.resetEditor();
	});

	$("#executeButton").click( function () {
		game.sound.playSound('blip');
		game.evalLevelCode();
	});

	$("#phoneButton").click( function () {
		game.sound.playSound('select');
		game.usePhone();
	});

	$("#menuButton").click( function () {
		game.sound.playSound('select');
		game.openMenu();
	});

	$("#helpPaneCloseButton").click ( function () {
		game.sound.playSound('select');
		$('#helpPane').hide();
	});

	$("#muteButton").click( function () {
		game.sound.toggleSound();
	});
}

Game.prototype.usePhone = function () {
	if (this.map.getPlayer()._phoneFunc) {
		this.validateCallback(this.map.getPlayer()._phoneFunc);
	} else {
		this.output.write('PhoneException: Your function phone is not bound to any function.')
	}
}

Game.prototype.openMenu = function () {
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

Game.prototype.openHelp = function () {
	var game = this;

	var categories = [];

	$('#helpPaneSidebar ul').html('');
	$('#helpPaneContent').html('');

	// build help
	$.each(game.getHelpCommands(), function (i, command) {
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
	});

	// sort help commands
	$('#helpPaneContent .category .command').sortElements(function (a, b) {
		var contentA = $(a).find('.commandTitle').text();
		var contentB = $(b).find('.commandTitle').text();
		return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
	});

	if (!$('#helpPane').is(':visible')) {
		$('#helpPane').show();
		$('#helpPaneSidebar .category#global').click();
	} else {
		$('#helpPane').hide();
	}
}

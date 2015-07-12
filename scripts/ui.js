var toggleFocus = (function () {
    var focus_state = undefined;
    return function do_toggle(game) {
        if (!focus_state || focus_state === 'display') {
            focus_state = 'editor';
            game.editor.focus();
        } else if (focus_state === 'editor') {
            focus_state = 'display';
            game.display.focus();
        }
    };
})();

Game.prototype.enableShortcutKeys = function () {
    var game = this;

    shortcut.add('ctrl+1', function () {
        $("#helpButton").click();
        return true;
    });

	shortcut.add('ctrl+2', function () {
        $("#toggleFocusButton").click();
		return true;
	});

    shortcut.add('ctrl+3', function () {
        $("#notepadButton").click();
        return true;
    });

    shortcut.add('ctrl+4', function () {
        $("#resetButton").click();
        return true;
    });

    shortcut.add('ctrl+5', function () {
        $("#executeButton").click();
        return true;
    });

    shortcut.add('ctrl+6', function () {
        $("#phoneButton").click();
        return true;
    });

    shortcut.add('ctrl+0', function () {
        $("#menuButton").click();
        return true;
    });
};

Game.prototype.enableButtons = function () {
    var game = this;

    $("#helpButton").click( function () {
        game.sound.playSound('select');
        game.openHelp();
    });

    $("#toggleFocusButton").click( function () {
        game.sound.playSound('select');
        toggleFocus(game);
    });

    $('#notepadButton').click( function () {
        game.sound.playSound('select');
        $('#helpPane, #menuPane').hide();
        $('#notepadPane').toggle();
        game.notepadEditor.refresh();
        return true;
    });

    $("#resetButton").click( function () {
        game.sound.playSound('blip');
        game._resetLevel( game._currentLevel );
    });

    $("#executeButton").click( function () {
        game.sound.playSound('blip');
        game._evalLevelCode();
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
};

Game.prototype.setUpNotepad = function () {
    var game = this;

    var textarea = document.getElementById('notepadTextarea');
    this.notepadEditor = CodeMirror.fromTextArea(textarea, {
        theme: 'vibrant-ink',
        lineNumbers: true,
        mode: 'javascript'
    });

    this.notepadEditor.setSize(null, 275);

    var ls_tag = 'notepadContent';
    var content = localStorage.getItem(this._getLocalKey(ls_tag));
    if (content === null) {
        content = '';
    }
    this.notepadEditor.setValue(content);

    $('#notepadPaneCloseButton').click(function () {
        $('#notepadPane').hide();
    });

    $('#notepadSaveButton').click(function () {
        var v = game.notepadEditor.getValue();
        localStorage.setItem(this._getLocalKey(ls_tag), v);
    });
};

Game.prototype.openMenu = function () {
    var game = this;

    $('#menuPane #levels').html('');
    $.each(game._levelFileNames, function (levelNum, fileName) {
        levelNum += 1;
        var levelName = fileName.split('.')[0];
        levelName = levelName.split('_').join(' ');

        var levelButton = $('<button>');
        if (levelNum <= game._levelReached) {
            levelButton.text(levelName).click(function () {
                game._jumpToNthLevel(levelNum);
                $('#menuPane').hide();
            });
        } else {
            levelButton.text('???').addClass('disabled');
        }
        levelButton.appendTo('#menuPane #levels');
    });

    $('#helpPane, #notepadPane').hide();
    $('#menuPane').toggle();
};

Game.prototype.activateSuperMenu = function () {
    var game = this;

    if (!game._superMenuActivated) {
        $('#menuPane').addClass('expanded');
        $('#leftMenuPane').show();
        $('#rightMenuPane .pop_up_box_heading').hide();

        $('#rootDir').click(function () {
            $('#leftMenuPane li').removeClass('selected');
            $('#rightMenuPane div').hide();
            $('#rootDir').addClass('selected');
            $('#root').show();
        });

        $('#levelsDir').click(function () {
            $('#leftMenuPane li').removeClass('selected');
            $('#rightMenuPane div').hide();
            $('#levelsDir').addClass('selected');
            $('#levels').show();
        });

        $('#scriptsDir').click(function () {
            $('#leftMenuPane li').removeClass('selected');
            $('#rightMenuPane div').hide();
            $('#scriptsDir').addClass('selected');
            $('#scripts').show();
        });

        $('#bonusDir').click(function () {
            $('#leftMenuPane li').removeClass('selected');
            $('#rightMenuPane div').hide();
            $('#bonusDir').addClass('selected');
            $('#bonus').show();
        });

        $.each(game._viewableScripts, function (i, script) {
            var scriptButton = $('<button>');
            scriptButton.text(script).click(function () {
                game._editFile('scripts/' + script);
                $('#menuPane').hide();
            });

            if (game._editableScripts.indexOf(script) == -1) {
                scriptButton.addClass('uneditable');
            }

            scriptButton.appendTo('#menuPane #scripts');
        });

        $.each(game._bonusLevels, function (i, lvl) {
            var lvlButton = $('<button>');
            lvlButton.text(lvl).click(function () {
                game._getLevelByPath('levels/bonus/' + lvl);
                $('#menuPane').hide();
            });

            lvlButton.appendTo('#menuPane #bonus');
        });

        $('#menuLabel').text('Menu+');

        game._superMenuActivated = true;
    }
}

Game.prototype.openHelp = function () {
    var game = this;

    var categories = [];

    $('#helpPaneSidebar ul').html('');
    $('#helpPaneContent').html('');

    // build help
    $.each(game._getHelpCommands(), function (i, command) {
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
    $('#helpPaneContent .category').each(function (i, category) {
        $(category).find('.command').sortElements(function (a, b) {
            var contentA = $(a).find('.commandTitle').text();
            var contentB = $(b).find('.commandTitle').text();
            return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
        });
    });

    if (!$('#helpPane').is(':visible')) {
        $('#menuPane, #notepadPane').hide();
        $('#helpPane').show();
        $('#helpPaneSidebar .category#global').click();
    } else {
        $('#helpPane').hide();
    }
};

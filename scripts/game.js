function Game(debugMode, startLevel) {
    /* private properties */

    var __currentCode = '';
    var __commands = [];
    var __playerCodeRunning = false;

    /* unexposed properties */

    this._dimensions = {
        width: 50,
        height: 25
    };

    this._levelFileNames = [
//%LEVELS%
    ];

    this._bonusLevels = [
//%BONUS%
    ].filter(function (lvl) { return (lvl.indexOf('_') != 0); }); // filter out bonus levels that start with '_'

    this._mod = '//%MOD%';

    this._viewableScripts = [
        'codeEditor.js',
        'display.js',
        'dynamicObject.js',
        'game.js',
        'inventory.js',
        'map.js',
        'objects.js',
        'player.js',
        'reference.js',
        'sound.js',
        'ui.js',
        'util.js',
        'validate.js'
    ];

    this._editableScripts = [
        'map.js',
        'objects.js',
        'player.js'
    ];

    this._resetTimeout = null;
    this._currentLevel = 0;
    this._currentFile = null;
    this._currentBonusLevel = null;
    this._levelReached = 1;
    this._displayedChapters = [];

    this._playerPrototype = Player; // to allow messing with map.js and player.js later

    this._nextBonusLevel = null;

    /* unexposed getters */

    this._getHelpCommands = function () { return __commands; };
    this._isPlayerCodeRunning = function () { return __playerCodeRunning; };
    this._getLocalKey = function (key) { return (this._mod.length == 0 ? '' : this._mod + '.') + key; };

    /* unexposed setters */

    this._setPlayerCodeRunning = function (pcr) { __playerCodeRunning = pcr; };

    /* unexposed methods */

    this._initialize = function () {
        // Get last level reached from localStorage (if any)
        var levelKey = this._mod.length == 0 ? 'levelReached' : this._mod + '.levelReached';
        this._levelReached = parseInt(localStorage.getItem(levelKey)) || 1;

        // Fix potential corruption
        // levelReached may be "81111" instead of "8" due to bug
        if (this._levelReached > this._levelFileNames.length) {
            for (var l = 1; l <= this._levelFileNames.length; l++) {
                if (!localStorage[this._getLocalKey("level" + l + ".lastGoodState")]) {
                    this._levelReached = l - 1;
                    break;
                }
            }
        }

        // Initialize sound
        this.sound = new Sound('local');
        // this.sound = new Sound(debugMode ? 'local' : 'cloudfront');

        // Initialize map display
        this.display = ROT.Display.create(this, {
            width: this._dimensions.width,
            height: this._dimensions.height,
            fontSize: 20
        });
        this.display.setupEventHandlers();
        var display = this.display;
        $('#screen').append(this.display.getContainer());
        $('#drawingCanvas, #dummyDom, #dummyDom *').click(function () {
            display.focus();
        });

        // Initialize editor, map, and objects
        this.editor = new CodeEditor("editor", 600, 500, this);
        this.map = new Map(this.display, this);
        this.objects = this.getListOfObjects();

        // Enable controls
        this.enableShortcutKeys();
        this.enableButtons();
        this.setUpNotepad();

        // Load help commands from local storage (if possible)
        if (localStorage.getItem(this._getLocalKey('helpCommands'))) {
            __commands = localStorage.getItem(this._getLocalKey('helpCommands')).split(';');
        }

        // Enable debug features
        if (debugMode) {
            this._debugMode = true;
            this._levelReached = 999; // make all levels accessible
            __commands = Object.keys(this.reference); // display all help
            this.sound.toggleSound(); // mute sound by default in debug mode
        }

        // Lights, camera, action
        if (startLevel) {
            this._currentLevel = startLevel - 1;
            this._getLevel(startLevel, debugMode);
        } else if (!debugMode && this._levelReached != 1) {
            // load last level reached (unless it's the credits)
            this._getLevel(Math.min(this._levelReached, 21));
        } else {
            this._intro();
        }
    };

    this._intro = function () {
        this.display.focus();
        this.display.playIntro(this.map);
    };

    this._start = function (lvl) {
        this._getLevel(lvl ? lvl : 1);
    };

    this._moveToNextLevel = function () {
        // is the player permitted to exit?
        if (typeof this.onExit === 'function') {
            var game = this;
            var canExit = this.validateCallback(function () {
                    return game.onExit(game.map);
            });
            if (!canExit) {
                this.sound.playSound('blip');
                return;
            }
        }

        this.sound.playSound('complete');

        //we disable moving so the player can't move during the fadeout
        this.map.getPlayer()._canMove = false;

        if (this._currentLevel == 'bonus') {
            if (this._nextBonusLevel) {
                this._getLevelByPath("levels/bonus/" + this._nextBonusLevel);
            } else {
                // open main menu
                $('#helpPane, #notepadPane').hide();
                $('#menuPane').show();
            }
        } else {
            this._getLevel(this._currentLevel + 1, false, true);
        }
    };

    this._jumpToNthLevel = function (levelNum) {
        this._currentFile = null;
        this._getLevel(levelNum, false, false);
        this.display.focus();
        this.sound.playSound('blip');
    };

    // makes an ajax request to get the level text file and
    // then loads it into the game
    this._getLevel = function (levelNum, isResetting, movingToNextLevel) {
        var game = this;
        var editor = this.editor;

        if (levelNum > this._levelFileNames.length) {
            return;
        }

        this._levelReached = Math.max(levelNum, this._levelReached);
        if (!debugMode) {
            localStorage.setItem(this._getLocalKey('levelReached'), this._levelReached);
        }

        var fileName = this._levelFileNames[levelNum - 1];

        lvlCode = this._levels['levels/' + fileName];
        if (movingToNextLevel) {
            // save level state and create a gist
            editor.saveGoodState();
            editor.createGist();
        }

        game._currentLevel = levelNum;
        game._currentBonusLevel = null;
        game._currentFile = null;

        // load level code in editor
        editor.loadCode(lvlCode);

        // restored saved state for this level?
        if (!isResetting && editor.getGoodState(levelNum)) {
            // unless the current level is a newer version
            var newVer = editor.getProperties().version;
            var savedVer = editor.getGoodState(levelNum).version;
            if (!(newVer && (!savedVer || isNewerVersion(newVer, savedVer)))) {
                // restore saved line/section/endOfStartLevel state if possible
                if (editor.getGoodState(levelNum).endOfStartLevel) {
                    editor.setEndOfStartLevel(editor.getGoodState(levelNum).endOfStartLevel);
                }
                if (editor.getGoodState(levelNum).editableLines) {
                    editor.setEditableLines(editor.getGoodState(levelNum).editableLines);
                }
                if (editor.getGoodState(levelNum).editableSections) {
                    editor.setEditableSections(editor.getGoodState(levelNum).editableSections);
                }

                // restore saved code
                editor.setCode(editor.getGoodState(levelNum).code);
            }
        }

        // start the level and fade in
        game._evalLevelCode(null, null, true);
        game.display.focus();

        // store the commands introduced in this level (for api reference)
        __commands = __commands.concat(editor.getProperties().commandsIntroduced).unique();
        localStorage.setItem(this._getLocalKey('helpCommands'), __commands.join(';'));
    };

    this._getLevelByPath = function (filePath) {
        var game = this;
        var editor = this.editor;

        $.get(filePath, function (lvlCode) {
            game._currentLevel = 'bonus';
            game._currentBonusLevel = filePath.split("levels/")[1];
            game._currentFile = null;

            // load level code in editor
            editor.loadCode(lvlCode);

            // save next bonus level
            game._nextBonusLevel = editor.getProperties()["nextBonusLevel"];

            // start the level and fade in
            game._evalLevelCode(null, null, true);
            game.display.focus();

            // store the commands introduced in this level (for api reference)
            __commands = __commands.concat(editor.getProperties().commandsIntroduced).unique();
            localStorage.setItem(this._getLocalKey('helpCommands'), __commands.join(';'));
        }, 'text');

    };

    // how meta can we go?
    this._editFile = function (filePath) {
        var game = this;

        var fileName = filePath.split('/')[filePath.split('/').length - 1];
        game._currentFile = filePath;

        $.get(filePath, function (code) {
            // load level code in editor
            if (game._editableScripts.indexOf(fileName) > -1) {
                game.editor.loadCode('#BEGIN_EDITABLE#\n' + code + '\n#END_EDITABLE#');
            } else {
                game.editor.loadCode(code);
            }
        }, 'text');
    };

    this._resetLevel = function( level ) {
        var game = this;
        var resetTimeout_msec = 2500;
        var reset_game_msg = "To reset this level press ^4 again.";

        if ( this._resetTimeout != null ) {
            $('body, #buttons').css('background-color', '#000');
            window.clearTimeout( this._resetTimeout );
            this._resetTimeout = null;

            if (game._currentBonusLevel) {
                game._getLevelByPath('levels/' + game._currentBonusLevel);
            } else {
                this._getLevel(level, true);
            }
            if(game.map._status == reset_game_msg) {
                game.map.writeStatus("");
            }
        } else {
            this.map.writeStatus(reset_game_msg);
            $('body, #buttons').css('background-color', '#900');

            this._resetTimeout = setTimeout(function () {
                game._resetTimeout = null;
                if(game.map._status == reset_game_msg) {
                    game.map.writeStatus("");
                }

                $('body, #buttons').css('background-color', '#000');
            }, resetTimeout_msec );
        }
    };

    // restart level with currently loaded code
    this._restartLevel = function () {
        this.editor.setCode(__currentCode);
        this._evalLevelCode();
    };

    this._evalLevelCode = function (allCode, playerCode, isNewLevel, restartingLevelFromScript) {
        this.map._clearIntervals();
        var game = this;

        // by default, get code from the editor
        var loadedFromEditor = false;
        if (!allCode) {
            allCode = this.editor.getCode();
            playerCode = this.editor.getPlayerCode();
            loadedFromEditor = true;
        }

        // if we're editing a script file, do something completely different
        if (this._currentFile !== null && !restartingLevelFromScript) {
            __currentCode = allCode;
            this.validateAndRunScript(allCode);
            return;
        }

        // save current display state (for scrolling up later)
        this.display.saveGrid(this.map);

        // validate the code
        // if it passes validation, returns the startLevel function if it pass
        // if it fails validation, returns false
        var validatedStartLevel = this.validate(allCode, playerCode, restartingLevelFromScript);

        if (validatedStartLevel) { // code is valid
            // reset the map
            this.map._reset(); // for cleanup
            this.map = new Map(this.display, this);
            this.map._reset();
            this.map._setProperties(this.editor.getProperties()['mapProperties']);

            // save editor state
            if (!restartingLevelFromScript) {
                __currentCode = allCode;
            }
            if (loadedFromEditor && !restartingLevelFromScript) {
                this.editor.saveGoodState();
            }

            // clear drawing canvas and hide it until level loads
            var screenCanvas = $('#screen canvas')[0];
            $('#drawingCanvas')[0].width = screenCanvas.width;
            $('#drawingCanvas')[0].height = screenCanvas.height;
            $('#drawingCanvas').hide();
            $('#dummyDom').hide();

            // set correct inventory state
            this.setInventoryStateByLevel(this._currentLevel);

            // start the level
            validatedStartLevel(this.map);
            
            // Add the computer to bonus levels that lack it
            if (this._currentLevel == "bonus" && this.map.countObjects("computer") == 0) {
                this.addToInventory("computer")
                $('#editorPane, #savedLevelMsg').show();
                this.editor.refresh();
            }

            // draw the map
            this.display.fadeIn(this.map, isNewLevel ? 100 : 10, function () {
                game.map.refresh(); // refresh inventory display

                // show map overlays if necessary
                if (game.map._properties.showDrawingCanvas) {
                    $('#drawingCanvas').show();
                } else if (game.map._properties.showDummyDom) {
                    $('#dummyDom').show();
                }

                // workaround because we can't use writeStatus() in startLevel()
                // (due to the text getting overwritten by the fade-in)
                if (game.editor.getProperties().startingMessage) {
                    game.map.writeStatus(game.editor.getProperties().startingMessage);
                }
            });

            this.map._ready();

            // start bg music for this level
            if (this.editor.getProperties().music) {
                this.sound.playTrackByName(this.editor.getProperties().music);
            }

            // activate super menu if 21_endOfTheLine has been reached
            if (this._levelReached >= 21) {
                this.activateSuperMenu();
            }

            // finally, allow player movement
            if (this.map.getPlayer()) {
                this.map.getPlayer()._canMove = true;
                game.display.focus();
            }
        } else { // code is invalid
            // play error sound
            this.sound.playSound('static');

            // disable player movement
            this.map.getPlayer()._canMove = false;
        }
    };

    this._callUnexposedMethod = function(f) {
        if (__playerCodeRunning) {
            __playerCodeRunning = false;
            try {
                res = f();
            } finally {
                __playerCodeRunning = true;
            }
            return res;
        } else {
            return f();
        }
    };
    this._checkObjective = function() {
        if (typeof(this.objective) === 'function') {
            var game = this;
            var objectiveIsMet = this.validateCallback(function() {
                return game.objective(game.map);
            });
            if (objectiveIsMet) {
                this._moveToNextLevel();
            }
        }
    }
}

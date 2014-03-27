function Game(debugMode, startLevel) {
    /* private properties */

    var __currentCode = '';
    var __commands = [];


    /* unexposed properties */

    this._dimensions = {
        width: 50,
        height: 25
    };

    this._levelFileNames = [
        '01_cellBlockA.jsx',
        '02_theLongWayOut.jsx',
        '03_validationEngaged.jsx',
        '04_multiplicity.jsx',
        '05_minesweeper.jsx',
        '06_drones101.jsx',
        '07_colors.jsx',
        '08_intoTheWoods.jsx',
        '09_fordingTheRiver.jsx',
        '10_ambush.jsx',
        '11_robot.jsx',
        '12_robotNav.jsx',
        '13_robotMaze.jsx',
        '14_crispsContest.jsx',
        '15_exceptionalCrossing.jsx',
        '16_lasers.jsx',
        '17_pointers.jsx',
        '18_superDrEvalBros.jsx',
        '19_documentObjectMadness.jsx',
        '20_bossFight.jsx',
        '21_theEnd.jsx',
        'XX_credits.jsx'
    ];

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

    this._currentLevel = 1;
    this._currentFile = null;
    this._levelReached = localStorage.getItem('levelReached') || 1;
    this._displayedChapters = [];

    this._eval = window.eval; // store our own copy of eval so that we can override window.eval
    this._playerPrototype = Player; // to allow messing with map.js and player.js later

    /* unexposed getters */

    this._getHelpCommands = function () { return __commands; };

    /* unexposed methods */

    this._initialize = function () {
        // _initialize sound
        this.sound = new Sound();

        // _initialize map display
        this.display = ROT.Display.create(this, {
            width: this._dimensions.width,
            height: this._dimensions.height,
            fontSize: 20
        });
        this.display.setupEventHandlers();
        var display = this.display;
        $('#screen').append(this.display.getContainer());
        $('#drawingCanvas').click(function () {
            display.focus();
        });

        // _initialize map and editor
        this.editor = new CodeEditor("editor", 600, 500, this);
        this.map = new Map(this.display, this);

        // Enable controls
        this.enableShortcutKeys();
        this.enableButtons();
        this.setUpNotepad();

        // Load help commands from local storage (if possible)
        if (localStorage.getItem('helpCommands')) {
            __commands = localStorage.getItem('helpCommands').split(';');
        }

        // keep track of current global variables
        this._globalVars = [];
        for (p in window) {
            if (window.propertyIsEnumerable(p)) {
                this._globalVars.push(p);
            }
        }

        // Enable debug features
        if (debugMode) {
            this._levelReached = 999; // make all levels accessible
            __commands = Object.keys(this.reference); // display all help
            this.sound.toggleSound(); // mute sound by default in debug mode
        }

        // Lights, camera, action
        if (startLevel) {
            this._currentLevel = startLevel;
            this._getLevel(startLevel, debugMode);
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
        if (typeof this.onExit === 'function' && !this.onExit(this.map)) {
            this.sound.playSound('blip');
            return;
        }

        // save level state and create a gist
        this.editor.saveGoodState();
        this.editor.createGist();

        this._currentLevel++;
        this._currentFile = null;
        this.sound.playSound('complete');

        //we disable moving so the player can't move during the fadeout
        this.map.getPlayer()._canMove = false;
        this._getLevel(this._currentLevel);
    };

    this._jumpToNthLevel = function (levelNum) {
        this._currentLevel = levelNum;
        this._currentFile = null;
        this._getLevel(levelNum);
        this.display.focus();
        this.sound.playSound('blip');
    };

    // makes an ajax request to get the level text file and
    // then loads it into the game
    this._getLevel = function (levelNum, isResetting) {
        var game = this;
        var editor = this.editor;

        game._levelReached = Math.max(levelNum, game._levelReached);
        if (!debugMode) {
            localStorage.setItem('levelReached', game._levelReached);
        }

        var fileName = game._levelFileNames[levelNum - 1];
        $.get('levels/' + fileName, function (lvlCode) {
            // load level code in editor
            editor.loadCode(lvlCode);

            // restored saved state for this level?
            if (!isResetting && editor.getGoodState(levelNum)) {
                // unless the current level is a newer version
                var newVer = editor.getProperties().version;
                var savedVer = editor.getGoodState(levelNum).version;
                if (!(newVer && (!savedVer || isNewerVersion(newVer, savedVer)))) {
                    editor.setCode(editor.getGoodState(levelNum).code);
                    if (editor.getGoodState(levelNum).endOfStartLevel) {
                        editor.setEndOfStartLevel(editor.getGoodState(levelNum).endOfStartLevel);
                    }
                }
            }

            // start the level and fade in
            game._evalLevelCode(null, null, true);
            game.display.focus();

            // store the commands introduced in this level (for api reference)
            __commands = __commands.concat(editor.getProperties().commandsIntroduced).unique();
            localStorage.setItem('helpCommands', __commands.join(';'));
        });
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
    }

    // restart level with currently loaded code
    this._restartLevel = function () {
        this.editor.setCode(__currentCode);
        this._evalLevelCode();
    };

    this._evalLevelCode = function (allCode, playerCode, isNewLevel, restartingLevelFromScript) {
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
            this.map._reset();
            this.map._setProperties(this.editor.getProperties()['mapProperties']);

            // save editor state
            __currentCode = allCode;
            if (loadedFromEditor && !restartingLevelFromScript) {
                this.editor.saveGoodState();
            }

            // clear drawing canvas and hide it until level loads
            $('#drawingCanvas')[0].width = $('#drawingCanvas')[0].width;
            $('#drawingCanvas').hide();

            // set correct inventory state
            this.setInventoryStateByLevel(this._currentLevel);

            // start the level
            validatedStartLevel(this.map);
            this.clearModifiedGlobals();

            // draw the map
            this.display.fadeIn(this.map, isNewLevel ? 100 : 10, function () {
                game.map.refresh(); // refresh inventory display
                $('#drawingCanvas').show(); // show the drawing canvas again

                // workaround because we can't use writeStatus() in startLevel()
                // (due to the text getting overwritten by the fade-in)
                if (game.editor.getProperties().startingMessage) {
                    game.display.writeStatus(game.editor.getProperties().startingMessage);
                }
            });

            this.map._ready();

            // start bg music for this level
            if (this.editor.getProperties().music) {
                this.sound.playTrackByName(this._currentLevel, this.editor.getProperties().music);
            } else {
                this.sound.playTrackByNum(this._currentLevel);
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
}

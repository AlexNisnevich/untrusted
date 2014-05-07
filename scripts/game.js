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
        '21_endOfTheLine.jsx',
        '22_credits.jsx'
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
    
    this._resetTimeout = null;
    this._currentLevel = 0;
    this._currentFile = null;
    this._levelReached = parseInt(localStorage.getItem('levelReached')) || 1;
    this._displayedChapters = [];

    this._eval = window.eval; // store our own copy of eval so that we can override window.eval
    this._playerPrototype = Player; // to allow messing with map.js and player.js later

    /* unexposed getters */

    this._getHelpCommands = function () { return __commands; };

    /* unexposed methods */

    this._initialize = function () {
        // Fix potential corruption
        // levelReached may be "81111" instead of "8" due to bug
        if (this._levelReached > this._levelFileNames.length) {
            for (var l = 1; l <= this._levelFileNames.length; l++) {
                if (!localStorage["level" + l + ".lastGoodState"]) {
                    this._levelReached = l - 1;
                    break;
                }
            }
        }

        // Initialize sound
        this.sound = new Sound(debugMode ? 'local' : 'cloudfront');

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

        // Initialize map and editor
        this.editor = new CodeEditor("editor", 600, 500, this);
        this.map = new Map(this.display, this);

        // Initialize validator
        this.saveReferenceImplementations(); // prevents tampering with methods
        this._globalVars = []; // keep track of current global variables
        for (p in window) {
            if (window.propertyIsEnumerable(p)) {
                this._globalVars.push(p);
            }
        }

        // Enable controls
        this.enableShortcutKeys();
        this.enableButtons();
        this.setUpNotepad();

        // Load help commands from local storage (if possible)
        if (localStorage.getItem('helpCommands')) {
            __commands = localStorage.getItem('helpCommands').split(';');
        }

        // Enable debug features
        if (debugMode) {
            this._debugMode = true;
            this._levelReached = 999; // make all levels accessible
            __commands = Object.keys(this.reference); // display all help
            this.sound.toggleSound(); // mute sound by default in debug mode
        } else {
            // some people are at work right now
            if (document.referrer.indexOf('news.ycombinator.com') > -1) {
                this.toggleSound();
            }
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
        if (typeof this.onExit === 'function' && !this.onExit(this.map)) {
            this.sound.playSound('blip');
            return;
        }

        this.sound.playSound('complete');

        //we disable moving so the player can't move during the fadeout
        this.map.getPlayer()._canMove = false;
        this._getLevel(this._currentLevel + 1, false, true);
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

        if (levelNum > game._levelFileNames.length) {
            return;
        }

        game._levelReached = Math.max(levelNum, game._levelReached);
        if (!debugMode) {
            localStorage.setItem('levelReached', game._levelReached);
        }

        var fileName = game._levelFileNames[levelNum - 1];

        lvlCode = this._levels['levels/' + fileName];
        if (movingToNextLevel) {
            // save level state and create a gist
            editor.saveGoodState();
            editor.createGist();
        }

        game._currentLevel = levelNum;
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
        localStorage.setItem('helpCommands', __commands.join(';'));
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
        
        if ( this._resetTimeout != null ) {
            $('body, #buttons').css('background-color', '#000');
            window.clearTimeout( this._resetTimeout );
            this._resetTimeout = null;
            
            this._getLevel(level, true);
        } else {
            this.display.writeStatus("To reset this level press ^4 again.");
            $('body, #buttons').css('background-color', '#900');
            
            this._resetTimeout = setTimeout(function () {
                game._resetTimeout = null;
                
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
            this.map._reset(); // for cleanup
            this.map = new Map(this.display, this);
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
            $('#dummyDom').hide();

            // set correct inventory state
            this.setInventoryStateByLevel(this._currentLevel);

            // start the level
            validatedStartLevel(this.map);

            // deal with sneaky players
            this.clearModifiedGlobals();

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
                    game.display.writeStatus(game.editor.getProperties().startingMessage);
                }
            });

            this.map._ready();

            // start bg music for this level
            if (this.editor.getProperties().music) {
                this.sound.playTrackByName(this.editor.getProperties().music);
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

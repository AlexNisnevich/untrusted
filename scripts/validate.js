Game.prototype.verbotenWords = [
    '._', '"_', "'_", // prevents calling _unexposed methods
    'eval', 'call', 'apply', 'bind', // prevents arbitrary code execution
    'prototype', // prevents messing with prototypes
    'setTimeout', 'setInterval', // requires players to use map.startTimer() instead
    'prompt', 'confirm', // prevents dialogs asking for user input
    'debugger', // prevents pausing execution
    'delete', // prevents removing items
    'window', // prevents setting "window.[...] = map", etc.
    'this[' // prevents this['win'+'dow'], etc.
];
Game.prototype.allowedTime = 2000; // for infinite loop prevention

var DummyDisplay = function () {
    this.clear = function () {};
    this.drawAll = function () {};
    this.drawObject = function () {};
    this.drawText = function () {};
    this.writeStatus = function () {};
};

Game.prototype.validate = function(allCode, playerCode, restartingLevelFromScript) {
    var game = this;

    try {
        for (var i = 0; i < this.verbotenWords.length; i++) {
            var badWord = this.verbotenWords[i];
            if (playerCode.indexOf(badWord) > -1) {
                throw 'You are not allowed to use ' + badWord + '!';
            }
        }

        var dummyMap = new Map(new DummyDisplay(), this);
        dummyMap._setProperties(this.editor.getProperties().mapProperties);

        // modify the code to always check time to prevent infinite loops
        allCode = allCode.replace(/\)\s*{/g, ") {"); // converts Allman indentation -> K&R
        allCode = $.map(allCode.split('\n'), function (line, i) {
            return line.replace(/((for|while) .*){/g,
                "startTime = Date.now();" +
                "$1{" +
                    "if (Date.now() - startTime > " + game.allowedTime + ") {" +
                        "throw '[Line " + (i+1) + "] TimeOutException: Maximum loop execution time of " + game.allowedTime + " ms exceeded.';" +
                    "}");
        }).join('\n');

        // evaluate the code to get startLevel() and (opt) validateLevel() methods

        this._eval(allCode);

        // start the level on a dummy map to validate
        this._endOfStartLevelReached = false;
        startLevel(dummyMap);

        // does startLevel() execute fully?
        // (if we're restarting a level after editing a script, we can't test for this
        // - nor do we care)
        if (!this._endOfStartLevelReached && !restartingLevelFromScript) {
            throw 'startLevel() returned prematurely!';
        }

        this.validateLevel = function () { return true; };
        // does validateLevel() succeed?
        if (typeof(validateLevel) === "function") {
            this.validateLevel = validateLevel;
            validateLevel(dummyMap);
        }

        this.onExit = function () { return true; };
        if (typeof onExit === "function") {
            this.onExit = onExit;
        }

        this.objective = function () { return false; };
        if (typeof objective === "function") {
            this.objective = objective;
        }

        return startLevel;
    } catch (e) {
        var exceptionText = e.toString();
        if (e instanceof SyntaxError) {
            var lineNum = this.findSyntaxError(allCode, e.message);
            if (lineNum) {
                exceptionText = "[Line " + lineNum + "] " + exceptionText;
            }
        }
        this.display.appendError(exceptionText);

        // throw e; // for debugging
        return null;
    }
};

// makes sure nothing un-kosher happens during a callback within the game
// e.g. item collison; function phone
Game.prototype.validateCallback = function(callback) {
    try {
        // run the callback
        callback();

        // check if validator still passes
        try {
            if (typeof(this.validateLevel) === 'function') {
                this.validateLevel(this.map);
            }
        } catch (e) {
            // validation failed - not much to do here but restart the level, unfortunately
            this.display.appendError(e.toString(), "%c{red}Validation failed! Please reload the level.");

            // play error sound
            this.sound.playSound('static');

            // disable player movement
            this.map.getPlayer()._canMove = false;
            throw e;
        }

        // on level 20, we can't afford to do any of this stuff (too many objects)
        if (this._currentLevel != 20) {
            this.clearModifiedGlobals();

            // refresh the map, just in case
            this.map.refresh();
        }
    } catch (e) {
        this.display.writeStatus(e.toString());
        throw e; // for debugging
    }
};

Game.prototype.validateAndRunScript = function (code) {
    try {
        // Game.prototype.blah => game.blah
        code = code.replace(/Game.prototype/, 'this');

        // Blah => game._blahPrototype
        code = code.replace(/function Map/, 'this._mapPrototype = function');
        code = code.replace(/function Player/, 'this._playerPrototype = function');

        new Function(code).bind(this).call(); // bind the function to current instance of game!
        console.log(code);

        if (this.mapPrototype) {
            // re-initialize map if necessary
            this.map._reset(); // for cleanup
            this.map = new this._mapPrototype(this.display, this);
        }

        // and restart current level from saved state
        var savedState = this.editor.getGoodState(this._currentLevel);
        this._evalLevelCode(savedState['code'], savedState['playerCode'], false, true);
    } catch (e) {
        this.display.writeStatus(e.toString());
        //throw e; // for debugging
    }
}

// awful awful awful method that tries to find the line
// of code where a given error occurs
Game.prototype.findSyntaxError = function(code, errorMsg) {
    var lines = code.split('\n');
    for (var i = 1; i <= lines.length; i++) {
        var testCode = lines.slice(0, i).join('\n');

        try {
            this._eval(testCode);
        } catch (e) {
            if (e.message === errorMsg) {
                return i;
            }
        }
    }
    return null;
};

Game.prototype.clearModifiedGlobals = function() {
    for (p in window) {
        if (window.propertyIsEnumerable(p) && this._globalVars.indexOf(p) == -1) {
            window[p] = null;
        }
    }
}

// Specific validators go here

Map.prototype.validateAtLeastXObjects = function(num, type) {
    var count = this._countObjects(type);
    if (count < num) {
        throw 'Not enough ' + type + 's on the map! Expected: ' + num + ', found: ' + count;
    }
};

Map.prototype.validateAtMostXObjects = function(num, type) {
    var count = this._countObjects(type);
    if (count > num) {
        throw 'Too many ' + type + 's on the map! Expected: ' + num + ', found: ' + count;
    }
};

Map.prototype.validateExactlyXManyObjects = function(num, type) {
    var count = this._countObjects(type);
    if (count != num) {
        throw 'Wrong number of ' + type + 's on the map! Expected: ' + num + ', found: ' + count;
    }
};

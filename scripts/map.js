function Map(display, __game) {
    /* private variables */

    var __player;
    var __grid;
    var __dynamicObjects = [];
    var __objectDefinitions;

    var __lines;
    var __dom;
    var __domCSS = '';

    var __allowOverwrite;
    var __keyDelay;
    var __refreshRate;

    var __intervals = [];
    var __chapterHideTimeout;

    /* unexposed variables */

    this._properties = {};
    this._display = display;
    this._dummy = false; // overridden by dummyMap in validate.js
    this._status = '';

    /* wrapper */

    function wrapExposedMethod(f, map) {
        return function () {
            var args = arguments;
            return __game._callUnexposedMethod(function () {
                return f.apply(map, args);
            });
        };
    };

    /* unexposed getters */

    this._getObjectDefinition = function(objName) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._getObjectDefinition()';}
        return __objectDefinitions[objName];
    };
    this._getObjectDefinitions = function() {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._getObjectDefinitions()';}
        return __objectDefinitions;
    };
    this._getGrid = function () {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._getGrid()';}
        return __grid;
    };
    this._getLines = function() {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._getLines()';}
        return __lines;
    };

    /* exposed getters */

    this.getDynamicObjects = function () {
        // copy dynamic object list to fix issue#166
        var copy = [];
        for (var i = 0; i < __dynamicObjects.length; i++) {
            copy[i] = __dynamicObjects[i];
        }
        return copy;
    };
    this.getPlayer = function () { return __player; };
    this.getWidth = function () { return __game._dimensions.width; };
    this.getHeight = function () { return __game._dimensions.height; };

    /* unexposed methods */

    this._reset = function () {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._reset()';}

        __objectDefinitions = __game.getListOfObjects();

        this._display.clear();

        __grid = new Array(__game._dimensions.width);
        for (var x = 0; x < __game._dimensions.width; x++) {
            __grid[x] = new Array(__game._dimensions.height);
            for (var y = 0; y < __game._dimensions.height; y++) {
                __grid[x][y] = {type: 'empty'};
            }
        }

        this.getDynamicObjects().forEach(function (obj) {
            obj._destroy(true);
        });
        __dynamicObjects = [];
        __player = null;
        this._clearIntervals();
        __lines = [];
        __dom = '';
        this._overrideKeys = {};

        // preload stylesheet for DOM level
        $.get('styles/dom.css', function (css) {
            __domCSS = css;
        });

        this.finalLevel = false;
        this._callbackValidationFailed = false;
    };
    this._clearIntervals = function() {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._clearIntervals()';}
        for (var i = 0; i < __intervals.length; i++) {
            clearInterval(__intervals[i]);
        }
        __intervals = [];
    };

    this._ready = function () {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._ready()';}

        // set refresh rate if one is specified
        if (__refreshRate) {
            // wrapExposedMethod is necessary here to prevent the `_moveToNextLevel`
            // call from breaking
            this.startTimer(wrapExposedMethod(function () {
                // refresh the map
                this.refresh();

                // check for nonstandard victory condition
                 __game._checkObjective()
            }, this), __refreshRate);
        }
    };

    this._setProperties = function (mapProperties) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._setProperties()';}

        // set defaults
        this._properties = {};
        __allowOverwrite = false;
        __keyDelay = 0;
        __refreshRate = null;

        // now set any properties that were passed in
        if (mapProperties) {
            this._properties = mapProperties;

            if (mapProperties.allowOverwrite === true) {
                __allowOverwrite = true;
            }

            if (mapProperties.keyDelay) {
                __keyDelay = mapProperties.keyDelay;
            }

            if (mapProperties.refreshRate) {
                __refreshRate = mapProperties.refreshRate;
            }
        }
    };

    this._canMoveTo = function (x, y, myType) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._canMoveTo()';}

        var x = Math.floor(x); var y = Math.floor(y);

        if (x < 0 || x >= __game._dimensions.width || y < 0 || y >= __game._dimensions.height) {
            return false;
        }

        // look for static objects that can serve as obstacles
        var objType = __grid[x][y].type;
        var object = __objectDefinitions[objType];
        if (object.impassable) {
            if (myType && object.passableFor && object.passableFor.indexOf(myType) > -1) {
                // this object is of a type that can pass the obstacle
                return true;
            } else if (typeof object.impassable === 'function') {
                // the obstacle is impassable only in certain circumstances
                return this._validateCallback(function () {
                    return !object.impassable(__player, object);
                });
            } else {
                // the obstacle is always impassable
                return false;
            }
        } else if (myType && object.impassableFor && object.impassableFor.indexOf(myType) > -1) {
            // this object is of a type that cannot pass the obstacle
            return false;
        } else {
            // no obstacle
            return true;
        }
    };

    // Returns the object of the given type closest to target coordinates
    this._findNearestToPoint = function (type, targetX, targetY) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._findNearestToPoint()';}

        var foundObjects = [];

        // look for static objects
        for (var x = 0; x < this.getWidth(); x++) {
            for (var y = 0; y < this.getHeight(); y++) {
                if (__grid[x][y].type === type) {
                    foundObjects.push({x: x, y: y});
                }
            }
        }

        // look for dynamic objects
        for (var i = 0; i < __dynamicObjects.length; i++) {
            var object = __dynamicObjects[i];
            if (object.getType() === type) {
                foundObjects.push({x: object.getX(), y: object.getY()});
            }
        }

        // look for player
        if (type === 'player') {
            foundObjects.push({x: __player.getX(), y: __player.getY()});
        }

        var dists = [];
        for (var i = 0; i < foundObjects.length; i++) {
            var obj = foundObjects[i];
            dists[i] = Math.sqrt(Math.pow(targetX - obj.x, 2) + Math.pow(targetY - obj.y, 2));

            // We want to find objects distinct from ourselves
            if (dists[i] === 0) {
                dists[i] = 999;
            }
        }

        var minDist = Math.min.apply(Math, dists);
        var closestTarget = foundObjects[dists.indexOf(minDist)];

        return closestTarget;
    };

    this._isPointOccupiedByDynamicObject = function (x, y) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._isPointOccupiedByDynamicObject()';}

        var x = Math.floor(x); var y = Math.floor(y);

        for (var i = 0; i < __dynamicObjects.length; i++) {
            var object = __dynamicObjects[i];
            if (object.getX() === x && object.getY() === y) {
                return true;
            }
        }
        return false;
    };

    this._findDynamicObjectAtPoint = function (x, y) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._findDynamicObjectAtPoint()';}

        var x = Math.floor(x); var y = Math.floor(y);

        for (var i = 0; i < __dynamicObjects.length; i++) {
            var object = __dynamicObjects[i];
            if (object.getX() === x && object.getY() === y) {
                return object;
            }
        }
        return false;
    };

    this._moveAllDynamicObjects = function () {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._moveAllDynamicObjects()';}

        // the way things work right now, teleporters must take precedence
        // over all other objects -- otherwise, pointers.jsx will not work
        // correctly.
        // TODO: make this not be the case

        // "move" teleporters
        __dynamicObjects.filter(function (object) {
            return (object.getType() === 'teleporter');
        }).forEach(function(object) {
            object._onTurn();
        });

        // move everything else
        __dynamicObjects.filter(function (object) {
            return (object.getType() !== 'teleporter');
        }).forEach(function(object) {
            object._onTurn();
        });

        // refresh only at the end
        this.refresh();
    };

    this._removeItemFromMap = function (x, y, klass) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._removeItemFromMap()';}

        var x = Math.floor(x); var y = Math.floor(y);

        if (__grid[x][y].type === klass) {
            __grid[x][y].type = 'empty';
        }
    };

    this._reenableMovementForPlayer = function (player) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._reenableMovementForPlayer()';}

        if (!this._callbackValidationFailed) {
            setTimeout(function () {
                player._canMove = true;
            }, __keyDelay);
        }
    };

    this._hideChapter = function() {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._hideChapter()';}

        // start fading out chapter immediately
        // unless it's a death message, in which case wait 2.5 sec
        clearInterval(__chapterHideTimeout);
        __chapterHideTimeout = setTimeout(function () {
            $('#chapter').fadeOut(1000);
        }, $('#chapter').hasClass('death') ? 2500 : 0);
    };

    this._refreshDynamicObjects = function() {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._refreshDynamicObjects()';}

        __dynamicObjects = __dynamicObjects.filter(function (obj) { return !obj.isDestroyed(); });
    };

    this._countTimers = function() {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._countTimers()';}

        return __intervals.length;
    }

    /* (unexposed) wrappers for game methods */

    this._startOfStartLevelReached = function() {
        __game._startOfStartLevelReached = true;
    };

    this._endOfStartLevelReached = function() {
        __game._endOfStartLevelReached = true;
    };

    this._playSound = function (sound) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._playSound()';}

        __game.sound.playSound(sound);
    };

    this._validateCallback = function (callback) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: map._validateCallback()';}

        return __game.validateCallback(callback);
    };

    /* exposed methods */

    this.refresh = wrapExposedMethod(function () {
        if (__dom) {
            this._display.clear();

            var domHTML = __dom[0].outerHTML
                .replace(/"/g, "'")
                .replace(/<hr([^>]*)>/g, '<hr $1 />')
                .replace(/<img([^>]*)>/g, '<img $1 />');

            this._display.renderDom(domHTML, __domCSS);
        } else {
            this._display.drawAll(this);
        }
        // rewrite any status messages
        if (this._status) {
            this._display.writeStatus(this._status);
        }
        __game.drawInventory();
    }, this);

    this.countObjects = wrapExposedMethod(function (type) {
        var count = 0;

        // count static objects
        for (var x = 0; x < this.getWidth(); x++) {
            for (var y = 0; y < this.getHeight(); y++) {
                if (__grid[x][y].type === type) {
                    count++;
                }
            }
        }

        // count dynamic objects
        __dynamicObjects.forEach(function (obj) {
            if (obj.getType() === type) {
                count++;
            }
        })

        return count;
    }, this);

    this.placeObject = wrapExposedMethod(function (x, y, type) {
        var x = Math.floor(x); var y = Math.floor(y);

        if (!__objectDefinitions[type]) {
            throw "There is no type of object named " + type + "!";
        }
        var minLevel = __objectDefinitions[type].minimumLevel
        if (minLevel && __game._currentLevel < minLevel) {
            throw type.capitalize() + "s are not available until level " + minLevel;
        }

        if (__player && x == __player.getX() && y == __player.getY()) {
            throw "Can't place object on top of player!";
        }

        if (typeof(__grid[x]) === 'undefined' || typeof(__grid[x][y]) === 'undefined') {
            return;
            // throw "Not a valid location to place an object!";
        }

        if (__objectDefinitions[type].type === 'dynamic') {
            // dynamic object
            __dynamicObjects.push(new DynamicObject(this, type, x, y, __game));
        } else {
            // static object
            if (__grid[x][y].type === 'empty' || __grid[x][y].type === type || __allowOverwrite) {
                __grid[x][y].type = type;
            } else {
                throw "There is already an object at (" + x + ", " + y + ")!";
            }
        }
    }, this);

    this.placePlayer = wrapExposedMethod(function (x, y) {
        var x = Math.floor(x); var y = Math.floor(y);

        if (__player) {
            throw "Can't place player twice!";
        }

        __player = new __game._playerPrototype(x, y, this, __game);
        this._display.drawAll(this);
    }, this);

    this.createFromGrid = wrapExposedMethod(function (grid, tiles, xOffset, yOffset) {
        for (var y = 0; y < grid.length; y++) {
            var line = grid[y];
            for (var x = 0; x < line.length; x++) {
                var tile = line[x];
                var type = tiles[tile];
                if (type === 'player') {
                    this.placePlayer(x + xOffset, y + yOffset);
                } else if (type) {
                    this.placeObject(x + xOffset, y + yOffset, type);
                }
            }
        }
    }, this);

    this.setSquareColor = wrapExposedMethod(function (x, y, bgColor) {
        var x = Math.floor(x); var y = Math.floor(y);

        __grid[x][y].bgColor = bgColor;
    }, this);

    this.defineObject = wrapExposedMethod(function (name, properties) {
        if (__objectDefinitions[name]) {
            throw "There is already a type of object named " + name + "!";
        }

        if (properties.interval && properties.interval < 100) {
            throw "defineObject(): minimum interval is 100 milliseconds";
        }

        __objectDefinitions[name] = properties;
    }, this);

    this.getObjectTypeAt = wrapExposedMethod(function (x, y) {
        var x = Math.floor(x); var y = Math.floor(y);

        // Bazek: We should always check, if the coordinates are inside of map!
        if (x >= 0 && x < this.getWidth() && y >= 0 && y < this.getHeight())
            return __grid[x][y].type;
        else
            return '';
    }, this);

    this.getAdjacentEmptyCells = wrapExposedMethod(function (x, y) {
        var x = Math.floor(x); var y = Math.floor(y);

        var map = this;
        var actions = ['right', 'down', 'left', 'up'];
        var adjacentEmptyCells = [];
        $.each(actions, function (i, action) {
            switch (actions[i]) {
                case 'right':
                    var child = [x+1, y];
                    break;
                case 'left':
                    var child = [x-1, y];
                    break;
                case 'down':
                    var child = [x, y+1];
                    break;
                case 'up':
                    var child = [x, y-1];
                    break;
            }
            // Bazek: We need to check, if child is inside of map!
            var childInsideMap = child[0] >= 0 && child[0] < map.getWidth() && child[1] >= 0 && child[1] < map.getHeight();
            if (childInsideMap && map.getObjectTypeAt(child[0], child[1]) === 'empty') {
                adjacentEmptyCells.push([child, action]);
            }
        });
        return adjacentEmptyCells;
    }, this);

    this.startTimer = wrapExposedMethod(function(timer, delay) {
        if (!delay) {
            throw "startTimer(): delay not specified"
        } else if (delay < 25) {
            throw "startTimer(): minimum delay is 25 milliseconds";
        }
        var validate = this._validateCallback;
        __intervals.push(setInterval(function(){validate(timer)}, delay));
    }, this);

    this.timeout = wrapExposedMethod(function(timer, delay) {
        if (!delay) {
            throw "timeout(): delay not specified"
        } else if (delay < 25) {
            throw "timeout(): minimum delay is 25 milliseconds";
        }
        var validate = this._validateCallback;
        __intervals.push(setTimeout(function(){validate(timer)}, delay));
    }, this);

    this.displayChapter = wrapExposedMethod(function(chapterName, cssClass) {
        if (__game._displayedChapters.indexOf(chapterName) === -1) {
            $('#chapter').html(chapterName.replace("\n","<br>"));
            $('#chapter').removeClass().show();

            if (cssClass) {
                $('#chapter').addClass(cssClass);
            } else {
                __game._displayedChapters.push(chapterName);
            }

            setTimeout(function () {
                $('#chapter').fadeOut();
            }, 5 * 1000);
        }
    }, this);

    this.writeStatus = wrapExposedMethod(function(status) {
        if (this._status) {
            // refresh to hide the old status message
            this._status = "";
            this.refresh();
        }
        this._status = status;
        this._display.writeStatus(status);
    }, this);

    // used by validators
    // returns true iff called at the start of the level (that is, on DummyMap)
    // returns false iff called by validateCallback (that is, on the actual map)
    this.isStartOfLevel = wrapExposedMethod(function () {
        return this._dummy;
    }, this);

    /* canvas-related stuff */

    this.getCanvasContext = wrapExposedMethod(function() {
        var ctx = $('#drawingCanvas')[0].getContext('2d');
        if(!this._dummy) {
            var opts = this._display.getOptions();
            ctx.font = opts.fontSize+"px " +opts.fontFamily;
        }
        return ctx;
    }, this);

    this.getCanvasCoords = wrapExposedMethod(function() {
        var x, y;
        if(arguments.length == 1) {
            var obj = arguments[0];
            x = obj.getX();
            y = obj.getY();
        } else {
            x = arguments[0];
            y = arguments[1];
        }
        var canvas =  $('#drawingCanvas')[0];
        return {
            x: (x + 0.5) * canvas.width / __game._dimensions.width,
            y: (y + 0.5) * canvas.height / __game._dimensions.height
        };
    }, this);

    this.getRandomColor = wrapExposedMethod(function(start, end) {
        var mean = [
            Math.floor((start[0] + end[0]) / 2),
            Math.floor((start[1] + end[1]) / 2),
            Math.floor((start[2] + end[2]) / 2)
        ];
        var std = [
            Math.floor((end[0] - start[0]) / 2),
            Math.floor((end[1] - start[1]) / 2),
            Math.floor((end[2] - start[2]) / 2)
        ];
        return ROT.Color.toHex(ROT.Color.randomize(mean, std));
    }, this);

    this.createLine = wrapExposedMethod(function(start, end, callback) {
        __lines.push({'start': start, 'end': end, 'callback': callback});
    }, this);

    this.testLineCollisions = wrapExposedMethod(function(player) {
        var threshold = 7;
        var playerCoords = this.getCanvasCoords(player);
        __lines.forEach(function (line) {
            if (pDistance(playerCoords.x, playerCoords.y,
                    line.start[0], line.start[1],
                    line.end[0], line.end[1]) < threshold) {
                __game.validateCallback(function() {
                        line.callback(__player);
                });
            }
        })
    }, this);

    /* for DOM manipulation level */

    this.getDOM = wrapExposedMethod(function () {
        return __dom;
    })

    this.createFromDOM = wrapExposedMethod(function(dom) {
        __dom = dom;
    }, this);

    this.updateDOM = wrapExposedMethod(function(dom) {
        __dom = dom;
    }, this);

    this.overrideKey = wrapExposedMethod(function(keyName, callback) {
        this._overrideKeys[keyName] = callback;
    }, this);

    /* validators */

    this.validateAtLeastXObjects = wrapExposedMethod(function(num, type) {
        var count = this.countObjects(type);
        if (count < num) {
            throw 'Not enough ' + type + 's on the map! Expected: ' + num + ', found: ' + count;
        }
    }, this);

    this.validateAtMostXObjects = wrapExposedMethod(function(num, type) {
        var count = this.countObjects(type);
        if (count > num) {
            throw 'Too many ' + type + 's on the map! Expected: ' + num + ', found: ' + count;
        }
    }, this);

    this.validateExactlyXManyObjects = wrapExposedMethod(function(num, type) {
        var count = this.countObjects(type);
        if (count != num) {
            throw 'Wrong number of ' + type + 's on the map! Expected: ' + num + ', found: ' + count;
        }
    }, this);

    this.validateAtMostXDynamicObjects = wrapExposedMethod(function(num) {
        var count = this.getDynamicObjects().length;
        if (count > num) {
            throw 'Too many dynamic objects on the map! Expected: ' + num + ', found: ' + count;
        }
    }, this);

    this.validateNoTimers = wrapExposedMethod(function() {
        var count = this._countTimers();
        if (count > 0) {
            throw 'Too many timers set on the map! Expected: 0, found: ' + count;
        }
    }, this);

    this.validateAtLeastXLines = wrapExposedMethod(function(num) {
        var count = this._getLines().length;
        if (count < num) {
            throw 'Not enough lines on the map! Expected: ' + num + ', found: ' + count;
        }
    }, this);

    /* initialization */

    this._reset();

    // call secureObject to prevent user code from tampering with private attributes
    __game.secureObject(this, "map");
}

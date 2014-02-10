function Map(display, game) {
    /* private variables */

    var __player;
    var __grid;
    var __dynamicObjects;
    var __objectDefinitions;
    var __lines;

    var __allowOverwrite;
    var __allowMultiMove;
    var __keyDelay;
    var __intervals = [];

    /* unexposed variables */

    this._game = game;
    this._display = display;

    /* unexposed getters */

    this._getObjectDefinition = function(objName) { return __objectDefinitions[objName]; };
    this._getObjectDefinitions = function() { return __objectDefinitions; };
    this._getGrid = function () { return __grid; };

    /* exposed getters */

    this.getDynamicObjects = function () { return __dynamicObjects; };
    this.getPlayer = function () { return __player; };
    this.getWidth = function () { return this._game._dimensions.width; };
    this.getHeight = function () { return this._game._dimensions.height; };

    /* unexposed methods */

    this._reset = function () {
        __objectDefinitions = clone(this._game.objects);
        this._display.clear();
        __grid = new Array(this._game._dimensions.width);
        for (var x = 0; x < this._game._dimensions.width; x++) {
            __grid[x] = new Array(this._game._dimensions.height);
            for (var y = 0; y < this._game._dimensions.height; y++) {
                __grid[x][y] = {type: 'empty'};
            }
        }

        __dynamicObjects = [];
        __player = null;

        for (var i = 0; i < __intervals.length; i++) {
            clearInterval(__intervals[i]);
        }
        __intervals = [];

        __lines = [];
    };

    this._setProperties = function (mapProperties) {
        // set defaults
        __allowOverwrite = false;
        __allowMultiMove = false;
        __keyDelay = 0;

        // now set any properties that were passed in
        if (mapProperties) {
            if (mapProperties.allowOverwrite === true) {
                __allowOverwrite = true;
            }

            if (mapProperties.keyDelay) {
                __keyDelay = mapProperties.keyDelay;
            }
        }
    };

    // (Used by validators)
    this._countObjects = function (type) {
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
        this.getDynamicObjects().forEach(function (obj) {
            if (obj.getType() === type) {
                count++;
            }
        })

        return count;
    };

    this._canMoveTo = function (x, y, myType) {
        if (x < 0 || x >= this._game._dimensions.width || y < 0 || y >= this._game._dimensions.height) {
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
                try {
                    return !object.impassable(__player, object);
                } catch (e) {
                    this._display.writeStatus(e);
                }
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
        for (var i = 0; i < __dynamicObjects.length; i++) {
            var object = __dynamicObjects[i];
            if (object.getX() === x && object.getY() === y) {
                return true;
            }
        }
        return false;
    }

    this._moveAllDynamicObjects = function () {
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
    };

    this._removeItemFromMap = function (x, y, klass) {
        if (__grid[x][y].type === klass) {
            __grid[x][y].type = 'empty';
        }
    };

    this._reenableMovementForPlayer = function(player) {
        setTimeout(function () {
            player._canMove = true;
        }, __keyDelay);
    };

    this._hideChapter = function() {
        // start fading out chapter immediately
        // unless it's a death message, in which case wait 2.5 sec
        setTimeout(function () {
            $('#chapter').fadeOut(1000);
        }, $('#chapter').hasClass('death') ? 2500 : 0);
    };

    /* exposed methods */

    this.refresh = function () {
        this._display.drawAll(this);
        this._game.drawInventory();
    };

    this.placeObject = function (x, y, type) {
        if (!__objectDefinitions[type]) {
            throw "There is no type of object named " + type + "!";
        }

        if (typeof(__grid[x]) === 'undefined' || typeof(__grid[x][y]) === 'undefined') {
            return;
            // throw "Not a valid location to place an object!";
        }

        if (__objectDefinitions[type].type === 'dynamic') {
            // dynamic object
            __dynamicObjects.push(new DynamicObject(this, type, x, y));
        } else {
            // static object
            if (__grid[x][y].type === 'empty' || __grid[x][y].type === type || __allowOverwrite) {
                __grid[x][y].type = type;
            } else {
                throw "There is already an object at (" + x + ", " + y + ")!";
            }
        }
    };

    this.placePlayer = function (x, y) {
        if (__player) {
            throw "Can't place player twice!";
        }
        __player = new Player(x, y, this);
        this._display.drawAll(this);
    };

    this.createFromGrid = function (grid, tiles, xOffset, yOffset) {
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
    };

    this.setSquareColor = function (x, y, bgColor) {
        __grid[x][y].bgColor = bgColor;
    };

    this.defineObject = function (name, properties) {
        if (!__objectDefinitions[name]) {
            __objectDefinitions[name] = properties;
        } else {
            throw "There is already a type of object named " + name + "!";
        }
    };

    this.getObjectTypeAt = function (x, y) {
        return __grid[x][y].type;
    }

    this.getAdjacentEmptyCells = function (x, y) {
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
            if (map.getObjectTypeAt(child[0], child[1]) === 'empty') {
                adjacentEmptyCells.push([child, action]);
            }
        });
        return adjacentEmptyCells;
    };

    this.startTimer = function(timer, delay) {
        if (!delay) {
            throw "startTimer(): delay not specified"
        } else if (delay < 25) {
            throw "startTimer(): minimum delay is 25 milliseconds";
        }

        __intervals.push(setInterval(timer, delay));
    };

    this.displayChapter = function(chapterName, cssClass) {
        if (this._game._displayedChapters.indexOf(chapterName) === -1) {
            $('#chapter').html(chapterName.replace("\n","<br>"));
            $('#chapter').removeClass().show();

            if (cssClass) {
                $('#chapter').addClass(cssClass);
            } else {
                this._game._displayedChapters.push(chapterName);
            }

            setTimeout(function () {
                $('#chapter').fadeOut();
            }, 5 * 1000);
        }
    };

    this.writeStatus = function(status) {
        setTimeout(function () {
            display.writeStatus(status);
        }, 100);
    };

    /* canvas-related stuff */

    this.getCanvasContext = function() {
        return $('#drawingCanvas')[0].getContext('2d');
    };

    this.getCanvasCoords = function(obj) {
        return {
            x: (obj.getX() + 0.5) * 600 / this._game._dimensions.width,
            y: (obj.getY() + 0.5) * 500 / this._game._dimensions.height
        };
    };

    this.getRandomColor = function(start, end) {
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
    };

    this.createLine = function(start, end, callback) {
        __lines.push({'start': start, 'end': end, 'callback': callback});
    };

    this.testLineCollisions = function() {
        var threshold = 7;
        var playerCoords = this.getCanvasCoords(__player);
        __lines.forEach(function (line) {
            if (pDistance(playerCoords.x, playerCoords.y,
                    line.start[0], line.start[1],
                    line.end[0], line.end[1]) < threshold) {
                line.callback(__player);
            }
        })
    };

    /* initialization */

    this._reset();
}

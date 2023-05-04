function Player(x, y, __map, __game) {
    /* private variables */

    var __x = x;
    var __y = y;
    var __color = "#0f0";
    var __lastMoveDirection = '';

    var __display = __map._display;

    /* unexposed variables */

    this._canMove = false;

    /* wrapper */

    function wrapExposedMethod(f, player) {
        return function () {
            var args = arguments;
            return __game._callUnexposedMethod(function () {
                return f.apply(player, args);
            });
        };
    };

    /* exposed getters/setters */

    this.getX = function () { return __x; };
    this.getY = function () { return __y; };
    this.getColor = function () { return __color; };
    this.getLastMoveDirection = function() { return __lastMoveDirection; };

    this.setColor = wrapExposedMethod(function (c) {
        __color = c;
        __display.drawAll(__map);
    });

    /* unexposed methods */

    // (used for teleporters)
    this._moveTo = function (dynamicObject) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: player._moveTo()';}

        // no safety checks or anything
        // this method is about as safe as a war zone
        __x = dynamicObject.getX();
        __y = dynamicObject.getY();
        __display.drawAll(__map);

        // play teleporter sound
        __game.sound.playSound('blip');
    };

    this._afterMove = function (x, y) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: player._afterMove()';}

        var player = this;

        this._hasTeleported = false; // necessary to prevent bugs with teleportation

        __map._hideChapter();
        __map._moveAllDynamicObjects();

        var onTransport = false;

        // check for collision with transport object
        for (var i = 0; i < __map.getDynamicObjects().length; i++) {
            var object = __map.getDynamicObjects()[i];
            if (object.getX() === x && object.getY() === y) {
                var objectDef = __map._getObjectDefinition(object.getType());
                if (objectDef.transport) {
                    onTransport = true;
                }
            }
        }

        // check for collision with static object UNLESS
        // we are on a transport
        if (!onTransport) {
            var objectName = __map._getGrid()[x][y].type;
            var objectDef = __map._getObjectDefinition(objectName);
            if (objectDef.type === 'item') {
                this._pickUpItem(objectName, objectDef);
            } else if (objectDef.onCollision) {
                __game.validateCallback(function () {
                    objectDef.onCollision(player);
                });
            }
        }

        // check for collision with any lines on the map
        __map.testLineCollisions(this);

        // don't run checkObjective if validation has already failed to prevent duplicate `Validation failed` errors
        if (!__map._callbackValidationFailed) {
            // check for nonstandard victory condition (e.g. DOM level)
            __game._checkObjective()
        }
    };

    this._pickUpItem = function (itemName, object) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: player._pickUpItem()';}

        var player = this;

        __game.addToInventory(itemName);
        __map._removeItemFromMap(__x, __y, itemName);
        __map.refresh();
        __game.sound.playSound('pickup');

        if (object.onPickUp) {
            __game.validateCallback(function () {
                object.onPickUp(player);
            });
        }
    };

    /* exposed methods */

    this.atLocation = wrapExposedMethod(function (x, y) {
        return (__x === x && __y === y);
    }, this);

    this.move = wrapExposedMethod(function (direction, fromKeyboard) {
        if (!this._canMove) { // mainly for key delay
            return false;
        }

        if (fromKeyboard) {
            // clear any status text
            __map._status = "";
            if (__map._overrideKeys[direction]) {
                try {
                    __game.validateCallback(__map._overrideKeys[direction], true);

                    __map.refresh();
                    this._canMove = false;
                    __map._reenableMovementForPlayer(this); // (key delay can vary by map)
                    this._afterMove(__x, __y);
                } catch (e) {
                }
                return;
            }
        }

        var new__x;
        var new__y;
        if (direction === 'up') {
            new__x = __x;
            new__y = __y - 1;
        }
        else if (direction === 'down') {
            new__x = __x;
            new__y = __y + 1;
        }
        else if (direction === 'left') {
            new__x = __x - 1;
            new__y = __y;
        }
        else if (direction === 'right') {
            new__x = __x + 1;
            new__y = __y;
        }
        else if (direction === 'rest') {
            new__x = __x;
            new__y = __y;
        }
        else if (direction === 'funcPhone') {
            __game.usePhone();
            return;
        }

        if (__map._canMoveTo(new__x, new__y)) {
            __x = new__x;
            __y = new__y;

            __map.refresh();

            this._canMove = false;

            __lastMoveDirection = direction;
            this._afterMove(__x, __y);

            __map._reenableMovementForPlayer(this); // (key delay can vary by map)
        } else {
            // play bump sound
            __game.sound.playSound('select');
        }
    }, this);

    this.killedBy = wrapExposedMethod(function (killer) {
        if (__map._dummy) {
            // Treat player death during StartLevel the same way as a validation failure to avoid nasty infinite loops
            throw "You have been killed by \n" + killer;
        }
        __game.sound.playSound('hurt');
        setTimeout(function() {
            __game._restartLevel();
        }, 0);

        __map.displayChapter('You have been killed by \n' + killer + '!', 'death');
    }, this);

    this.hasItem = wrapExposedMethod(function (itemName) {
        return __game.checkInventory(itemName);
    }, this);

    this.removeItem = wrapExposedMethod(function (itemName) {
        var object = __game.objects[itemName];

        __game.removeFromInventory(itemName);
        __game.sound.playSound('blip');
    }, this);

    this.setPhoneCallback = wrapExposedMethod(function(func) {
        this._phoneFunc = func;
    }, this);

    // call secureObject to prevent user code from tampering with private attributes
    __game.secureObject(this,"player");

}

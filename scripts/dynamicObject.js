function DynamicObject(map, type, x, y, __game) {
    /* private variables */

    var __x = x;
    var __y = y;
    var __type = type;
    var __definition = __game._callUnexposedMethod(function () {
        return map._getObjectDefinition(type);
    });
    var __inventory = [];
    var __destroyed = false;
    var __myTurn = true;
    var __timer = null;

    this._map = map;

    /* wrapper */

    function wrapExposedMethod(f, object) {
        return function () {
            var args = arguments;
            return __game._callUnexposedMethod(function () {
                return f.apply(object, args);
            });
        };
    };

    /* unexposed methods */

    this._computeDestination = function (startX, startY, direction) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: object._computeDestination()';}

        switch (direction) {
            case 'up':
                return {'x': startX, 'y': startY - 1};
            case 'down':
                return {'x': startX, 'y': startY + 1};
            case 'left':
                return {'x': startX - 1, 'y': startY};
            case 'right':
                return {'x': startX + 1, 'y': startY};
            default:
                return {'x': startX, 'y': startY};
        }
    };

    this._onTurn = function () {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: object._onTurn()';}

        var me = this;
        var player = map.getPlayer();

        function executeTurn() {
            __myTurn = true;

            try {
                //we need to check for a collision with the player *after*
                //the player has moved but *before* the object itself moves
                //this prevents a bug where players and objects can 'pass through'
                //each other
                if (__x === player.getX() && __y === player.getY()) {
                    if (__definition.pushable) {
                        me.move(player.getLastMoveDirection());
                    }
                    if (__definition.onCollision) {
                        map._validateCallback(function () {
                            __definition.onCollision(player, me);
                        });
                    }
                }

                if (__myTurn && __definition.behavior) {
                    map._validateCallback(function () {
                        __definition.behavior(me, player);
                    });
                }
            } catch (e) {
                // throw e; // for debugging
                map.writeStatus(e.toString());
            }
        }

        if (__definition.interval) {
            // start timer if not already set
            if (!__timer) {
                __timer = setInterval(executeTurn, __definition.interval);
            }

            // don't move on regular turn, but still check for player collision
            if (map.getPlayer().atLocation(__x, __y) &&
                    (__definition.onCollision || __definition.projectile)) {
                // trigger collision
                if (__definition.projectile) {
                    // projectiles automatically kill
                    map.getPlayer().killedBy('a ' + __type);
                } else {
                    map._validateCallback(function () {
                        __definition.onCollision(map.getPlayer(), this);
                    });
                }
            }
        } else {
            executeTurn();
        }
    };

    this._afterMove = function () {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: object._afterMove()';}

        // try to pick up items
        var objectName = map._getGrid()[__x][__y].type;
        var object = map._getObjectDefinition(objectName);
        if (object.type === 'item' && !__definition.projectile) {
            __inventory.push(objectName);
            map._removeItemFromMap(__x, __y, objectName);
            map._playSound('pickup');
        } else if (object.type === 'trap') {
            // this part is used by janosgyerik's bonus levels
            if (object.deactivatedBy && object.deactivatedBy.indexOf(__type) > -1) {
                if (typeof(object.onDeactivate) === 'function') {
                    object.onDeactivate();
                }
                map._removeItemFromMap(__x, __y, objectName);
            }
        }
    };

    this._destroy = function (onMapReset) {
        if (__game._isPlayerCodeRunning()) { throw 'Forbidden method call: object._destroy()';}

        var me = this;

        __destroyed = true;
        clearInterval(__timer);

        // remove this object from map's __dynamicObjects list
        map._refreshDynamicObjects();

        // unless the map is being reset, play an explosion
        // and call this object's onDestroy method
        if (__definition.onDestroy && !onMapReset) {
            if (!__definition.projectile) {
                map._playSound('explosion');
            }

            map._validateCallback(function () {
                __definition.onDestroy(me);
            });
        }
    };

    /* exposed methods */

    this.getX = function () { return __x; };
    this.getY = function () { return __y; };
    this.getType = function () { return __type; };
    this.isDestroyed = function () { return __destroyed; };

    this.giveItemTo = wrapExposedMethod(function (player, itemType) {
        var pl_at = player.atLocation;

        if (!(pl_at(__x, __y) || pl_at(__x+1, __y) || pl_at(__x-1, __y) ||
                pl_at(__x, __y+1) || pl_at(__x, __y-1))) {
            throw (type + ' says: Can\'t give an item unless I\'m touching the player!');
        }
        if (__inventory.indexOf(itemType) < 0) {
            throw (type + ' says: I don\'t have that item!');
        }

        player._pickUpItem(itemType, map._getObjectDefinition(itemType));
    }, this);

    this.move = wrapExposedMethod(function (direction) {
        var dest = this._computeDestination(__x, __y, direction);

        if (!__myTurn) {
            throw 'Can\'t move when it isn\'t your turn!';
        }

        var nearestObj = map._findNearestToPoint("anyDynamic", dest.x, dest.y);

        // check for collision with player
        if (map.getPlayer().atLocation(dest.x, dest.y) &&
                (__definition.onCollision || __definition.projectile)) {
            // trigger collision
            if (__definition.projectile) {
                // projectiles automatically kill
                map.getPlayer().killedBy('a ' + __type);
            } else {
                __definition.onCollision(map.getPlayer(), this);
            }
        } else if (map._canMoveTo(dest.x, dest.y, __type) &&
                !map._isPointOccupiedByDynamicObject(dest.x, dest.y)) {
            // move the object
            __x = dest.x;
            __y = dest.y;
            this._afterMove(__x, __y);
        } else {
            // cannot move
            if (__definition.projectile) {
                // projectiles disappear when they cannot move
                this._destroy();

                // projectiles also destroy any dynamic objects they touch
                if (map._isPointOccupiedByDynamicObject(dest.x, dest.y)) {
                    map._findDynamicObjectAtPoint(dest.x, dest.y)._destroy();
                }
            }
        }

        __myTurn = false;
    }, this);

    this.canMove = wrapExposedMethod(function (direction) {
        var dest = this._computeDestination(__x, __y, direction);

        // check if the object can move there and will not collide with
        // another dynamic object
        return (map._canMoveTo(dest.x, dest.y, __type) &&
            !map._isPointOccupiedByDynamicObject(dest.x, dest.y));
    }, this);

    this.findNearest = wrapExposedMethod(function (type) {
        return map._findNearestToPoint(type, __x, __y);
    }, this);

    // only for teleporters
    this.setTarget = wrapExposedMethod(function (target) {
        if (__type != 'teleporter') {
            throw 'setTarget() can only be called on a teleporter!';
        }

        if (target === this) {
            throw 'Teleporters cannot target themselves!';
        }

        this.target = target;
    }, this);

    // constructor

    if (!map._dummy && __definition.interval) {
        this._onTurn();
    }
}

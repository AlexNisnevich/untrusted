function DynamicObject(map, type, x, y) {
    /* private variables */

    var __x = x;
    var __y = y;
    var __type = type;
    var __definition = map._getObjectDefinition(type);
    var __inventory = [];
    var __myTurn = true;

    /* unexposed methods */

    this._computeDestination = function (startX, startY, direction) {
        switch (direction) {
            case 'up':
                return {'x': startX, 'y': startY - 1};
            case 'down':
                return {'x': startX, 'y': startY + 1};
            case 'left':
                return {'x': startX - 1, 'y': startY};
            case 'right':
                return {'x': startX + 1, 'y': startY};
        }
    };

    this._onTurn = function () {
        var me = this;
        var player = map.getPlayer();

        __myTurn = true;

        try {
            //we need to check for a collision with the player *after*
            //the player has moved but *before* the object itself moves
            //this prevents a bug where players and objects can 'pass through'
            //each other
            if (__x === player.getX() && __y === player.getY()) {
                if (__definition.onCollision) {
                    __definition.onCollision(player, this);
                }
            }

            if (__definition.behavior !== null) {
                map._game.validateCallback(function () {
                    __definition.behavior(me, player);
                });
            }
        } catch (e) {
            map._game.display.writeStatus(e.toString());
        }
    };

    this._afterMove = function () {
        // try to pick up items
        var objectName = map._getGrid()[__x][__y].type;
        if (map._getObjectDefinition(objectName).type === 'item') {
            __inventory.push(objectName);
            map._removeItemFromMap(__x, __y, objectName);
            map._game.sound.playSound('pickup');
        }
    };

    /* exposed methods */

    this.getX = function () { return __x; };
    this.getY = function () { return __y; };
    this.getType = function () { return __type; };

    this.giveItemTo = function (player, itemType) {
        var pl_at = player.atLocation;

        if (!(pl_at(__x, __y) || pl_at(__x+1, __y) || pl_at(__x-1, __y) ||
                pl_at(__x, __y+1) || pl_at(__x, __y-1))) {
            throw (type + ' says: Can\'t give an item unless I\'m touching the player!');
        }
        if (__inventory.indexOf(itemType) < 0) {
            throw (type + ' says: I don\'t have that item!');
        }

        player.pickUpItem(itemType, map._game.objects[itemType]);
    };

    this.move = function (direction) {
        var dest = this._computeDestination(__x, __y, direction);

        if (!__myTurn) {
            throw 'Can\'t move when it isn\'t your turn!';
        }

        var nearestObj = map._findNearestToPoint("anyDynamic", dest.x, dest.y);

        // check for collision with player
        if (map.getPlayer().atLocation(dest.x, dest.y) && __definition.onCollision) {
            // trigger collision
            __definition.onCollision(map.getPlayer(), this);
        } else if (map._canMoveTo(dest.x, dest.y, __type) &&
                !map._isPointOccupiedByDynamicObject(dest.x, dest.y)) {
            // move the object
            __x = dest.x;
            __y = dest.y;
            this._afterMove(__x, __y);
            map.refresh();
        }

        __myTurn = false;
    };

    this.canMove = function (direction) {
        var dest = this._computeDestination(__x, __y, direction);

        // check if the object can move there and will not collide with a copy of itself
        return (map._canMoveTo(dest.x, dest.y, __type) &&
            !(dest.x === this.findNearest(__type).x && dest.y === this.findNearest(__type).y));
    };

    this.findNearest = function (type) {
        return map._findNearestToPoint(type, __x, __y);
    };

    // only for teleporters
    this.setTarget = function (target) {
        if (__type != 'teleporter') {
            throw 'setTarget() can only be called on a teleporter!';
        }

        if (target === this) {
            throw 'Teleporters cannot target themselves!';
        }

        this.target = target;
    };
}

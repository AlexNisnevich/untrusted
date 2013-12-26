
function DynamicObject(map, type, x, y) {
	var _x = x;
	var _y = y;
	var _type = type;
	var _definition = map.getObjectDefinition(type);
	var _inventory = [];
	var _myTurn = true;

	// methods exposed to player

	this.getX = function () { return _x; };
	this.getY = function () { return _y; };
	this.getType = function () { return _type; };

	this.giveItemTo = function (player, itemType) {
		var pl_at = player.atLocation;

		if (!(pl_at(_x, _y) || pl_at(_x+1, _y) || pl_at(_x-1, _y) ||
				pl_at(_x, _y+1) || pl_at(_x, _y-1))) {
			throw (type + ' says: Can\'t give an item unless I\'m touching the player!');
		}
		if (_inventory.indexOf(itemType) < 0) {
			throw (type + ' says: I don\'t have that item!');
		}

		player.pickUpItem(itemType, map.game.objects[itemType]);
	};

	this.move = function (direction) {
		var dest = computeDestination(_x, _y, direction);

		if (!_myTurn) {
			throw 'Can\'t move when it isn\'t your turn!';
		}

		var nearestObj = map.findNearestToPoint("anyDynamic", dest.x, dest.y);

		_myTurn = false;

		// check for collision with player
		if (map.getPlayer().atLocation(dest.x, dest.y) && _definition.onCollision) {
			// trigger collision
			_definition.onCollision(map.getPlayer(), this);
		} else if (dest.x === nearestObj.x && dest.y === nearestObj.y) {
			// would collide with another dynamic object
			return;
		} else if (map.canMoveTo(dest.x, dest.y, _type)) {
			// move the object
			_x = dest.x;
			_y = dest.y;
			this.afterMove(_x, _y);
			map.refresh();
		}
	};

	this.canMove = function (direction) {
		var dest = computeDestination(_x, _y, direction);

		// check if the object can move there and will not collide with a copy of itself
		return (map.canMoveTo(dest.x, dest.y, _type) &&
			!(dest.x === this.findNearest(_type).x && dest.y === this.findNearest(_type).y));
	};

	this.findNearest = function (type) {
		return map.findNearestToPoint(type, _x, _y);
	};

	// methods not exposed to player

	this.computeDestination = function (startX, startY, direction) {
		switch (direction) {
			case 'up':
				var dest = {'x': startX, 'y': startY-1};
				break;
			case 'down':
				var dest = {'x': startX, 'y': startY+1};
				break;
			case 'left':
				var dest = {'x': startX-1, 'y': startY};
				break;
			case 'right':
				var dest = {'x': startX+1, 'y': startY};
				break;
		}
	};

	this.onTurn = function () {
		_myTurn = true;
		var player = map.getPlayer();
		try {
			//we need to check for a collision with the player *after*
			//the player has moved but *before* the object itself moves
			//this prevents a bug where players and objects can 'pass through'
			//each other
			if (_x === player.getX() && _y === player.getY()) {
				if (_definition.onCollision) {
					_definition.onCollision(player, this);
				}
			}
			_definition.behavior(this, player);
		} catch (e) {
			map.game.display.writeStatus(e.toString());
		}
	};

	this.afterMove = function () {
		// try to pick up items
		var objectName = map.getGrid()[_x][_y].type;
		if (map.getObjectDefinition(objectName).type === 'item') {
			_inventory.push(objectName);
			map.removeItemFromMap(_x, _y, objectName);
			map.game.sound.playSound('pickup');
		}
	};
}

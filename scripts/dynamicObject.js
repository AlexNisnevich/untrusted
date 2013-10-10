
function DynamicObject(map, type, x, y) {
	var _x = x;
	var _y = y;
	var _type = type;
	var _definition = map.getObjectDefinition(type);
	var _myTurn = true;

	// methods exposed to player

	this.getX = function () { return _x; };
	this.getY = function () { return _y; };
	this.getType = function () { return _type; };

	this.giveItemTo = function (player, itemType) {
		var pl_at = player.atLocation;
		if (!(pl_at(_x, _y) || pl_at(_x+1, _y) || pl_at(_x-1, _y)
				|| pl_at(_x, _y+1) || pl_at(_x, _y-1))) {
			throw 'Can\'t give an item unless I\'m touching the player!';
		}

		player.pickUpItem(itemType, game.objects[itemType]);
	}

	this.move = function (direction) {
		switch (direction) {
			case 'up':
				var dest = {'x': _x, 'y': _y-1};
				break;
			case 'down':
				var dest = {'x': _x, 'y': _y+1};
				break;
			case 'left':
				var dest = {'x': _x-1, 'y': _y};
				break;
			case 'right':
				var dest = {'x': _x+1, 'y': _y};
				break;
		}

		if (!_myTurn) {
			throw 'Can\'t move when it isn\'t your turn!';
		}

		// check for collision with player
		if (map.getPlayer().atLocation(dest.x, dest.y)) {
			// trigger collision
			_definition.onCollision(map.getPlayer(), this);
		} else if (dest.x == this.findNearest(_type).x && dest.y == this.findNearest(_type).y) {
			// would collide with a copy of itself
		} else if (map.canMoveTo(dest.x, dest.y, _type)) {
			// move the object
			_x = dest.x;
			_y = dest.y;
			map.refresh();
		}

		_myTurn = false;
	};

	this.canMove = function (direction) {
		switch (direction) {
			case 'up':
				var dest = {'x': _x, 'y': _y-1};
				break;
			case 'down':
				var dest = {'x': _x, 'y': _y+1};
				break;
			case 'left':
				var dest = {'x': _x-1, 'y': _y};
				break;
			case 'right':
				var dest = {'x': _x+1, 'y': _y};
				break;
		}

		// check if the object can move there and will not collide with a copy of itself
		return (map.canMoveTo(dest.x, dest.y, _type) &&
			!(dest.x == this.findNearest(_type).x && dest.y == this.findNearest(_type).y));
	};

	this.findNearest = function (type) {
		return map.findNearestToPoint(type, _x, _y);
	};

	// methods not exposed to player

	this.onTurn = function () {
		_myTurn = true;
		try {
			_definition.behavior(this, map.getPlayer());
		} catch (e) {
			map.game.output.write(e.toString());
		}
	};
}

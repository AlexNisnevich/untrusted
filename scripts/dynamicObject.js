
function DynamicObject(map, type, x, y) {
	var _x = x;
	var _y = y;
	var _type = type;
	var _definition = map.objects[type];
	var _myTurn = true;

	this.getX = function () { return _x; };
	this.getY = function () { return _y; };
	this.getType = function () { return _type; };

	this.moveUp = function () {
		this.move('up');
	};
	this.moveDown = function () {
		this.move('down');
	};
	this.moveLeft = function () {
		this.move('left');
	};
	this.moveRight = function () {
		this.move('right');
	};

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
			_definition.onCollision(map.getPlayer());
		} else if (dest.x == this.findNearest(_type).x && dest.y == this.findNearest(_type).y) {
			// would collide with a copy of itself
		} else if (map.canMoveTo(dest.x, dest.y)) {
			// move the object
			_x = dest.x;
			_y = dest.y;
			map.refresh();
		}

		_myTurn = false;
	};

	this.findNearest = function (type) {
		return map.findNearestToPoint(type, _x, _y);
	};

	this.onTurn = function () {
		_myTurn = true;
		_definition.behavior(this, map.getPlayer());
	};
}

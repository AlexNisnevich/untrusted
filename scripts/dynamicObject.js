
function DynamicObject(map, type, x, y) {
	var _x = x;
	var _y = y;
	var _type = type;
	var _definition = map.objects[type];
	var _myTurn = true;

	this.getX = function () { return _x; }
	this.getY = function () { return _y; }
	this.getType = function () { return _type; }

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
				var destination = {'x': _x, 'y': _y-1};
				break;
			case 'down':
				var destination = {'x': _x, 'y': _y+1};
				break;
			case 'left':
				var destination = {'x': _x-1, 'y': _y};
				break;
			case 'right':
				var destination = {'x': _x+1, 'y': _y};
				break;
		}

		if (!_myTurn) {
			throw 'Can\'t move when it isn\'t your turn!';
		}

		// check for collision with player
		if (map.getPlayer().atLocation(destination.x, destination.y)) {
			// trigger collision
			_definition.onCollision(map.getPlayer());
		} else {
			// move the object
			_x = destination.x;
			_y = destination.y;
			map.refresh();
		}
	}

	this.onTurn = function () {
		_definition.behavior(this, map.getPlayer());
	}

	this.map = map;
}

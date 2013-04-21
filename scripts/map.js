function clone(obj) {
    if(obj == null || typeof(obj) != 'object')
        return obj;
    var temp = obj.constructor();
    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}

function Map(display, game) {
	// Private variables
	var _player;
	var _grid;

	this.reset = function () {
		this.objects = clone(this.game.objects);

		this.display.clear();
		_grid = new Array(game.dimensions.width);
		for (var x = 0; x < game.dimensions.width; x++) {
			_grid[x] = new Array(game.dimensions.height);
			for (var y = 0; y < game.dimensions.height; y++) {
				_grid[x][y] = {type: 'empty'};
			}
		}
		_player = null;
	};

	this.getPlayer = function () { return _player; }
	this.getGrid = function () { return _grid; }
	this.getWidth = function () { return game.dimensions.width; }
	this.getHeight = function () { return game.dimensions.height; }

	this.refresh = function () {
		this.display.drawAll(this);
	}

	this.canMoveTo = function (x, y) {
		if (x < 0 || x >= game.dimensions.width || y < 0 || y >= game.dimensions.height) {
			return false;
		}

		object = this.objects[this.getGrid()[x][y].type];
		if (object.impassable) {
			if (typeof object.impassable == 'function') {
				return !object.impassable(_player, object);
			} else {
				return false;
			}
		} else {
			return true;
		}
	};

	this.moveAnimateObject = function (x, y, direction) {
		switch (direction) {
			case 'up':
				var destination = {'x': x, 'y': y-1};
				break;
			case 'down':
				var destination = {'x': x, 'y': y+1};
				break;
			case 'left':
				var destination = {'x': x-1, 'y': y};
				break;
			case 'right':
				var destination = {'x': x+1, 'y': y};
				break;
		}

		var object = this.getGrid()[x][y];
		var objectClass = this.objects[object.type];

		if (objectClass.type !== 'animate') {
			throw 'Only animate objects can move!';
		}

		if (!object._myTurn) {
			throw 'Can\'t move when it isn\'t your turn!';
		}

		// check for collision with player
		if (this.getPlayer().atLocation(destination.x, destination.y)) {
			// trigger collision
			objectClass.onCollision(this.getPlayer());
		} else {
			// move the object
			this.placeObject(destination.x, destination.y, object.type);
			_grid[x][y] = {type: 'empty'};
			_grid[destination.x][destination.y]._myTurn = false;
			this.refresh();
		}
	}

	this.moveAllAnimateObjects = function () {
		// collect all animate objects
		animateObjects = []; // stores {x, y} positions
		for (var x = 0; x < this.game.dimensions.width; x++) {
			for (var y = 0; y < this.game.dimensions.height; y++) {
				var object = this.getGrid()[x][y];
				var objectClass = this.objects[object.type];

				if (objectClass.type === 'animate') {
					animateObjects.push({'x': x, 'y': y});
				}
			}
		}

		// iterate over all animate objects
		for (var i = 0; i < animateObjects.length; i++) {
			var coords = animateObjects[i];
			var object = this.getGrid()[coords.x][coords.y];
			var objectClass = this.objects[object.type];

			// inject some crap into the object
			object._map = this;
			object._x = coords.x;
			object._y = coords.y;
			object._myTurn = true;
			object.getX = function () { return this._x; };
			object.getY = function () { return this._y; };
			object.moveUp = function () {
				this._map.moveAnimateObject(this._x, this._y, 'up');
			};
			object.moveDown = function () {
				this._map.moveAnimateObject(this._x, this._y, 'down');
			};
			object.moveLeft = function () {
				this._map.moveAnimateObject(this._x, this._y, 'left');
			};
			object.moveRight = function () {
				this._map.moveAnimateObject(this._x, this._y, 'right');
			};

			objectClass.behavior(object, this.getPlayer());
		}
	}

	/* Functions called from startLevel */

	this.placeObject = function (x, y, type, bgColor) {
		if (!this.objects[type]) {
			throw "There is no type of object named " + type + "!";
		}

        if (typeof(_grid[x]) !== 'undefined' && typeof(_grid[x][y]) !== 'undefined') {
            if (!_player.atLocation(x, y) || type == 'empty') {
                _grid[x][y].type = type;
            }
        }
	};

	this.placePlayer = function (x, y) {
		if (_player) {
			throw "Can't place player twice!";
		}
		_player = new Player(x, y, this);
		_player.draw();
	};

	this.setSquareColor = function (x, y, bgColor) {
		_grid[x][y].bgColor = bgColor;
	};

	this.createNewObject = function (name, properties) {
		if (!this.objects[name]) {
			this.objects[name] = properties;
		} else {
			throw "There is already a type of object named " + name + "!";
		}
	}

	/* Initialization */

	this.game = game;
	this.display = display;
	this.reset();
};

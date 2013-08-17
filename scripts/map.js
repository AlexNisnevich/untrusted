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
	var _dynamicObjects;

	this.reset = function () {
		this.objects = clone(game.objects);

		this.display.clear();
		_grid = new Array(game.dimensions.width);
		for (var x = 0; x < game.dimensions.width; x++) {
			_grid[x] = new Array(game.dimensions.height);
			for (var y = 0; y < game.dimensions.height; y++) {
				_grid[x][y] = {type: 'empty'};
			}
		}

		_dynamicObjects = [];

		_player = null;
	};

	this.getPlayer = function () { return _player; };
	this.getGrid = function () { return _grid; };
	this.getDynamicObjects = function () { return _dynamicObjects; };
	this.getWidth = function () { return game.dimensions.width; };
	this.getHeight = function () { return game.dimensions.height; };

	this.refresh = function () {
		this.display.drawAll(this);
	};

	this.canMoveTo = function (x, y, myType) {
		if (x < 0 || x >= game.dimensions.width || y < 0 || y >= game.dimensions.height) {
			return false;
		}

		// look for static objects that can serve as obstacles
		object = this.objects[this.getGrid()[x][y].type];
		if (object.impassable) {
			if (myType && object.passableFor && object.passableFor.indexOf(myType) > -1) {
				// this object is of a type that can pass the obstacle
				return true;
			} else if (typeof object.impassable == 'function') {
				// the obstacle is impassable only in certain circumstances
				return !object.impassable(_player, object);
			} else {
				// the obstacle is always impassable
				return false;
			}
		} else {
			// no obstacle
			return true;
		}
	};

	this.findNearestToPoint = function (type, targetX, targetY) {
		var foundObjects = [];

		// look for static objects
		for (var x = 0; x < this.getWidth(); x++) {
			for (var y = 0; y < this.getHeight(); y++) {
				if (_grid[x][y].type === type) {
					foundObjects.push({x: x, y: y});
				}
			}
		}

		// look for dynamic objects
		for (var i = 0; i < _dynamicObjects.length; i++) {
			var object = _dynamicObjects[i];
			if (object.getType() === type) {
				foundObjects.push({x: object.getX(), y: object.getY()});
			}
		}

		// look for player
		if (type == 'player') {
			foundObjects.push({x: _player.getX(), y: _player.getY()});
		}

		var dists = [];
		for (var i = 0; i < foundObjects.length; i++) {
			var obj = foundObjects[i];
			dists[i] = Math.sqrt(Math.pow(targetX - obj.x, 2) + Math.pow(targetY - obj.y, 2));
			if (dists[i] == 0) {
				dists[i] = 999; // we want to find objects distinct from ourselves
			}
		}

		var minDist = Math.min.apply(Math, dists);
		var closestTarget = foundObjects[dists.indexOf(minDist)];

		return closestTarget;
	};

	this.moveAllDynamicObjects = function () {
		// iterate over all dynamic objects
		for (var i = 0; i < _dynamicObjects.length; i++) {
			var object = _dynamicObjects[i];
			object.onTurn();
		}
	};

	/* Functions called from startLevel */

	this.placeObject = function (x, y, klass) {
		if (!this.objects[klass]) {
			throw "There is no type of object named " + klass + "!";
		}

		if (this.objects[klass].type == 'dynamic') {
			// dynamic object
			if (typeof(_grid[x]) !== 'undefined' && typeof(_grid[x][y]) !== 'undefined') {
				_dynamicObjects.push(new DynamicObject(this, klass, x, y));
			}
		} else {
			// static object
	        if (typeof(_grid[x]) !== 'undefined' && typeof(_grid[x][y]) !== 'undefined') {
	            if (!_player.atLocation(x, y) || klass == 'empty') {
	                _grid[x][y].type = klass;
	            }
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
	};

	/* Initialization */

	this.game = game;
	this.display = display;
	this.reset();
};

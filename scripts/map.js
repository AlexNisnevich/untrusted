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

var dimensions = {
	width: 50,
	height: 25
};

function Map(display) {
	// Private variables
	var _player;
	var _grid;

	this.reset = function () {
		this.display.clear();
		_grid = new Array(dimensions.width);
		for (var x = 0; x < dimensions.width; x++) {
			_grid[x] = new Array(dimensions.height);
			for (var y = 0; y < dimensions.height; y++) {
				_grid[x][y] = {type: 'empty'};
			}
		}
		_player = null;
	};

	this.getPlayer = function () { return _player; }
	this.getGrid = function () { return _grid; }
	this.getWidth = function () { return dimensions.width; }
	this.getHeight = function () { return dimensions.height; }

	this.placeObject = function (x, y, type, bgColor) {
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

	this.canMoveTo = function (x, y) {
		if (x < 0 || x >= dimensions.width || y < 0 || y >= dimensions.height) {
			return false;
		}
		return objects[map.getGrid()[x][y].type].passable;
	};

	// Initialize with empty grid
	this.display = display;
	this.reset();
};

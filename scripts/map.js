var dimensions = {
	width: 50,
	height: 25
};

var Map = function (display) {
	this.reset = function () {
		this._display.clear();
		this._grid = new Array(dimensions.width);
		for (var x = 0; x < dimensions.width; x++) {
			this._grid[x] = new Array(dimensions.height);
			for (var y = 0; y < dimensions.height; y++) {
				this._grid[x][y] = {type: 'empty'};
			}
		}
		this._playerCount = 0;
	};

	this.getWidth = function () { return dimensions.width; }
	this.getHeight = function () { return dimensions.height; }

	this.placeObject = function (x, y, type, bgColor) {
        if (typeof(this._grid[x]) !== 'undefined' && typeof(this._grid[x][y]) !== 'undefined') {
            if (!this.player.atLocation(x, y) || type == 'empty') {
                this._grid[x][y].type = type;
            }
        }
	};

	this.placePlayer = function (x, y) {
		this.player = new Player(x, y, this);
	};

	this.setSquareColor = function (x, y, bgColor) {
		this._grid[x][y].bgColor = bgColor;
	};

	this.canMoveTo = function (x, y) {
		if (x < 0 || x >= dimensions.width || y < 0 || y >= dimensions.height) {
			return false;
		}
		return objects[map._grid[x][y].type].passable;
	};

	// Initialize with empty grid
	this._display = display;
	this.reset();
};

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
				this._grid[x][y] = 'empty';
			}
		}
		this._playerCount = 0;
	};

	this.getWidth = function () { return dimensions.width; }
	this.getHeight = function () { return dimensions.height; }

	this.placeObject = function (x, y, type, bgColor) {
        if (typeof(this._grid[x]) !== 'undefined' && typeof(this._grid[x][y]) !== 'undefined') {

            if (this.player.atLocation(this._grid[x], this._grid[y])) {

            }
            else {
                this._grid[x][y] = type;
                this._display.drawObject(x, y, type, bgColor);
            }
        }
	};

	this.setSquareColor = function (x, y, bgColor) {
		this._display.drawObject(x, y, this._grid[x][y], bgColor);
	};

	this.canMoveTo = function (x, y) {
		if (x < 0 || x >= dimensions.width || y < 0 || y >= dimensions.height) {
			return false;
		}
		return objects[map._grid[x][y]].passable;
	};

	// Initialize with empty grid
	this._display = display;
	this.reset();
};

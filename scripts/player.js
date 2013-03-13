var Player = function(x, y, map) {
	var _x = x;
	var _y = y;
	this._rep = "@";
	this._fgColor = "#0f0";
	this._display = map.display;

	this.getX = function () { return _x; }
	this.getY = function () { return _y; }

	this.draw = function () {
		var bgColor = map.getGrid()[_x][_y].bgColor
		this._display.draw(_x, _y, this._rep, this._fgColor, bgColor);
	}

	this.atLocation = function (x, y) {
		return (_x === x && _y === y);
	}

	this.move = function (direction) {
		var cur_x = _x;
		var cur_y = _y;
		var new_x;
		var new_y;

		if (direction === 'up') {
			new_x = cur_x;
			new_y = cur_y - 1;
		}
		else if (direction === 'down') {
			new_x = cur_x;
			new_y = cur_y + 1;
		}
		else if (direction === 'left') {
			new_x = cur_x - 1;
			new_y = cur_y;
		}
		else if (direction === 'right') {
			new_x = cur_x + 1;
			new_y = cur_y;
		}

		if (map.canMoveTo(new_x, new_y)) {
			this._display.drawObject(cur_x,cur_y, map.getGrid()[cur_x][cur_y].type, map.getGrid()[cur_x][cur_y].bgColor);
			_x = new_x;
			_y = new_y;
			this.draw();
			if (objects[map.getGrid()[new_x][new_y].type].onCollision) {
				objects[map.getGrid()[new_x][new_y].type].onCollision(this);
			}
		}
		else {
			console.log("Can't move to " + new_x + ", " + new_y + ", reported from inside Player.move() method");
		}
	};

	this.killedBy = function (killer) {
		alert('You have been killed by ' + killer + '!');
		getLevel(currentLevel);
	}

	this.pickUpItem = function () {
		map.placeObject(_x, _y, 'empty');
		// do a little dance to get rid of graphical artifacts //TODO fix this
		this.move('left');
		this.move('right');
	}

	this.setPhoneCallback = function(func) {
	    this._phoneFunc = func;
	}
}

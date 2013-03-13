function Player(x, y, map) {
	var _x = x;
	var _y = y;
	var _inventory = [];

	this._rep = "@";
	this._fgColor = "#0f0";
	this._map = map;
	this._display = this._map.display;

	this.getX = function () { return _x; }
	this.getY = function () { return _y; }

	this.draw = function () {
		var bgColor = this._map.getGrid()[_x][_y].bgColor
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

		if (this._map.canMoveTo(new_x, new_y)) {
			this._display.drawObject(cur_x,cur_y, this._map.getGrid()[cur_x][cur_y].type, this._map.getGrid()[cur_x][cur_y].bgColor);
			_x = new_x;
			_y = new_y;
			this.draw();
			this.afterMove(_x, _y);
		}
	};

	this.afterMove = function (x, y) {
		var objectName = this._map.getGrid()[x][y].type;
		var object = game.objects[objectName];
		if (object.type == 'item') {
			this.pickUpItem(objectName, object);
		} else if (object.onCollision) {
			object.onCollision(this);
		}
	}

	this.killedBy = function (killer) {
		alert('You have been killed by ' + killer + '!');
		getLevel(currentLevel);
	}

	this.pickUpItem = function (objectName, object) {
		_inventory.push(objectName);
		map.placeObject(_x, _y, 'empty');

		// do a little dance to get rid of graphical artifacts //TODO fix this
		this.move('left');
		this.move('right');

		if (object.onPickUp) {
			object.onPickUp(this);
		}
	}

	this.hasItem = function (object) {
		return _inventory.indexOf(object) > -1;
	}

	this.setPhoneCallback = function(func) {
	    this._phoneFunc = func;
	}
}

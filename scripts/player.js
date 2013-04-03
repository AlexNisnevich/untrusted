function Player(x, y, map) {
	var _x = x;
	var _y = y;
	var _inventory = [];

	this.rep = "@";
	this.fgColor = "#0f0";

	this.map = map;
	this.display = map.display;
	this.game = map.game;

	this.canMove = false;

	this.getX = function () { return _x; }
	this.getY = function () { return _y; }

	this.init = function () {
		// inherit global items from game.currentPlayer
		// (Ideally, it would be nice to store global items as
		//	a class variable, but then we can't make them private.)
		var currentPlayer = this.game.getCurrentPlayer()
		if (currentPlayer) {
			if (currentPlayer.hasItem('computer')) {
				_inventory.push('computer');
			}
			if (currentPlayer.hasItem('phone')) {
				_inventory.push('phone');
			}
		}
	}

	this.draw = function () {
		var bgColor = this.map.getGrid()[_x][_y].bgColor
		this.display.draw(_x, _y, this.rep, this.fgColor, bgColor);
	}

	this.atLocation = function (x, y) {
		return (_x === x && _y === y);
	}

	this.move = function (direction) {
		// are we allowing keyboard input right now?
		if (!this.canMove) {
			return false;
		}

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

		if (this.map.canMoveTo(new_x, new_y)) {
			this.display.drawObject(map, cur_x, cur_y, this.map.getGrid()[cur_x][cur_y].type, this.map.getGrid()[cur_x][cur_y].bgColor);
			_x = new_x;
			_y = new_y;
			this.draw();
			this.afterMove(_x, _y);
		}
	};

	this.afterMove = function (x, y) {
		var objectName = this.map.getGrid()[x][y].type;
		var object = this.map.objects[objectName];
		if (object.type == 'item') {
			this.pickUpItem(objectName, object);
		} else if (object.onCollision) {
			object.onCollision(this, this.game);
		}
		this.game.display.drawAround(this.map, x, y); // in case there are any artifacts
	}

	this.killedBy = function (killer) {
		alert('You have been killed by ' + killer + '!');
		this.game.getLevel(this.game.currentLevel);
	}

	this.pickUpItem = function (objectName, object) {
		_inventory.push(objectName);
		map.placeObject(_x, _y, 'empty');
		map.refresh();

		if (object.onPickUp) {
			object.onPickUp(this, this.game);
		}
	}

	this.hasItem = function (object) {
		return _inventory.indexOf(object) > -1;
	}

	this.setPhoneCallback = function(func) {
	    this._phoneFunc = func;
	}

	// Constructor
	this.init();
}

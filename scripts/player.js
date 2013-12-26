function Player(x, y, map) {
	var _x = x;
	var _y = y;
	var _color = "#0f0";

	this.getX = function () { return _x; };
	this.getY = function () { return _y; };

	this.getColor = function () { return _color; };
	this.setColor = function (c) {
		_color = c;
		this.display.drawAll(this.map);
	};

	this.init = function () {
		this.rep = "@";

		this.map = map;
		this.display = map.display;
		this.game = map.game;

		this.canMove = false;
	};

	this.atLocation = function (x, y) {
		return (_x === x && _y === y);
	};

	this.move = function (direction, fromKeyboard) {
		// are we allowing keyboard input right now?
		if (!this.canMove && fromKeyboard) {
			return false;
		}

		var new_x;
		var new_y;
		if (direction === 'up') {
			new_x = _x;
			new_y = _y - 1;
		}
		else if (direction === 'down') {
			new_x = _x;
			new_y = _y + 1;
		}
		else if (direction === 'left') {
			new_x = _x - 1;
			new_y = _y;
		}
		else if (direction === 'right') {
			new_x = _x + 1;
			new_y = _y;
		}
		else if (direction === 'rest') {
			new_x = _x;
			new_y = _y;
		}
		else if (direction === 'funcPhone') {
			this.game.usePhone();
			return;
		}

		if (this.map.canMoveTo(new_x, new_y)) {
			_x = new_x;
			_y = new_y;
			this.map.refresh();

			if (fromKeyboard) {
				// key delay
				this.canMove = false;
				this.afterMove(_x, _y);
				map.reenableMovementForPlayer(this); // key delay can vary by map
			} else {
				// no key delay
				this.afterMove(_x, _y);
			}
		}
	};

	// NOT exposed to player, used for teleporters
	this.moveTo = function (dynamicObject) {
		// no safety checks or anything
		// this method is about as safe as a war zone
		_x = dynamicObject.getX();
		_y = dynamicObject.getY();
		this.display.drawAll(this.map);
	};

	this.afterMove = function (x, y) {
		var player = this;

		this.hasTeleported = false; // necessary to prevent bugs with teleportation

		this.map.hideChapter();
		this.map.moveAllDynamicObjects();

		var onTransport = false;

		// check for collision with transport object
		for (var i = 0; i < this.map.getDynamicObjects().length; i++) {
			var object = this.map.getDynamicObjects()[i];
			if (object.getX() === x && object.getY() === y) {
				var objectDef = this.map.getObjectDefinition(object.getType());
				if (objectDef.transport) {
					onTransport = true;
				}
			}
		}

		// check for collision with static object UNLESS
		// we are on a transport
		if (!onTransport) {
			var objectName = this.map.getGrid()[x][y].type;
			var objectDef = this.map.getObjectDefinition(objectName);
			if (objectDef.type === 'item') {
				this.pickUpItem(objectName, objectDef);
			} else if (objectDef.onCollision) {
				this.game.validateCallback(function () {
					objectDef.onCollision(player, player.game);
				});
			}
		}
	};

	this.killedBy = function (killer) {
		this.game.sound.playSound('hurt');
		this.game.restartLevel();

		this.map.displayChapter('You have been killed by \n' + killer + '!', 'death');
	};

	this.pickUpItem = function (itemName, object) {
		var player = this;

		this.game.addToInventory(itemName);
		map.removeItemFromMap(_x, _y, itemName);
		map.refresh();
		this.game.sound.playSound('pickup');

		if (object.onPickUp) {
			this.game.validateCallback(function () {
				setTimeout(function () {
					object.onPickUp(player, player.game);
				}, 100);
				// timeout is so that written text is not immediately overwritten
				// TODO: play around with Display.writeStatus so that this is
				// not necessary
			});
		}
	};

	this.hasItem = function (itemName) {
		return this.game.checkInventory(itemName);
	};

	this.removeItem = function (itemName) {
		var object = this.game.objects[itemName];

		this.game.removeFromInventory(itemName);
		object.onDrop(this, this.game);
	};

	this.setPhoneCallback = function(func) {
		this._phoneFunc = func;
	};

	// Constructor
	this.init();
}

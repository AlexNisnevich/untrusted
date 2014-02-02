Game.prototype.inventory = [];

Game.prototype.addToInventory = function (itemName) {
	if (this.inventory.indexOf(itemName) === -1) {
		this.inventory.push(itemName);
		this.drawInventory();
	}
};

Game.prototype.checkInventory = function (itemName) {
	return this.inventory.indexOf(itemName) > -1;
};

Game.prototype.removeFromInventory = function (itemName) {
	var object = this.objects[itemName];
	if (!object) {
		throw 'No such item: ' + itemName;
	}

	this.inventory.remove(itemName);
	this.drawInventory();
	
	if (object.onDrop) {
		object.onDrop(this);
	}
};

Game.prototype.setInventoryStateByLevel = function (levelNum) {
	// first remove items that have onDrop effects on UI
	if (levelNum == 1) {
		this.removeFromInventory('computer');
	}
	if (levelNum <= 7) {
		this.removeFromInventory('phone');
	}

	// clear any remaining items from inventory
	this.inventory = [];

	// repopulate inventory by level
	if (levelNum > 1) {
		this.addToInventory('computer');
		$('#editorPane').fadeIn();
		this.editor.refresh();
	}
	if (levelNum > 7) {
		this.addToInventory('phone');
		$('#phoneButton').show();
	}
	if (levelNum > 11) {
		this.addToInventory('redKey');
	}
	if (levelNum > 12) {
		this.addToInventory('greenKey');
	}
	if (levelNum > 13) {
		this.addToInventory('blueKey');
	}
	if (levelNum > 14) {
		this.addToInventory('theAlgorithm');
		this.removeFromInventory('redKey');
		this.removeFromInventory('greenKey');
		this.removeFromInventory('blueKey');
	}
	if (levelNum > 15) {
		this.removeFromInventory('theAlgorithm');
	}
};

Game.prototype.drawInventory = function () {
	var game = this,
        $inventory = $('#inventory');

	if (this.inventory.length > 0) {
		$inventory.text('INVENTORY: ');

		this.inventory.forEach(function (item) {
			var object = game.objects[item];

			$('<span class="item">')
				.attr('title', item)
				.css('color', object.color ? object.color : '#fff')
				.text(object.symbol)
				.appendTo($inventory);
		});
	} else {
		$inventory.html('');
	}
};

/* methods relating to specific inventory items go here */

Game.prototype.usePhone = function () {
	var player = this.map.getPlayer();
	if (player && player.hasItem('phone') && player._canMove) {
		if (player._phoneFunc) {
			this.sound.playSound('select');
			this.validateCallback(player._phoneFunc);
		} else {
			this.sound.playSound('static');
			this.display.writeStatus("Your function phone isn't bound to any function!");
		}
	}
};

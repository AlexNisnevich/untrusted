ROT.Display.prototype.setupEventHandlers = function() {
	// directions for moving entities
	var keys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	// contentEditable is required for canvas elements to detect keyboard events
	$(this.getContainer()).attr("contentEditable", "true");
	this.getContainer().addEventListener("keydown", function(e) {
		if (keys[e.keyCode]) {
			game.map.getPlayer().move(keys[e.keyCode]);
		}
	});

	this.getContainer().addEventListener("click", function(e) {
		$(this).addClass('focus');
		$('.CodeMirror').removeClass('focus');
	});
}

// drawObject takes care of looking up an object's symbol and color
// according to name (NOT according to the actual object literal!)
ROT.Display.prototype.drawObject = function (x, y, object, bgColor, multiplicand) {
	var symbol = objects[object].symbol;
	var color;
	if (objects[object].color) {
		color = objects[object].color;
	} else {
		color = "#fff";
	}

	if (!bgColor) {
		bgColor = "#000";
	}

	if (multiplicand) {
		color = ROT.Color.toHex(ROT.Color.multiply(multiplicand, ROT.Color.fromString(color)));
		bgColor = ROT.Color.toHex(ROT.Color.multiply(multiplicand, ROT.Color.fromString(bgColor)));
	}

	this.draw(x, y, symbol, color, bgColor);
};

ROT.Display.prototype.drawAll = function(map, multiplicand) {
	for (var x = 0; x < dimensions.width; x++) {
		for (var y = 0; y < dimensions.height; y++) {
			this.drawObject(x, y, map.getGrid()[x][y].type, map.getGrid()[x][y].bgColor, multiplicand);
		}
	}
	if (map.getPlayer()) { map.getPlayer().draw(); }
}

ROT.Display.prototype.fadeOut = function (map, callback, i) {
	var display = this;
	if (i <= 0) {
		if (callback) { callback(); }
	} else {
		if (!i) { i = 255; }
		this.drawAll(map, [i, i, i]);
		setTimeout(function () {
			display.fadeOut(map, callback, i-10);
		}, 10);
	}
};

ROT.Display.prototype.fadeIn = function (map, callback, i) {
	var display = this;
	if (i > 255) {
		if (callback) { callback(); }
	} else {
		if (!i) { i = 0; }
		this.drawAll(map, [i, i, i]);
		setTimeout(function () {
			display.fadeIn(map, callback, i+5);
		}, 10);
	}
};

ROT.Display.prototype.write = function(text) {
	this.clear();
	this.drawText(0, 0, text);
}

ROT.Display.prototype.focus = function() {
	$(this.getContainer()).attr('tabindex', '0').click().focus();
}

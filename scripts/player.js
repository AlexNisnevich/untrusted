var Player = function(x,y) {
	this._x = x;
	this._y = y;
	this._rep = "@";
	this._fgColor = "#0f0";
	this.draw();

}

Player.prototype.draw = function () {
	display.draw(this._x, this._y, this._rep, this._fgColor);
}

Player.prototype.atLocation = function (x, y) {
	return (this._x === x && this._y === y);
}

Player.prototype.move = function (direction) {
	var cur_x = this._x;
	var cur_y = this._y;
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
		display.drawObject(cur_x,cur_y, map._grid[cur_x][cur_y]);
		this._x = new_x;
		this._y = new_y;
		this.draw();
		if (objects[map._grid[new_x][new_y]].onCollision) {
			objects[map._grid[new_x][new_y]].onCollision(this);
		}
	}
	else {
		console.log("Can't move to " + new_x + ", " + new_y + ", reported from inside Player.move() method");
	}
};

Player.prototype.killedBy = function (killer) {
	alert('You have been killed by ' + killer + '!');
	getLevel(currentLevel);
}


// directions for moving entities
var keys = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
}

var UP = "up";
var DOWN = "down";
var LEFT = "left";
var RIGHT = "right";

var display;
var player;

var dimensions = {
	width: 80,
	height: 25
};

var map = new Array(dimensions.width);
for (var i = 0; i < dimensions.width; i++) {
	map[i] = new Array(dimensions.height);
}

var objects = {
    'empty' : {
        'symbol': ' ',
        'passable': true
    },

	'block': {
		'symbol': '#',
		'passable': false
	},
	'tree': {
		'symbol': '♣',
		'passable': false
	}
};

function init() {
    display = new ROT.Display({width: dimensions.width, height: dimensions.height});
    document.body.appendChild(display.getContainer());

    display.setOptions( {fontSize: 20, fontStyle : "bold"});

    // all maps start out initialized to completely empty squares
    for (var x = 0; x < dimensions.width; x++) {
        for (var y = 0; y < dimensions.height; y++) {
            map[x][y] = 'empty';
        }
    }

    startLevel1();
}

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

Player.prototype.move = function (direction) {
    var cur_x = this._x;
    var cur_y = this._y;
    var new_x;
    var new_y;

    if (direction === UP) {
        new_x = cur_x;
        new_y = cur_y - 1;
    }
    else if (direction === DOWN) {
        new_x = cur_x;
        new_y = cur_y + 1;
    }
    else if (direction === LEFT) {
        new_x = cur_x - 1;
        new_y = cur_y;
    }
    else if (direction === RIGHT) {
        new_x = cur_x + 1;
        new_y = cur_y;
    }

    if (canMoveTo(new_x,new_y)) {
        display.draw(cur_x,cur_y, objects[map[cur_x][cur_y]].symbol);
        this._x = new_x;
        this._y = new_y;
        this.draw();
    }
    else {
        console.log("Can't move to " + new_x + ", " + new_y + ", reported from inside Player.move() method");
    }
};

function canMoveTo(x,y) {
    return objects[map[x][y]].passable;
}

function placeObject(type, x, y) {
	map[x][y] = type;
	display.draw(x, y, objects[type].symbol);
}

function startLevel1() {
	for (y = 5; y <= dimensions.height - 5; y++) {
    	placeObject('block', 5, y);
    	placeObject('block', dimensions.width - 5, y);
	}

	for (x = 5; x <= dimensions.width - 5; x++) {
    	placeObject('block', x, 5);
    	placeObject('block', x, dimensions.height - 5);
	}

	player = new Player(15, 15);
}

// Event listeners

document.addEventListener("keydown", function(e) {
	console.log(e.keyCode);
    if (keys[e.keyCode]) {
    	player.move(keys[e.keyCode]);
    }
});

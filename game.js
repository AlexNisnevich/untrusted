
var display;
var dimensions = {
	width: 80,
	height: 25
}

var map = new Array(dimensions.width);
for (var i = 0; i < dimensions.width; i++) {
	map[i] = new Array(dimensions.height);
}

var objects = {
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

    startLevel1();
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
}

var pickedUpComputer = false;
var pickedUpPhone = false;

var objects = {
	'empty' : {
		'symbol': ' ',
		'passable': true
	},
	'block': {
		'symbol': '#',
		'color': '#f00',
		'passable': false
	},
	'tree': {
		'symbol': '♣',
		'color': '#080',
		'passable': false
	},
	'trap': {
		'symbol': ' ',
		'passable': true,
		'onCollision': function (player) {
			player.killedBy('an invisible trap');
		}
	},
    'stream': {
        'symbol': '░',
        'passable': true,
        'onCollision': function (player) {
            player.killedBy('drowning in deep dark water');
        }
    },
	'exit' : {
		'symbol' : String.fromCharCode(0x2395), // ⎕
		'color': '#0ff',
		'passable': true,
		'onCollision': function (player) {
			moveToNextLevel();
		}
	},
	'player' : {
		'symbol': '@',
		'color': '#0f0',
		'passable': false
	},
	'computer': {
		'symbol': String.fromCharCode(0x2318), // ⌘
		'color': '#ccc',
		'passable': true,
		'onCollision': function (player) {
			player.pickUpItem();
			pickedUpComputer = true;
			output.write('You have picked up the computer! You can use it to get past the walls to the exit.');
			$('#editorPane').fadeIn();
			editor.refresh();
		}
	},
	'phone': {
		'symbol': String.fromCharCode(0x260E), // ☎
		'passable': true,
		'onCollision': function (player) {
			player.pickUpItem();
			pickedUpPhone = true;
			output.write('You have picked up the function phone! You can use it to call functions, as defined by setPhoneCallback in the level code.');
			$('#phoneButton').show();
		}
	}
};

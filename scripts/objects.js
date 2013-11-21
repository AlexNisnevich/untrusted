/*
Objects can have the following parameters:
	color: '#fff' by default
	impassable: true if it blocks the player from movement (false by default)
	onCollision: function (player, game) called when player moves over the object
	onPickUp: function (player, game) called when player picks up the item
	symbol: Unicode character representing the object
	type: 'item' or null
*/

Game.prototype.objects = {
	// special

	'empty' : {
		'symbol': ' ',
        'impassableFor': ['raft']
	},

	'player' : {
		'symbol': '@',
		'color': '#0f0'
	},

	'exit' : {
		'symbol' : String.fromCharCode(0x2395), // ⎕
		'color': '#0ff',
		'onCollision': function (player, game) {
			game.moveToNextLevel();
		}
	},

	// obstacles

	'block': {
		'symbol': '#',
		'color': '#999',
		'impassable': true
	},

	'tree': {
		'symbol': '♣',
		'color': '#080',
		'impassable': true
	},

	'mine': {
		'symbol': ' ',
		'onCollision': function (player, game) {
			player.killedBy('a hidden mine');
		}
	},

	// items

	'computer': {
		'type': 'item',
		'isGlobal': true,
		'symbol': String.fromCharCode(0x2318), // ⌘
		'color': '#ccc',
		'onPickUp': function (player, game) {
			game.output.write('You have picked up the computer!');
			$('#editorPane').fadeIn();
			game.editor.refresh();
		}
	},

	'phone': {
		'type': 'item',
		'isGlobal': true,
		'symbol': String.fromCharCode(0x260E), // ☎
		'onPickUp': function (player, game) {
			game.output.write('You have picked up the function phone!');
			$('#phoneButton').show();
		}
	},

	'key': {
		'type': 'item',
		'symbol': 'k',
		'onPickUp': function (player, game) {
			game.output.write('You have received a key!');
		}
	}
};

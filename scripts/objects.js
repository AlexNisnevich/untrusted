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
            game._moveToNextLevel();
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

    'trap': {
        'type': 'dynamic',
        'symbol': '*',
        'color': '#f00',
        'onCollision': function (player, game) {
            player.killedBy('a trap');
        },
        'behavior': null
    },

    'teleporter': {
        'type': 'dynamic',
        'symbol' : String.fromCharCode(0x2395), // ⎕
        'color': '#f0f',
        'onCollision': function (player, me) {
            if (!player._hasTeleported) {
                player._moveTo(me.target);
            }
            player._hasTeleported = true;
        },
        'behavior': null
    },

    // items

    'computer': {
        'type': 'item',
        'symbol': String.fromCharCode(0x2318), // ⌘
        'color': '#ccc',
        'onPickUp': function (player, game) {
            $('#editorPane').fadeIn();
            game.editor.refresh();
            game.display.writeStatus('You have picked up the computer!');
        },
        'onDrop': function (game) {
            $('#editorPane').hide();
        }
    },

    'phone': {
        'type': 'item',
        'symbol': String.fromCharCode(0x260E), // ☎
        'onPickUp': function (player, game) {
            game.display.writeStatus('You have picked up the function phone!');
            $('#phoneButton').show();
        },
        'onDrop': function (game) {
            $('#phoneButton').hide();
        }
    },

    'redKey': {
        'type': 'item',
        'symbol': 'k',
        'color': 'red',
        'onPickUp': function (player, game) {
            game.display.writeStatus('You have picked up a red key!');
        }
    },

    'greenKey': {
        'type': 'item',
        'symbol': 'k',
        'color': '#0f0',
        'onPickUp': function (player, game) {
            game.display.writeStatus('You have picked up a green key!');
        }
    },

    'blueKey': {
        'type': 'item',
        'symbol': 'k',
        'color': '#06f',
        'onPickUp': function (player, game) {
            game.display.writeStatus('You have picked up a blue key!');
        }
    },

    'yellowKey': {
        'type': 'item',
        'symbol': 'k',
        'color': 'yellow',
        'onPickUp': function (player, game) {
            game.display.writeStatus('You have picked up a yellow key!');
        }
    },

    'theAlgorithm': {
        'type': 'item',
        'symbol': 'A',
        'color': 'white',
        'onPickUp': function (player, game) {
            game.display.writeStatus('You have picked up the Algorithm!');
        },
        'onDrop': function (game) {
            game.display.writeStatus('You have lost the Algorithm!');
        }
    }
};

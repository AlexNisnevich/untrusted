/*
Objects can have the following parameters:
    color: '#fff' by default
    impassable: true if it blocks the player from movement (false by default)
    onCollision: function (player) called when player moves over the object
    onPickUp: function (player) called when player picks up the item
    symbol: Unicode character representing the object
    type: 'item' or null
*/

// used by bonus levels 01 through 04
function moveToward(obj, type) {
    var target = obj.findNearest(type);
    var leftDist = obj.getX() - target.x;
    var upDist = obj.getY() - target.y;

    var direction;
    if (upDist == 0 && leftDist == 0) {
        return;
    }
    if (upDist > 0 && upDist >= leftDist) {
        direction = 'up';
    } else if (upDist < 0 && upDist < leftDist) {
        direction = 'down';
    } else if (leftDist > 0 && leftDist >= upDist) {
        direction = 'left';
    } else {
        direction = 'right';
    }

    if (obj.canMove(direction)) {
        obj.move(direction);
    }
}

// used by bonus levels 01 through 04
function followAndKeepDistance(obj, type) {
    var target = obj.findNearest(type);
    var leftDist = obj.getX() - target.x;
    var upDist = obj.getY() - target.y;

    if (Math.abs(upDist) < 2 && Math.abs(leftDist) < 4
        || Math.abs(leftDist) < 2 && Math.abs(upDist) < 4) {
        return;
    }
    var direction;
    if (upDist > 0 && upDist >= leftDist) {
        direction = 'up';
    } else if (upDist < 0 && upDist < leftDist) {
        direction = 'down';
    } else if (leftDist > 0 && leftDist >= upDist) {
        direction = 'left';
    } else {
        direction = 'right';
    }

    if (obj.canMove(direction)) {
        obj.move(direction);
    }
}

// used by bonus levels 01 through 04
function killPlayerIfTooFar(obj, map) {
    var target = obj.findNearest('player');
    var leftDist = obj.getX() - target.x;
    var upDist = obj.getY() - target.y;

    if (Math.abs(upDist) > 8 || Math.abs(leftDist) > 8) {
        map.getPlayer().killedBy('"suspicious circumstances"');
    }
}

Game.prototype.getListOfObjects = function () {
    var game = this;
    return {
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
            'onCollision': function (player) {
                if (!game.map.finalLevel) {
                    game._callUnexposedMethod(function () {
                        game._moveToNextLevel();
                    });
                }
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
            'onCollision': function (player) {
                player.killedBy('a hidden mine');
            }
        },

        'trap': {
            'type': 'dynamic',
            'symbol': '*',
            'color': '#f00',
            'onCollision': function (player, me) {
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
                    if (me.target) {
                        game._callUnexposedMethod(function () {
                            player._moveTo(me.target);
                        });
                    } else {
                        throw 'TeleporterError: Missing target for teleporter'
                    }
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
            'onPickUp': function (player) {
                $('#editorPane, #savedLevelMsg').fadeIn();
                game.editor.refresh();
                game.map.writeStatus('You have picked up the computer!');
            },
            'onDrop': function () {
                $('#editorPane, #savedLevelMsg').hide();
            }
        },

        'phone': {
            'type': 'item',
            'minimumLevel': 7,
            'symbol': String.fromCharCode(0x260E), // ☎
            'onPickUp': function (player) {
                game.map.writeStatus('You have picked up the function phone!');
                $('#phoneButton').show();
            },
            'onDrop': function () {
                $('#phoneButton').hide();
            }
        },

        'redKey': {
            'type': 'item',
            'minimumLevel': 11,
            'symbol': 'k',
            'color': 'red',
            'onPickUp': function (player) {
                game.map.writeStatus('You have picked up a red key!');
            }
        },

        'greenKey': {
            'type': 'item',
            'minimumLevel': 12,
            'symbol': 'k',
            'color': '#0f0',
            'onPickUp': function (player) {
                game.map.writeStatus('You have picked up a green key!');
            }
        },

        'blueKey': {
            'type': 'item',
            'minimumLevel': 13,
            'symbol': 'k',
            'color': '#06f',
            'onPickUp': function (player) {
                game.map.writeStatus('You have picked up a blue key!');
            }
        },

        'yellowKey': {
            'type': 'item',
            'minimumLevel': 14,
            'symbol': 'k',
            'color': 'yellow',
            'onPickUp': function (player) {
                game.map.writeStatus('You have picked up a yellow key!');
            }
        },

        'theAlgorithm': {
            'minimumLevel': 14,
            'type': 'item',
            'symbol': 'A',
            'color': 'white',
            'onPickUp': function (player) {
                game.map.writeStatus('You have picked up the Algorithm!');
            },
            'onDrop': function () {
                game.map.writeStatus('You have lost the Algorithm!');
            }
        },

        // used by bonus levels 01 through 04
        'eye': {
            'type': 'dynamic',
            'symbol': 'E',
            'color': 'red',
            'behavior': function (me) {
                followAndKeepDistance(me, 'player');
                killPlayerIfTooFar(me, game.map);
            },
            'onCollision': function (player) {
                player.killedBy('"the eye"');
            },
        },

        // used by bonus levels 01 through 04
        'guard': {
            'type': 'dynamic',
            'symbol': 'd',
            'color': 'red',
            'behavior': function (me) {
                moveToward(me, 'player');
            },
            'onCollision': function (player) {
                player.killedBy('a guard drone');
            },
        }
    };
};

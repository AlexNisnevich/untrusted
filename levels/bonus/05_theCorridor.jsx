#BEGIN_PROPERTIES#
{
    "version": "0.1",
    "commandsIntroduced": []
}
#END_PROPERTIES#
/***********************
 * theCorridor.js      *
 * from HangoverX      *
 * by mongoose11235813 *
 ***********************
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.displayChapter('Chapter 4.1\nChapters are supposed to be more than one level long');

    map.defineObject('trap_left', {
        'type': 'dynamic',
        'symbol': '>',
        'color': '#900',
        'impassable': 'true',
        'behavior': function (me) {
            trap_behaviour(me, 1, 6);
        }
    }
    );
    map.defineObject('trap_right', {
        'type': 'dynamic',
        'symbol': '<',
        'color': '#900',
        'impassable': 'true',
        'behavior': function (me) {
            trap_behaviour(me, -5, 0);
        }
    }
    );
    map.defineObject('laser', {
        'type': 'dynamic',
        'symbol': '-',
        'color': '#f00',
        'onCollision': function (player) {
            player.killedBy('a laser');
        }
    }
    );
    function trap_behaviour (me, left, right) {
        var player_pos = me.findNearest('player');
        if (player_pos.y - me.getY() <= 1 && !me.trapTriggered) {
            me.trapTriggered = true;
            for (var x = left; x < right; ++x) {
                map.placeObject(me.getX() + x, me.getY(), 'laser')
            }
        }
    }

    var level_map = [
        '#######',
        '#  x  #',
        '#     #',
        '>     #',
        '#     #',
        '#     <',
        '#     #',
        '>     #',
        '#     #',
        '#     <',
        '#     #',
        '#  @ e#',
        '#######'
    ]
    var width = map.getWidth();
    var height = map.getHeight();
    var map_left = Math.floor((width - level_map[0].length) / 2);
    var map_top = Math.floor((height - level_map.length) / 2);
    map.createFromGrid(level_map, {
      'x': 'exit',
      '#': 'block',
      '@': 'player',
      'e': 'eye',
      '>': 'trap_left',
      '<': 'trap_right'
    }, map_left, map_top);

#BEGIN_EDITABLE#

#END_EDITABLE#
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}

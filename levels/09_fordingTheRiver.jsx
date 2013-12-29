#BEGIN_PROPERTIES#
{
    "commandsIntroduced":
        ["player.killedBy", "object.onCollision"],
    "music": "Sycamore_Drive_-_03_-_The_Waves_Call_Her_Name"
}
#END_PROPERTIES#
/**********************
 * fordingTheRiver.js *
 **********************
 *
 * And there's the river. Fortunately, I was prepared for this.
 * See the raft on the other side?
 *
 * Everything is going according to plan.
 */

function startLevel(map) {
    var raftDirection = 'down';

    map.placePlayer(map.getWidth()-1, map.getHeight()-1);

    map.defineObject('raft', {
        'type': 'dynamic',
        'symbol': '#',
        'color': 'gray',
        'transport': true, // (prevents player from drowning in water)
        'behavior': function (me) {
            me.move(raftDirection);
        }
    });

    map.defineObject('water', {
        'symbol': '░',
        'color': '#44f',
        'onCollision': function (player) {
            player.killedBy('drowning in deep dark water');
        }
    });

    for (var x = 0; x < map.getWidth(); x++) {
        for (var y = 5; y < 15; y++) {
            map.placeObject(x, y, 'water');
        }
    }

    map.placeObject(20, 5, 'raft');
    map.placeObject(0, 2, 'exit');
    map.placeObject(0, 1, 'block');
    map.placeObject(1, 1, 'block');
    map.placeObject(0, 3, 'block');
    map.placeObject(1, 3, 'block');

#BEGIN_EDITABLE#



#END_EDITABLE#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}

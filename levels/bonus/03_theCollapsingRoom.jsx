#BEGIN_PROPERTIES#
{
    "version": "0.1.1",
    "commandsIntroduced": [],
    "nextBonusLevel": "04_theGuard.jsx"
}
#END_PROPERTIES#
/************************
 * theCollapsingRoom.js *
 *    from HangoverX    *
 *    by janosgyerik    *
 ************************
 *
 * As you step through the portal, bright flash of white light.
 * You feel... different. But the worst news is, the room seems
 * to be collapsing on you. I mean, MASSIVE CEILING BLOCKS are
 * falling, man, do something!
 *
 * Good thing you found a place in the security system to inject
 * your custom code, maybe that can help!
 */

function startLevel(map) {
#START_OF_START_LEVEL#
    map.displayChapter('Chapter 3\nThe Collapsing Room');

    var width = map.getWidth();
    var height = map.getHeight();
    var half_width = Math.floor(width / 2);
    var half_height = Math.floor(height / 2);
    var grid_x = Math.floor(width / 4);
    var grid_y = Math.floor(height / 4);

    for (var i = 0; i < half_width; ++i) {
        map.placeObject(grid_x + i, grid_y, 'block');
        map.placeObject(grid_x + i, grid_y + half_height - 1, 'block');
    }
    for (var i = 1; i < half_height; ++i) {
        map.placeObject(grid_x, grid_y + i, 'block');
        map.placeObject(grid_x + half_width - 1, grid_y + i, 'block');
    }

    map.placePlayer(half_width, half_height);
    map.placeObject(half_width + 2, half_height + 2, 'eye');

    var exit_x, exit_y;
    switch (Math.floor(Math.random() * 4)) {
        case 0:
            exit_x = grid_x + 1;
            exit_y = grid_y + 1;
            break;
        case 1:
            exit_x = grid_x - 2 + half_width;
            exit_y = grid_y + 1;
            break;
        case 2:
            exit_x = grid_x - 2 + half_width;
            exit_y = grid_y - 2 + half_height;
            break;
        case 3:
            exit_x = grid_x + 1;
            exit_y = grid_y - 2 + half_height;
            break;
    }
    map.placeObject(exit_x, exit_y, 'exit');

#BEGIN_EDITABLE#

#END_EDITABLE#

    function bringItDown(map, blocks_per_round) {
        for (var count = 0, z = 0; count < blocks_per_round && z < 100; ++z) {
            var x = grid_x + 1 + Math.floor(Math.random() * (half_width - 2));
            var y = grid_y + 1 + Math.floor(Math.random() * (half_height - 2));
            if (map.getPlayer().atLocation(x, y)) {
                map.getPlayer().killedBy('massive ceiling block');
            }
            if (map.getObjectTypeAt(x, y) !== 'empty') {
                continue;
            }
            map.placeObject(x, y, 'block');
            ++count;
        }
    }

    map.defineObject('rainmaker', {
        'type': 'dynamic',
        'symbol': ' ',
        'behavior': function() {
            bringItDown(map, 10);
        }
    });
    map.placeObject(1, 1, 'rainmaker');
#END_OF_START_LEVEL#
}

function validateLevel(map) {
    map.validateExactlyXManyObjects(1, 'exit');
}
